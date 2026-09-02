import { create } from 'zustand';
import { ClimateGridResult, ClimateSamplePoint, RegionCandidate, LayerMode, RainfallScaleMode } from '../types';
import { generateClimateGrid } from '../utils/geoData';
import { fetchClimateGridData, fetchGeeTileUrl } from '../api/climateApi';
import { useMapStore } from './useMapStore';

const VARIABLE_NAMES: Record<string, string> = {
  temperature_2m_mean: 'Mean Temperature',
  temperature_2m_max: 'Maximum Temperature',
  temperature_2m_min: 'Minimum Temperature',
  precipitation_sum: 'Total Precipitation',
  wind_speed_10m_max: 'Maximum Wind Speed',
  relative_humidity_2m_mean: 'Relative Humidity',
  snow_depth_max: 'Snow Depth',
  soil_moisture_0_to_7cm_mean: 'Soil Moisture',
  wind_gusts_10m_max: 'Wind Gusts',
  cloud_cover_mean: 'Cloud Cover',
  surface_solar_radiation: 'Surface Solar Radiation',
  shortwave_radiation_sum: 'Solar Sunshine',
  snowfall_sum: 'Total Snowfall',
  soil_moisture_0_to_7cm: 'Soil Moisture',
  et0_fao_evapotranspiration: 'Evapotranspiration',
  pressure_msl_mean: 'Sea-Level Pressure',
};

// Helper: Calculate default 1-year historical window from current date
export function getDefaultDateRange(): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  const past = new Date(now);
  past.setFullYear(past.getFullYear() - 1);
  const start = past.toISOString().split('T')[0];
  return { start, end };
}

const defaultDates = getDefaultDateRange();

export function computeRainfallBounds(
  mode: RainfallScaleMode,
  customMin: number,
  customMax: number,
  startDate: string,
  endDate: string,
  points: ClimateSamplePoint[] = []
): { min: number; max: number; label: string } {
  if (mode === 'auto' && points && points.length > 0) {
    const vals = points
      .map((p) => p.value)
      .filter((v): v is number => typeof v === 'number' && !isNaN(v));
    if (vals.length > 0) {
      let min = Math.floor(Math.min(...vals));
      let max = Math.ceil(Math.max(...vals));
      if (min === max) max = min + 50;
      return { min, max, label: `${min} ───── ${max} mm (Auto)` };
    }
  }

  if (mode === 'custom') {
    const min = isNaN(customMin) ? 0 : customMin;
    let max = isNaN(customMax) ? 800 : customMax;
    if (max <= min) max = min + 50;
    return { min, max, label: `${min}–${max} mm (Custom)` };
  }

  // Standard mode: adaptive to time-window duration
  const q = new Date(startDate).getTime();
  const c = new Date(endDate).getTime();
  const days = Math.abs(c - q) / (1000 * 60 * 60 * 24);

  if (days <= 45) {
    return { min: 0, max: 400, label: '0–400 mm (Monthly)' };
  }
  if (days <= 180) {
    return { min: 0, max: 1000, label: '0–1,000 mm (Seasonal)' };
  }
  return { min: 0, max: 2500, label: '0–2,500 mm (Annual)' };
}

interface ClimateState {
  selectedVariable: string;
  aggregationMode: 'mean' | 'max' | 'min';
  rainfallScaleMode: RainfallScaleMode;
  rainfallCustomMin: number;
  rainfallCustomMax: number;
  appliedRainfallBounds: { min: number; max: number; label: string } | null;
  startDate: string;
  endDate: string;
  gridSize: number; // 4 to 16
  showRasterLayer: boolean;
  showPointGrid: boolean;
  activeLayerMode: LayerMode;
  geeTileUrl: string | null;
  isTileLoading: boolean;
  isUsingGeeTiles: boolean;
  gridResult: ClimateGridResult;
  hoveredPoint: ClimateSamplePoint | null;
  isLoadingClimate: boolean;
  climateError: string | null;

  setSelectedVariable: (variable: string) => void;
  setAggregationMode: (mode: 'mean' | 'max' | 'min') => void;
  setRainfallScaleMode: (mode: RainfallScaleMode) => void;
  setRainfallCustomRange: (min: number, max: number) => void;
  applyRainfallScale: () => Promise<void>;
  setDateRange: (start: string, end: string) => void;
  setGridSize: (size: number) => void;
  setShowRasterLayer: (show: boolean) => void;
  setShowPointGrid: (show: boolean) => void;
  setHoveredPoint: (pt: ClimateSamplePoint | null) => void;
  executeSampling: (targetCandidate?: RegionCandidate | null) => Promise<void>;
  resetGrid: () => void;
}

const emptyGridResult: ClimateGridResult = {
  status: 'ok',
  variable: 'temperature_2m_mean',
  variable_name: 'Mean Temperature',
  aggregation_mode: 'mean',
  start_date: defaultDates.start,
  end_date: defaultDates.end,
  points: [],
  stats: {
    mean: 0,
    min: 0,
    max: 0,
    std: 0,
    p10: 0,
    p90: 0,
    decadal_trend: 0,
    baseline_diff: 0,
  },
};

export const useClimateStore = create<ClimateState>((set, get) => ({
  selectedVariable: 'temperature_2m_mean',
  aggregationMode: 'mean',
  rainfallScaleMode: 'standard',
  rainfallCustomMin: 0,
  rainfallCustomMax: 800,
  appliedRainfallBounds: null,
  startDate: defaultDates.start,
  endDate: defaultDates.end,
  gridSize: 8,
  showRasterLayer: true,
  showPointGrid: true,
  activeLayerMode: 'none',
  geeTileUrl: null,
  isTileLoading: false,
  isUsingGeeTiles: true,
  gridResult: emptyGridResult,
  hoveredPoint: null,
  isLoadingClimate: false,
  climateError: null,

  setSelectedVariable: (variable) => set({ selectedVariable: variable }),
  setAggregationMode: (mode) => set({ aggregationMode: mode }),
  setRainfallScaleMode: (mode) => set({ rainfallScaleMode: mode }),
  setRainfallCustomRange: (min, max) =>
    set({ rainfallCustomMin: min, rainfallCustomMax: max }),

  setDateRange: (start, end) => set({ startDate: start, endDate: end }),
  setGridSize: (size) => set({ gridSize: size }),
  setShowRasterLayer: (show) => set({ showRasterLayer: show }),
  setShowPointGrid: (show) => set({ showPointGrid: show }),
  setHoveredPoint: (pt) => set({ hoveredPoint: pt }),

  resetGrid: () =>
    set({
      gridResult: emptyGridResult,
      geeTileUrl: null,
      activeLayerMode: 'none',
      isTileLoading: false,
      climateError: null,
      appliedRainfallBounds: null,
    }),

  applyRainfallScale: async () => {
    const s = get();
    const mapState = useMapStore.getState();
    const targetRegion = mapState.selectedRegion || mapState.activeRegion;
    if (!targetRegion) return;

    const regionName = targetRegion.short_name || targetRegion.display_name;
    const bounds = computeRainfallBounds(
      s.rainfallScaleMode,
      s.rainfallCustomMin,
      s.rainfallCustomMax,
      s.startDate,
      s.endDate,
      s.gridResult.points
    );

    set({ appliedRainfallBounds: bounds, isTileLoading: true });

    try {
      const tileRes = await fetchGeeTileUrl({
        region_name: regionName,
        country_code: targetRegion.country_code_3 || targetRegion.country_code_2 || 'WLD',
        admin_level: mapState.adminLevel ?? targetRegion.admin_level_hint ?? 1,
        osm_id: targetRegion.osm_id,
        osm_type: targetRegion.osm_type,
        parent_chain: targetRegion.parent_chain || [],
        variable: s.selectedVariable,
        start_date: s.startDate,
        end_date: s.endDate,
        aggregation_mode: s.aggregationMode,
        vis_min: bounds.min,
        vis_max: bounds.max,
      });

      if (tileRes.status === 'ok' && tileRes.tile_url) {
        set({
          geeTileUrl: tileRes.tile_url,
          activeLayerMode: 'gee_tiles',
          isUsingGeeTiles: true,
          isTileLoading: false,
        });
      } else {
        set({ isTileLoading: false });
      }
    } catch (err) {
      console.warn('[climate] Failed to apply custom rainfall scale to GEE tiles:', err);
      set({ isTileLoading: false });
    }
  },

  executeSampling: async (targetCandidate) => {
    const s = get();
    const mapState = useMapStore.getState();
    const targetRegion = targetCandidate || mapState.selectedRegion || mapState.activeRegion;
    if (!targetRegion) return;

    const regionName = targetRegion.short_name || targetRegion.display_name;

    // Determine initial visual bounds for precipitation
    let visMin: number | undefined = undefined;
    let visMax: number | undefined = undefined;
    let computedBounds = s.appliedRainfallBounds;

    if (s.selectedVariable === 'precipitation_sum') {
      computedBounds = computeRainfallBounds(
        s.rainfallScaleMode,
        s.rainfallCustomMin,
        s.rainfallCustomMax,
        s.startDate,
        s.endDate,
        s.gridResult.points
      );
      visMin = computedBounds.min;
      visMax = computedBounds.max;
    }

    set({
      isLoadingClimate: true,
      isTileLoading: true,
      climateError: null,
      appliedRainfallBounds: computedBounds,
    });

    // ── 1. Fast Path: Immediately fetch GEE dynamic tile URL for instant MapLibre GPU rendering (<500ms)
    const tilePromise = fetchGeeTileUrl({
      region_name: regionName,
      country_code: targetRegion.country_code_3 || targetRegion.country_code_2 || 'WLD',
      admin_level: mapState.adminLevel ?? targetRegion.admin_level_hint ?? 1,
      osm_id: targetRegion.osm_id,
      osm_type: targetRegion.osm_type,
      parent_chain: targetRegion.parent_chain || [],
      variable: s.selectedVariable,
      start_date: s.startDate,
      end_date: s.endDate,
      aggregation_mode: s.aggregationMode,
      vis_min: visMin,
      vis_max: visMax,
    })
      .then((tileRes) => {
        if (tileRes.status === 'ok' && tileRes.tile_url) {
          set({
            geeTileUrl: tileRes.tile_url,
            activeLayerMode: 'gee_tiles',
            isUsingGeeTiles: true,
            isTileLoading: false,
          });
          return true;
        }
        return false;
      })
      .catch((err) => {
        console.info('[useClimateStore] GEE dynamic tiles unavailable, falling back to Canvas mode:', err);
        set({
          geeTileUrl: null,
          activeLayerMode: 'canvas_sampling',
          isUsingGeeTiles: false,
          isTileLoading: false,
        });
        return false;
      });

    // ── 2. Telemetry Path: Fetch numeric statistics and station points
    try {
      const response = await fetchClimateGridData({
        region_name: regionName,
        country_code: targetRegion.country_code_3 || targetRegion.country_code_2 || 'WLD',
        admin_level: mapState.adminLevel ?? targetRegion.admin_level_hint ?? 1,
        osm_id: targetRegion.osm_id,
        osm_type: targetRegion.osm_type,
        parent_chain: targetRegion.parent_chain || [],
        clip: true,
        variable: s.selectedVariable,
        start_date: s.startDate,
        end_date: s.endDate,
        grid_size: s.gridSize,
        aggregation_mode: s.aggregationMode,
      });

      await tilePromise;

      if (response.status === 'ok' && response.points) {
        // If rainfall in auto mode, update computed bounds with the newly received points
        let updatedRainfallBounds = computedBounds;
        if (s.selectedVariable === 'precipitation_sum' && s.rainfallScaleMode === 'auto') {
          updatedRainfallBounds = computeRainfallBounds(
            'auto',
            s.rainfallCustomMin,
            s.rainfallCustomMax,
            s.startDate,
            s.endDate,
            response.points
          );
        }

        set((current) => ({
          gridResult: {
            status: 'ok',
            region_name: response.region_name,
            variable: response.variable,
            variable_name: VARIABLE_NAMES[response.variable] || response.variable,
            aggregation_mode: response.aggregation_mode || current.aggregationMode,
            start_date: response.start_date,
            end_date: response.end_date,
            points: response.points,
            stats: response.stats,
            notice: response.notice,
          },
          appliedRainfallBounds: updatedRainfallBounds,
          activeLayerMode: current.geeTileUrl ? 'gee_tiles' : 'canvas_sampling',
          isLoadingClimate: false,
          climateError: null,
        }));
        return;
      }
    } catch (err: any) {
      console.warn('[climate] Backend climate sampling fallback:', err);
      const fallbackResult = generateClimateGrid(
        regionName,
        s.selectedVariable,
        s.gridSize,
        s.startDate,
        s.endDate
      );
      set({
        gridResult: fallbackResult,
        activeLayerMode: 'canvas_sampling',
        isUsingGeeTiles: false,
        isLoadingClimate: false,
        isTileLoading: false,
        climateError: err?.message || 'Using local climate estimate',
      });
    }
  },
}));
