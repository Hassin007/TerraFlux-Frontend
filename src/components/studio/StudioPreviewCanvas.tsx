// ── TerraFlux Scientific Studio Live High-Res Preview Canvas ────────────────

import React from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { Loader2, AlertCircle } from 'lucide-react';

export const StudioPreviewCanvas: React.FC = () => {
  const { request, previewBase64, isLoadingPreview, previewError } = useStudioStore();

  const imgSrc = previewBase64
    ? previewBase64.startsWith('data:')
      ? previewBase64
      : `data:image/png;base64,${previewBase64}`
    : null;

  return (
    <div className="relative flex-1 h-full bg-[#FFFFFF] p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Canvas Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DA] text-xs font-mono-data">
        <div className="flex items-center gap-2 text-[#17211D]">
          <span className="w-2 h-2 rounded-full bg-[#176B63]" />
          <span className="font-bold">{request.region_name}</span>
          <span className="text-[#65716B]">[{request.preset} Layout]</span>
        </div>

        <div className="text-[11px] text-[#65716B] font-semibold">
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 w-full min-h-[380px] my-2 rounded-xl overflow-hidden relative bg-[#F8F9F6] border border-[#DDE3DA] flex items-center justify-center p-3">
        {isLoadingPreview && (
          <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 animate-in fade-in duration-150">
            <Loader2 className="w-7 h-7 text-[#176B63] animate-spin" />
            <span className="text-xs font-mono-data font-bold text-[#17211D]">
            </span>
          </div>
        )}

        {imgSrc ? (
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
        <span></span>
        <span>Ready for 300 / 600 DPI Export</span>
      </div>
    </div>
  );
};
