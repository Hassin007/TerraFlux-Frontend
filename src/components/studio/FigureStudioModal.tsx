// ── TerraFlux Scientific Figure Studio Master Modal ────────────────────────

import React from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { useMapStore } from '../../stores/useMapStore';
import { StudioSidebar } from './StudioSidebar';
import { StudioPreviewCanvas } from './StudioPreviewCanvas';
import { ExportActionToolbar } from './ExportActionToolbar';
import { BarChart3, X } from 'lucide-react';

export const FigureStudioModal: React.FC = () => {
  const { isStudioOpen, closeStudio, request } = useStudioStore();
  const { selectedRegion, activeRegion } = useMapStore();
  const region = selectedRegion || activeRegion;

  if (!isStudioOpen) return null;

  const regionLabel = region
    ? (region.short_name || region.display_name || '').split(',')[0].trim()
    : (request.region_name || 'Pakistan');
  const lat = region ? region.lat : (request.latitude ?? 30.38);
  const lon = region ? region.lon : (request.longitude ?? 69.35);


  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-[#17211D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-6xl h-[90vh] bg-white border border-[#DDE3DA] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        id="figure-studio-modal"
      >
        {/* Modal Top Header Bar */}
        <div className="h-14 px-5 bg-[#F5F6F2] border-b border-[#DDE3DA] flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#176B63]/10 border border-[#176B63]/25 flex items-center justify-center text-[#176B63]">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-wide text-[#17211D] flex items-center gap-2">
                FIGURE & CHART STUDIO
                <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-white text-[#176B63] border border-[#DDE3DA]">
                  HIGH-RES VECTOR READY
                </span>
              </h2>
              <p className="text-[10px] font-mono-data text-[#65716B]">
                {regionLabel} ({typeof lat === 'number' ? lat.toFixed(2) : lat}°N, {typeof lon === 'number' ? lon.toFixed(2) : lon}°E)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeStudio}
              className="p-1.5 rounded-lg text-[#65716B] hover:text-[#17211D] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer"
              title="Close Studio (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Parameters + Preview Canvas */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <StudioSidebar />
          <StudioPreviewCanvas />
        </div>

        {/* Modal Bottom: Resolution & Export Toolbar */}
        <ExportActionToolbar />
      </div>
    </div>
  );
};


