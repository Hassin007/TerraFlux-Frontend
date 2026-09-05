// ── TerraFlux Scientific Studio Live High-Res Preview Canvas ────────────────

import React from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { useViewStore } from '../../stores/useViewStore';
import { Loader2, AlertCircle, MapPin, Search } from 'lucide-react';

export const StudioPreviewCanvas: React.FC = () => {
  const { request, previewBase64, isLoadingPreview, previewError, closeStudio } = useStudioStore();
  const { setCmdkOpen, setActiveView } = useViewStore();

  const hasRegion = Boolean(request.region_name && request.region_name.trim());

  const imgSrc = previewBase64
    ? previewBase64.startsWith('data:')
      ? previewBase64
      : `data:image/png;base64,${previewBase64}`
    : null;

  const handleOpenSearch = () => {
    closeStudio();
    setActiveView('app');
    setTimeout(() => {
      setCmdkOpen(true);
    }, 150);
  };

  return (
    <div className="relative flex-1 h-full bg-[#FFFFFF] p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Canvas Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DA] text-xs font-mono-data">
        <div className="flex items-center gap-2 text-[#17211D]">
          <span className={`w-2 h-2 rounded-full ${hasRegion ? 'bg-[#176B63]' : 'bg-[#89938D]'}`} />
          <span className="font-bold">{hasRegion ? request.region_name : 'No Region Selected'}</span>
          {hasRegion && <span className="text-[#65716B]">[{request.preset} Layout]</span>}
        </div>

        <div className="text-[11px] text-[#65716B] font-semibold">
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 w-full min-h-[380px] my-2 rounded-xl overflow-hidden relative bg-[#F8F9F6] border border-[#DDE3DA] flex items-center justify-center p-3">
        {!hasRegion ? (
          <div className="text-center p-6 sm:p-8 space-y-3.5 max-w-md animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#176B63]/10 border border-[#176B63]/25 flex items-center justify-center text-[#176B63] mx-auto shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm text-[#17211D]">
                No Geographic Location Active
              </h3>
              <p className="text-xs text-[#65716B] leading-relaxed">
                Select an administrative region on the interactive map or search for a city to render scientific publication figures.
              </p>
            </div>
            <button
              onClick={handleOpenSearch}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#176B63] hover:bg-[#00524B] text-white font-bold text-xs font-mono-data shadow-xs transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Location (⌘K)</span>
            </button>
          </div>
        ) : isLoadingPreview ? (
          <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 animate-in fade-in duration-150">
            <Loader2 className="w-7 h-7 text-[#176B63] animate-spin" />
            <span className="text-xs font-mono-data font-bold text-[#17211D]">
              Rendering scientific visualization...
            </span>
          </div>
        ) : imgSrc ? (
          <img
            src={imgSrc}
            alt="Climate Visual Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
          />
        ) : previewError ? (
          <div className="text-center p-6 space-y-2 max-w-md">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
            <p className="text-xs font-mono-data text-[#17211D] font-semibold">{previewError}</p>
          </div>
        ) : (
          <div className="text-center p-6 text-xs font-mono-data text-[#65716B]">
            Initializing visualization...
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-mono-data text-[#65716B] pt-1">
        <span>{hasRegion ? `Coordinates: ${request.latitude?.toFixed(2)}°N, ${request.longitude?.toFixed(2)}°E` : 'Awaiting location selection'}</span>
        <span>Ready for 300 / 600 DPI Export</span>
      </div>
    </div>
  );
};
