// ── TerraFlux WebGIS Map Store ─────────────────────────────────────────────

import { create } from 'zustand';
import { RegionCandidate, AdminLevel, GeoJsonFeatureCollection, BoundaryRequest } from '../types';
import {
  WORLD_REGIONS,
  getRegionFeatureCollection,
  getInvertedWorldFeatureCollection,
  buildInvertedWorldMask,
  computeFeatureBbox,
} from '../utils/geoData';
import { fetchBoundaryGeoJson } from '../api/boundaryApi';

const emptyFeatureCollection: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

interface MapState {
  selectedRegion: RegionCandidate | null;
  activeRegion: RegionCandidate | null;
  adminLevel: AdminLevel;
  invertedMaskEnabled: boolean;
  basemapStyle: 'light' | 'topo' | 'satellite' | 'dark';
  camera: {
    center: [number, number]; // [lon, lat]
    zoom: number;
    pitch: number;
    bearing: number;
  };
  activeGeoJson: GeoJsonFeatureCollection;
  invertedMaskGeoJson: GeoJsonFeatureCollection;
  activeBbox: [number, number, number, number] | null;
  targetFitBbox: [number, number, number, number] | null;
  isLoadingBoundary: boolean;
  hasLoadedMap: boolean;
  boundaryNotice: string | null;
  boundaryStrategy: string | null;
  boundaryError: string | null;

  selectRegion: (region: RegionCandidate) => void;
  clearSelectedRegion: () => void;
  setAdminLevel: (lvl: AdminLevel) => void;
  fetchBoundaryAndApply: () => Promise<boolean>;
  toggleInvertedMask: () => void;
  setInvertedMask: (enabled: boolean) => void;
  setBasemapStyle: (style: 'light' | 'topo' | 'satellite' | 'dark') => void;
  setCamera: (camera: Partial<MapState['camera']>) => void;
  clearTargetFitBbox: () => void;
  resetCamera: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  selectedRegion: null,
  activeRegion: null,
  adminLevel: 1,
  invertedMaskEnabled: true,
  basemapStyle: 'light',
  camera: {
    center: [20, 20],
    zoom: 2.2,
    pitch: 0,
    bearing: 0,
  },
  activeGeoJson: emptyFeatureCollection,
  invertedMaskGeoJson: emptyFeatureCollection,
  activeBbox: null,
  targetFitBbox: null,
  isLoadingBoundary: false,
  hasLoadedMap: false,
  boundaryNotice: null,
  boundaryStrategy: null,
  boundaryError: null,

  selectRegion: (region: RegionCandidate) => {
    const initialZoom = region.admin_level_hint === 0 ? 4.5 : region.admin_level_hint === 1 ? 6.0 : 8.0;
    set({
      selectedRegion: region,
      activeRegion: region,
      adminLevel: region.admin_level_hint,
      boundaryError: null,
      boundaryNotice: null,
      hasLoadedMap: false,
      camera: {
        center: [region.lon, region.lat],
        zoom: initialZoom,
        pitch: 25,
        bearing: 0,
      },
    });
  },

  clearSelectedRegion: () => {
    set({
      selectedRegion: null,
      activeRegion: null,
      hasLoadedMap: false,
      activeGeoJson: emptyFeatureCollection,
      invertedMaskGeoJson: emptyFeatureCollection,
      activeBbox: null,
      boundaryNotice: null,
      boundaryStrategy: null,
      boundaryError: null,
    });
  },

  setAdminLevel: (lvl) => {
    set({ adminLevel: lvl });
  },

  fetchBoundaryAndApply: async () => {
    const region = get().selectedRegion || get().activeRegion;
    if (!region) return false;

    const lvl = get().adminLevel;
    set({ isLoadingBoundary: true, boundaryError: null });

    try {
      const boundaryReq: BoundaryRequest = {
        region_name: region.short_name || region.display_name,
        country_code: region.country_code_3 || region.country_code_2 || 'WLD',
        admin_level: lvl,
        clip: true,
        osm_id: region.osm_id,
        osm_type: region.osm_type,
        parent_chain: region.parent_chain || [],
      };

      const res = await fetchBoundaryGeoJson(boundaryReq);

      if (res.status === 'ok' && res.geojson && res.geojson.features?.length > 0) {
        const maskGeoJson = buildInvertedWorldMask(res.geojson);
        const bbox = res.bbox || computeFeatureBbox(res.geojson) || region.bbox || null;

        set({
          activeGeoJson: res.geojson,
          invertedMaskGeoJson: maskGeoJson,
          activeBbox: bbox,
          targetFitBbox: bbox,
          boundaryNotice: res.notice || null,
          boundaryStrategy: res.strategy || null,
          isLoadingBoundary: false,
          hasLoadedMap: true,
          boundaryError: null,
        });
        return true;
      }
    } catch (err: any) {
      console.warn('[boundary] Boundary fetch fallback:', err);
      const fallbackGeoJson = getRegionFeatureCollection(region.short_name);
      const fallbackMaskGeoJson = buildInvertedWorldMask(fallbackGeoJson);
      const fallbackBbox = computeFeatureBbox(fallbackGeoJson) || region.bbox || null;

      set({
        activeGeoJson: fallbackGeoJson,
        invertedMaskGeoJson: fallbackMaskGeoJson,
        activeBbox: fallbackBbox,
        targetFitBbox: fallbackBbox,
        boundaryNotice: err.message || 'Using local boundary estimate',
        boundaryStrategy: 'local_fallback',
        isLoadingBoundary: false,
        hasLoadedMap: true,
        boundaryError: null,
      });
      return true;
    }
    return false;
  },

  toggleInvertedMask: () => set((state) => ({ invertedMaskEnabled: !state.invertedMaskEnabled })),
  setInvertedMask: (enabled) => set({ invertedMaskEnabled: enabled }),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setCamera: (cam) => set((state) => ({ camera: { ...state.camera, ...cam } })),
  clearTargetFitBbox: () => set({ targetFitBbox: null }),

  resetCamera: () => {
    const reg = get().selectedRegion || get().activeRegion;
    if (reg) {
      set({
        camera: {
          center: [reg.lon, reg.lat],
          zoom: reg.admin_level_hint === 0 ? 4.5 : 5.8,
          pitch: 0,
          bearing: 0,
        },
      });
    } else {
      set({
        camera: {
          center: [20, 20],
          zoom: 2.2,
          pitch: 0,
          bearing: 0,
        },
      });
    }
  },
}));
