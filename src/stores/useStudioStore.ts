// ── TerraFlux Scientific Figure Studio Store ──────────────────────────────

import { create } from 'zustand';
import {
  FigureRequest,
  FigureTypeKey,
  AspectRatioPresetKey,
  VisualThemeKey,
  FigureCatalog,
  RainfallScaleMode,
} from '../types';
import { useMapStore } from './useMapStore';
import { useClimateStore, computeRainfallBounds } from './useClimateStore';
import { previewFigure, fetchFigureCatalog } from '../api/figureApi';

interface StudioState {
  isStudioOpen: boolean;
  isSaveMapOpen: boolean;
  request: FigureRequest;
  saveMapRequest: FigureRequest;
  previewBase64: string | null;
  saveMapPreviewBase64: string | null;
  isLoadingPreview: boolean;
  isLoadingSaveMapPreview: boolean;
  previewError: string | null;
  saveMapPreviewError: string | null;
  isExporting: boolean;
  exportStatusMessage: string | null;
  catalog: FigureCatalog | null;

  openStudio: (initialOverrides?: Partial<FigureRequest>) => Promise<void>;
  closeStudio: () => void;
  openSaveMapModal: (initialOverrides?: Partial<FigureRequest>) => Promise<void>;
  closeSaveMapModal: () => void;
  fetchPreview: () => Promise<void>;
  fetchSaveMapPreview: () => Promise<void>;
  loadCatalog: () => Promise<void>;
  setFigureType: (type: FigureTypeKey | string) => void;
  setVariable: (variable: string) => void;
  setYearRange: (startYear: number, endYear: number) => void;
  setBaselinePeriod: (baseline: string) => void;
  setPreset: (preset: AspectRatioPresetKey | string) => void;
  setSaveMapPreset: (preset: AspectRatioPresetKey | string) => void;
  setTheme: (theme: VisualThemeKey | string) => void;
  setSaveMapTheme: (theme: VisualThemeKey | string) => void;
  setSaveMapRainfallScale: (mode: RainfallScaleMode, min?: number, max?: number) => void;
  setDpi: (dpi: number) => void;
  setFormat: (format: 'png' | 'svg' | 'pdf' | string) => void;
  setExporting: (exporting: boolean, message?: string | null) => void;
}

const defaultChartRequest: FigureRequest = {
  figure_type: 'anomaly',
  region_name: 'Pakistan',
  country_code: 'PAK',
  admin_level: 0,
  variable: 'temperature_2m_mean',
  start_year: 1980,
  end_year: 2025,
  baseline_period: '1991-2020',
  preset: 'presentation_16_9',
  theme: 'publication_light',
  format: 'png',
  dpi: 300,
};

const defaultSaveMapRequest: FigureRequest = {
  figure_type: 'spatial_map',
  region_name: 'Pakistan',
  country_code: 'PAK',
  admin_level: 0,
  variable: 'temperature_2m_mean',
  start_year: 1980,
  end_year: 2025,
  baseline_period: '1991-2020',
  preset: 'presentation_16_9',
  theme: 'publication_light',
  format: 'png',
  dpi: 300,
};

let previewDebounceTimer: any = null;
let saveMapPreviewDebounceTimer: any = null;

export const useStudioStore = create<StudioState>((set, get) => ({
  isStudioOpen: false,
  isSaveMapOpen: false,
  request: defaultChartRequest,
  saveMapRequest: defaultSaveMapRequest,
  previewBase64: null,
  saveMapPreviewBase64: null,
  isLoadingPreview: false,
  isLoadingSaveMapPreview: false,
  previewError: null,
  saveMapPreviewError: null,
  isExporting: false,
  exportStatusMessage: null,
  catalog: null,

  openStudio: async (overrides) => {
    const mapState = useMapStore.getState();
    const climateState = useClimateStore.getState();
    const region = mapState.selectedRegion || mapState.activeRegion;

    const locName = region ? (region.short_name || (region.display_name || '').split(',')[0].trim()) : 'Pakistan';
    const cc = region ? (region.country_code_3 || region.country_code_2 || 'PAK') : 'PAK';
    const admLevel = region ? (region.admin_level_hint ?? 0) : 0;
    const curVar = climateState.selectedVariable || 'temperature_2m_mean';

    const sYear = climateState.startDate ? parseInt(climateState.startDate.split('-')[0]) : 1980;
    const eYear = climateState.endDate ? parseInt(climateState.endDate.split('-')[0]) : 2025;

    const newRequest: FigureRequest = {
      ...get().request,
      figure_type: (overrides?.figure_type as string) || 'anomaly',
      region_name: locName,
      country_code: cc,
      admin_level: admLevel,
      osm_id: region ? region.osm_id : null,
      osm_type: region ? region.osm_type : null,
      parent_chain: region ? (region.parent_chain || []) : [],
      latitude: region ? region.lat : 30.3753,
      longitude: region ? region.lon : 69.3451,
      variable: curVar,
      start_year: isNaN(sYear) ? 1980 : sYear,
      end_year: isNaN(eYear) ? 2025 : eYear,
      start_date: climateState.startDate,
      end_date: climateState.endDate,
      ...(overrides || {}),
    };

    set({ isStudioOpen: true, isSaveMapOpen: false, request: newRequest });
    await get().fetchPreview();
  },

  closeStudio: () => set({ isStudioOpen: false }),

  openSaveMapModal: async (overrides) => {
    const mapState = useMapStore.getState();
    const climateState = useClimateStore.getState();
    const region = mapState.selectedRegion || mapState.activeRegion;

    const locName = region ? (region.short_name || (region.display_name || '').split(',')[0].trim()) : 'Pakistan';
    const cc = region ? (region.country_code_3 || region.country_code_2 || 'PAK') : 'PAK';
    const admLevel = region ? (region.admin_level_hint ?? 0) : 0;
    const curVar = climateState.selectedVariable || 'temperature_2m_mean';

    const sYear = climateState.startDate ? parseInt(climateState.startDate.split('-')[0]) : 1980;
    const eYear = climateState.endDate ? parseInt(climateState.endDate.split('-')[0]) : 2025;

    // Calculate effective visual scale bounds for precipitation
    let vmin: number | undefined = undefined;
    let vmax: number | undefined = undefined;
    if (curVar === 'precipitation_sum') {
      const bounds = computeRainfallBounds(
        climateState.rainfallScaleMode,
        climateState.rainfallCustomMin,
        climateState.rainfallCustomMax,
        climateState.startDate,
        climateState.endDate,
        climateState.gridResult.points
      );
      vmin = bounds.min;
      vmax = bounds.max;
    }

    const hasLiveGrid = climateState.gridResult.points && climateState.gridResult.points.length >= 3;

    const newMapRequest: FigureRequest = {
      ...get().saveMapRequest,
      figure_type: 'spatial_map',
      region_name: locName,
      country_code: cc,
      admin_level: admLevel,
      osm_id: region ? region.osm_id : null,
      osm_type: region ? region.osm_type : null,
      parent_chain: region ? (region.parent_chain || []) : [],
      latitude: region ? region.lat : 30.3753,
      longitude: region ? region.lon : 69.3451,
      variable: curVar,
      start_year: isNaN(sYear) ? 1980 : sYear,
      end_year: isNaN(eYear) ? 2025 : eYear,
      start_date: climateState.startDate,
      end_date: climateState.endDate,
      grid_size: climateState.gridSize || 8,
      vis_min: vmin,
      vis_max: vmax,
      rainfall_scale_mode: climateState.rainfallScaleMode,
      climate_grid: hasLiveGrid ? climateState.gridResult.points : undefined,
      ...(overrides || {}),
    };

    set({ isSaveMapOpen: true, isStudioOpen: false, saveMapRequest: newMapRequest });
    await get().fetchSaveMapPreview();
  },

  closeSaveMapModal: () => set({ isSaveMapOpen: false }),

  loadCatalog: async () => {
    try {
      const cat = await fetchFigureCatalog();
      set({ catalog: cat });
    } catch (e) {
      console.warn('[studio] Catalog load fallback:', e);
    }
  },

  fetchPreview: async () => {
    clearTimeout(previewDebounceTimer);
    previewDebounceTimer = setTimeout(async () => {
      const req = get().request;
      set({ isLoadingPreview: true, previewError: null });

      try {
        const res = await previewFigure(req);
        if (res.status === 'success' && res.image_base64) {
          set({
            previewBase64: res.image_base64,
            isLoadingPreview: false,
            previewError: null,
          });
          return;
        }
      } catch (err: any) {
        console.warn('[studio] Server preview error:', err);
        set({
          isLoadingPreview: false,
          previewError: err?.message || 'Server preview failed',
        });
      }
    }, 300);
  },

  fetchSaveMapPreview: async () => {
    clearTimeout(saveMapPreviewDebounceTimer);
    saveMapPreviewDebounceTimer = setTimeout(async () => {
      const req = get().saveMapRequest;
      set({ isLoadingSaveMapPreview: true, saveMapPreviewError: null });

      try {
        const res = await previewFigure(req);
        if (res.status === 'success' && res.image_base64) {
          set({
            saveMapPreviewBase64: res.image_base64,
            isLoadingSaveMapPreview: false,
            saveMapPreviewError: null,
          });
          return;
        }
      } catch (err: any) {
        console.warn('[studio] Server save-map preview error:', err);
        set({
          isLoadingSaveMapPreview: false,
          saveMapPreviewError: err?.message || 'Server map preview failed',
        });
      }
    }, 300);
  },

  setFigureType: (type) => {
    set((state) => ({ request: { ...state.request, figure_type: type } }));
    get().fetchPreview();
  },

  setVariable: (variable) => {
    set((state) => ({ request: { ...state.request, variable } }));
    get().fetchPreview();
  },

  setYearRange: (startYear, endYear) => {
    set((state) => ({
      request: { ...state.request, start_year: startYear, end_year: endYear },
    }));
    get().fetchPreview();
  },

  setBaselinePeriod: (baseline) => {
    set((state) => ({ request: { ...state.request, baseline_period: baseline } }));
    get().fetchPreview();
  },

  setPreset: (preset) => {
    set((state) => ({ request: { ...state.request, preset } }));
    get().fetchPreview();
  },

  setSaveMapPreset: (preset) => {
    set((state) => ({ saveMapRequest: { ...state.saveMapRequest, preset } }));
    get().fetchSaveMapPreview();
  },

  setTheme: (theme) => {
    set((state) => ({ request: { ...state.request, theme } }));
    get().fetchPreview();
  },

  setSaveMapTheme: (theme) => {
    set((state) => ({ saveMapRequest: { ...state.saveMapRequest, theme } }));
    get().fetchSaveMapPreview();
  },

  setSaveMapRainfallScale: (mode: RainfallScaleMode, min?: number, max?: number) => {
    const climateState = useClimateStore.getState();
    const curReq = get().saveMapRequest;
    const customMin = typeof min === 'number' ? min : climateState.rainfallCustomMin;
    const customMax = typeof max === 'number' ? max : climateState.rainfallCustomMax;
    const bounds = computeRainfallBounds(
      mode,
      customMin,
      customMax,
      curReq.start_date || climateState.startDate,
      curReq.end_date || climateState.endDate,
      curReq.climate_grid || climateState.gridResult.points
    );

    set((state) => ({
      saveMapRequest: {
        ...state.saveMapRequest,
        rainfall_scale_mode: mode,
        vis_min: bounds.min,
        vis_max: bounds.max,
      },
    }));
    get().fetchSaveMapPreview();
  },

  setDpi: (dpi) => set((state) => ({ request: { ...state.request, dpi } })),

  setFormat: (format) => set((state) => ({ request: { ...state.request, format } })),

  setExporting: (exporting, message = null) =>
    set({ isExporting: exporting, exportStatusMessage: message }),
}));
