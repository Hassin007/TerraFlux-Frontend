// ── TerraFlux Dedicated Publication Save Map Studio Modal ──────────────────

import React, { useState, useMemo } from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { useClimateStore, computeRainfallBounds } from '../../stores/useClimateStore';
import { useViewStore } from '../../stores/useViewStore';
import { exportFigure } from '../../api/figureApi';
import { PRESET_OPTIONS } from './PresetSelectorGrid';
import { RainfallScaleMode } from '../../types';
import {
  Map,
  X,
  RotateCw,
  Download,
  FileCode,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Sliders,
  Check,
  MapPin,
  Search,
} from 'lucide-react';

export const THEME_OPTIONS = [
  { id: 'publication_light', label: 'Publication Light (Journal)' },
  { id: 'presentation_light', label: 'Presentation Light (Vibrant)' },
  { id: 'dark_modern', label: 'Dark Modern (Neon Glow)' },
];

export const SaveMapModal: React.FC = () => {
  const {
    isSaveMapOpen,
    closeSaveMapModal,
    saveMapRequest,
    saveMapPreviewBase64,
    isLoadingSaveMapPreview,
    saveMapPreviewError,
    setSaveMapPreset,
    setSaveMapTheme,
    setSaveMapRainfallScale,
    fetchSaveMapPreview,
  } = useStudioStore();

  const { gridResult, startDate, endDate } = useClimateStore();
  const [dpi, setDpi] = useState<number>(300);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccessName, setDownloadSuccessName] = useState<string | null>(null);

  const [customMin, setCustomMin] = useState<number>(saveMapRequest.vis_min ?? 0);
  const [customMax, setCustomMax] = useState<number>(saveMapRequest.vis_max ?? 800);

  const isPrecipitation = saveMapRequest.variable === 'precipitation_sum';
  const rainfallMode: RainfallScaleMode = saveMapRequest.rainfall_scale_mode || 'standard';

  const computedRainfallBounds = useMemo(() => {
    return computeRainfallBounds(
      rainfallMode,
      customMin,
      customMax,
      saveMapRequest.start_date || startDate,
      saveMapRequest.end_date || endDate,
      saveMapRequest.climate_grid || gridResult.points
    );
  }, [rainfallMode, customMin, customMax, saveMapRequest, startDate, endDate, gridResult.points]);

  if (!isSaveMapOpen) return null;

  const hasRegion = Boolean(saveMapRequest.region_name && saveMapRequest.region_name.trim());

  const imgSrc = saveMapPreviewBase64
    ? saveMapPreviewBase64.startsWith('data:')
      ? saveMapPreviewBase64
      : `data:image/png;base64,${saveMapPreviewBase64}`
    : null;

  const handleDownload = async (fmt: 'png' | 'svg' | 'pdf') => {
    if (!hasRegion) return;
    setIsExporting(true);
    try {
      const filename = await exportFigure({
        ...saveMapRequest,
        format: fmt,
        dpi: dpi,
      });
      setDownloadSuccessName(filename);
      setTimeout(() => setDownloadSuccessName(null), 4000);
    } catch (err: any) {
      console.error('[saveMap] Export error:', err);
      alert('Map export failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6 bg-[#17211D]/45 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-6xl h-[90vh] bg-white border border-[#DDE3DA] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        id="save-map-modal"
      >
        {/* Top Header */}
        <div className="h-14 px-5 bg-[#F5F6F2] border-b border-[#DDE3DA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#176B63]/10 border border-[#176B63]/25 flex items-center justify-center text-[#176B63]">
              <Map className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-wide text-[#17211D] flex items-center gap-2">
                SAVE MAP STUDIO
                <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white text-[#176B63] font-bold border border-[#DDE3DA]">
                  {hasRegion ? saveMapRequest.region_name : 'NO LOCATION'}
                </span>
              </h2>
              <p className="text-[10px] font-mono-data text-[#65716B]">
                {hasRegion ? 'High-Resolution Spatial Figure' : 'Awaiting location selection on interactive map'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSaveMapModal}
            className="p-1.5 rounded-lg text-[#65716B] hover:text-[#17211D] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-80 h-full bg-[#F5F6F2] border-r border-[#DDE3DA] p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Context Info Badge */}
              <div className="p-3 bg-white rounded-xl border border-[#DDE3DA] space-y-1 font-mono-data text-[11px]">
                <div>
                  <span className="font-bold text-[#17211D]">Active Layer: </span>
                  <span className="text-[#176B63] font-semibold">
                    {gridResult.variable_name || saveMapRequest.variable}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#17211D]">Period: </span>
                  <span className="text-[#65716B]">
                    {saveMapRequest.start_year}–{saveMapRequest.end_year}
                  </span>
                </div>
              </div>

              {/* Preset Dimensions */}
              <div>
                <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 font-bold">
                  Preset Dimensions & Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_OPTIONS.map((p) => {
                    const isSelected = saveMapRequest.preset === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSaveMapPreset(p.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono-data border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#176B63] border-[#176B63] text-white font-bold shadow-xs'
                            : 'bg-white border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] hover:border-[#176B63]/50'
                        }`}
                      >
                        <div className="font-semibold text-xs leading-tight whitespace-normal break-words">
                          {p.name}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 font-mono-data ${
                            isSelected ? 'text-white/80' : 'text-[#89938D]'
                          }`}
                        >
                          {p.ratio}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme / Palette */}
              <div>
                <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 font-bold">
                  Theme / Palette
                </label>
                <select
                  value={saveMapRequest.theme}
                  onChange={(e) => setSaveMapTheme(e.target.value)}
                  className="w-full bg-white text-xs font-semibold text-[#17211D] p-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
                >
                  {THEME_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dedicated Rainfall Hybrid Scale Control in Save Map Studio */}
              {isPrecipitation && (
                <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono-data text-[#17211D] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#176B63]" />
                      <span>Rainfall Scale</span>
                    </label>
                    <span className="text-[10px] font-mono-data text-[#176B63] font-semibold bg-[#176B63]/10 px-2 py-0.5 rounded border border-[#176B63]/20">
                      {rainfallMode === 'auto' ? 'Automatic' : rainfallMode === 'standard' ? 'Standard' : 'Custom'}
                    </span>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA]">
                    <button
                      type="button"
                      onClick={() => setSaveMapRainfallScale('auto')}
                      className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        rainfallMode === 'auto'
                          ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                          : 'text-[#65716B] hover:text-[#17211D]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Auto</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSaveMapRainfallScale('standard')}
                      className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        rainfallMode === 'standard'
                          ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                          : 'text-[#65716B] hover:text-[#17211D]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>Standard</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSaveMapRainfallScale('custom', customMin, customMax)}
                      className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        rainfallMode === 'custom'
                          ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                          : 'text-[#65716B] hover:text-[#17211D]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>Custom</span>
                      </div>
                    </button>
                  </div>

                  {/* Mode Details */}
                  {rainfallMode === 'auto' && (
                    <div className="p-2 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA] text-[10px] font-mono-data space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#65716B]">Figure Range:</span>
                        <span className="font-bold text-[#176B63]">{computedRainfallBounds.label}</span>
                      </div>
                    </div>
                  )}

                  {rainfallMode === 'standard' && (
                    <div className="p-2 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA] text-[10px] font-mono-data space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#65716B]">Figure Range:</span>
                        <span className="font-bold text-[#176B63]">{computedRainfallBounds.label}</span>
                      </div>
                    </div>
                  )}

                  {rainfallMode === 'custom' && (
                    <div className="space-y-2 p-2 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA]">
                      <div className="grid grid-cols-2 gap-2 font-mono-data text-[10px]">
                        <div>
                          <label className="text-[#65716B] block mb-1">Min (mm)</label>
                          <input
                            type="number"
                            min="0"
                            max="10000"
                            step="10"
                            value={customMin}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setCustomMin(val);
                              setSaveMapRainfallScale('custom', val, customMax);
                            }}
                            className="w-full bg-white border border-[#DDE3DA] rounded-md px-2 py-1 text-xs text-[#17211D] focus:border-[#176B63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[#65716B] block mb-1">Max (mm)</label>
                          <input
                            type="number"
                            min="10"
                            max="10000"
                            step="50"
                            value={customMax}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 100;
                              setCustomMax(val);
                              setSaveMapRainfallScale('custom', customMin, val);
                            }}
                            className="w-full bg-white border border-[#DDE3DA] rounded-md px-2 py-1 text-xs text-[#17211D] focus:border-[#176B63] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Refresh Map Button */}
            <button
              onClick={() => fetchSaveMapPreview()}
              disabled={isLoadingSaveMapPreview || !hasRegion}
              className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#DDE3DA]/50 text-[#17211D] font-bold border border-[#DDE3DA] shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 text-[#176B63] ${
                  isLoadingSaveMapPreview ? 'animate-spin' : ''
                }`}
              />
              <span>Refresh Map</span>
            </button>
          </div>

          {/* Preview Canvas */}
          <div className="relative flex-1 h-full bg-white p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DA] text-xs font-mono-data">
              <div className="flex items-center gap-2 text-[#17211D]">
                <span className={`w-2 h-2 rounded-full ${hasRegion ? 'bg-[#176B63]' : 'bg-[#89938D]'}`} />
                <span className="font-bold">{hasRegion ? saveMapRequest.region_name : 'No Region Selected'}</span>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[380px] my-2 rounded-xl overflow-hidden relative bg-[#F8F9F6] border border-[#DDE3DA] flex items-center justify-center p-3">
              {!hasRegion ? (
                <div className="text-center p-6 sm:p-8 space-y-3.5 max-w-md animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-[#176B63]/10 border border-[#176B63]/25 flex items-center justify-center text-[#176B63] mx-auto shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#17211D]">
                      No Map Location Active
                    </h3>
                    <p className="text-xs text-[#65716B] leading-relaxed">
                      Select or search a region on the interactive map to configure and export high-resolution cartographic map figures.
                    </p>
                  </div>
                </div>
              ) : isLoadingSaveMapPreview ? (
                <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 animate-in fade-in duration-150">
                  <Loader2 className="w-7 h-7 text-[#176B63] animate-spin" />
                  <span className="text-xs font-mono-data font-bold text-[#17211D]">
                    Rendering publication map...
                  </span>
                </div>
              ) : imgSrc ? (
                <img
                  src={imgSrc}
                  alt="Spatial Map Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                />
              ) : saveMapPreviewError ? (
                <div className="text-center p-6 space-y-2 max-w-md">
                  <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                  <p className="text-xs font-mono-data text-[#17211D] font-semibold">
                    {saveMapPreviewError}
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 text-xs font-mono-data text-[#65716B]">
                  Loading map preview...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-data text-[#65716B] pt-1">
              <span>Resolution: {dpi} DPI</span>
              <span>Ready for PNG, SVG & PDF Export</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3.5 sm:p-4 bg-[#F5F6F2] border-t border-[#DDE3DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-data shrink-0">
          {/* Action Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-bold text-[#65716B] uppercase tracking-wider hidden sm:inline">
              Save Map:
            </span>

            <button
              onClick={() => handleDownload('png')}
              disabled={isExporting || !hasRegion}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#176B63] hover:bg-[#135952] text-white font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Download className="w-3.5 h-3.5 text-white" />
              )}
              <span>Download PNG</span>
            </button>

            <button
              onClick={() => handleDownload('svg')}
              disabled={isExporting || !hasRegion}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#DDE3DA]/40 text-[#17211D] font-bold border border-[#DDE3DA] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <FileCode className="w-3.5 h-3.5 text-[#176B63]" />
              <span>Download SVG (Vector)</span>
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              disabled={isExporting || !hasRegion}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#00524B] hover:bg-[#003d38] text-white font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Resolution Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-[11px] text-[#65716B] font-bold">Resolution:</label>
            <select
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value))}
              className="bg-white text-xs font-mono-data font-bold text-[#17211D] px-2.5 py-1.5 rounded-lg border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
            >
              <option value={150}>150 DPI (Presentation)</option>
              <option value={300}>300 DPI (Publication)</option>
              <option value={600}>600 DPI (High-Res Print)</option>
            </select>
          </div>
        </div>

        {/* Download Alert Toast */}
        {downloadSuccessName && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B63] text-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span className="truncate max-w-xs text-xs font-semibold">
              Downloaded: {downloadSuccessName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
