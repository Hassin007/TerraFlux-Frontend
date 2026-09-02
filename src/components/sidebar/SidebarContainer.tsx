import React, { useState } from 'react';
import { LocationSearchInput } from './LocationSearchInput';
import { ClimateLayerControls } from './ClimateLayerControls';
import { QuickSummaryCard } from './QuickSummaryCard';
import { useMapStore } from '../../stores/useMapStore';
import { useClimateStore } from '../../stores/useClimateStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { useViewStore } from '../../stores/useViewStore';
import {
  ChevronLeft,
  ChevronRight,
  Map,
  BarChart3,
  SlidersHorizontal,
  Eye,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AdminLevel } from '../../types';

export const SidebarContainer: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useViewStore();
  const {
    selectedRegion,
    adminLevel,
    setAdminLevel,
    invertedMaskEnabled,
    toggleInvertedMask,
    isLoadingBoundary,
    fetchBoundaryAndApply,
  } = useMapStore();
  const { isLoadingClimate, executeSampling, startDate, endDate, selectedVariable, gridResult } = useClimateStore();
  const { openStudio, openSaveMapModal } = useStudioStore();

  const isMultiDecadal = React.useMemo(() => {
    if (!startDate || !endDate) return false;
    const d1 = new Date(startDate).getTime();
    const d2 = new Date(endDate).getTime();
    const diffYears = Math.abs(d2 - d1) / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears >= 15;
  }, [startDate, endDate]);

  const GEE_COMMON_VARS = React.useMemo(() => new Set([
    'temperature_2m_mean',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'wind_speed_10m_max',
    'relative_humidity_2m_mean',
    'snow_depth_max',
    'soil_moisture_0_to_7cm_mean',
  ]), []);

  const isUnsupportedMultiDecadal = isMultiDecadal && !GEE_COMMON_VARS.has(selectedVariable);

  const isGenerating = isLoadingBoundary || isLoadingClimate;
  const isRegionActive = Boolean(selectedRegion);

  const handleGenerateMap = async () => {
    if (!selectedRegion || isGenerating || isUnsupportedMultiDecadal) return;
    await Promise.all([
      fetchBoundaryAndApply(),
      executeSampling(selectedRegion),
    ]);
  };

  return (
    <div
      className={`relative z-30 h-full transition-all duration-300 flex select-none ${
        isSidebarCollapsed ? 'w-0' : 'w-80 sm:w-96'
      }`}
    >
      {/* Sidebar Main Frame */}
      <div
        className={`w-full h-full bg-white border-r border-[#DDE3DA] flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 ${
          isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Scrollable controls body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DA]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#176B63]" />
              <h2 className="font-display font-bold text-sm tracking-wide text-[#17211D]">
                MAP CONTROLS
              </h2>
            </div>
            <span className="text-[10px] font-mono-data text-[#89938D]">TERRAFLUX</span>
          </div>

          {/* 1. Location & Boundary Autocomplete */}
          <LocationSearchInput />

          {/* 2. Admin Level Filter Buttons */}
          <div className={`transition-opacity duration-200 ${!isRegionActive ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 font-bold">
              Boundary Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#F5F6F2] p-1 rounded-xl border border-[#DDE3DA] font-mono-data text-xs">
              {[
                { lvl: 0, label: 'Country' },
                { lvl: 1, label: 'State' },
                { lvl: 2, label: 'District' },
                { lvl: 3, label: 'Local' },
              ].map((item) => (
                <button
                  key={item.lvl}
                  disabled={!isRegionActive}
                  onClick={() => setAdminLevel(item.lvl as AdminLevel)}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    adminLevel === item.lvl
                      ? 'bg-white text-[#176B63] font-bold border border-[#176B63]/30 shadow-xs'
                      : 'text-[#65716B] hover:text-[#17211D]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Inverted Mask Clip Switch */}
          <div className={`flex items-center justify-between p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] transition-opacity duration-200 ${!isRegionActive ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#176B63]" />
              <div>
                <p className="text-xs font-semibold text-[#17211D]">Focus Background Dimmer</p>
                <p className="text-[10px] text-[#65716B]">Softens outer area to highlight selection</p>
              </div>
            </div>
            <button
              disabled={!isRegionActive}
              onClick={toggleInvertedMask}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                invertedMaskEnabled ? 'bg-[#176B63]' : 'bg-[#DDE3DA]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  invertedMaskEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Climate Variable & Layer Controls */}
          <ClimateLayerControls />

          {/* 5. Primary Generate Climate Map Action Button */}
          <div className="pt-1">
            <button
              onClick={handleGenerateMap}
              disabled={!isRegionActive || isGenerating || isUnsupportedMultiDecadal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#176B63] hover:bg-[#135952] disabled:bg-[#DDE3DA] text-white disabled:text-[#89938D] font-bold text-xs transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed tracking-wide"
              id="sidebar-generate-map-btn"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Sampling & Resolving Map...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Climate Map</span>
                </>
              )}
            </button>
          </div>

          {/* 6. Quick Metric Summary Card */}
          {selectedRegion && gridResult?.points?.length > 0 && <QuickSummaryCard />}
        </div>

        {/* Dedicated Map & Chart Action Buttons (Styled with TerraFlux Theme) */}
        <div className="p-3.5 bg-[#F5F6F2] border-t border-[#DDE3DA] space-y-2">
          <button
            onClick={() => openSaveMapModal()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#176B63] hover:bg-[#00524B] text-white font-bold text-xs transition-all shadow-xs hover:shadow cursor-pointer group"
            id="btn-sidebar-save-map"
          >
            <Map className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
            <span>Save Map Figure</span>
          </button>

          <button
            onClick={() => openStudio()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#EBF6EF] text-[#176B63] border border-[#176B63]/35 hover:border-[#176B63] font-bold text-xs transition-all shadow-xs hover:shadow cursor-pointer group"
            id="btn-sidebar-save-chart"
          >
            <BarChart3 className="w-4 h-4 text-[#176B63] transition-transform group-hover:scale-110" />
            <span>Save Chart & Visuals</span>
          </button>
        </div>
      </div>

      {/* Collapse Toggle Handle */}
      <button
        onClick={toggleSidebarCollapsed}
        className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-12 rounded-r-xl bg-white border border-l-0 border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#F5F6F2] transition-all z-40"
        title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
};
