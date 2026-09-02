// ── TerraFlux Publication-Ready Figures Section (Export & Present) ────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { Image, FileCode2, FileText, ArrowRight } from 'lucide-react';
import { FigureTypeKey } from '../../types';

export const HomePublicationFigures: React.FC = () => {
  const { setActiveView } = useViewStore();
  const { openStudio, setFigureType } = useStudioStore();

  const handleOpenStudio = (preset?: FigureTypeKey) => {
    setActiveView('app');
    if (preset) {
      setFigureType(preset);
    }
    openStudio();
  };

  return (
    <section
      id="publication-figures"
      className="py-24 sm:py-32 px-4 md:px-10 max-w-[1440px] mx-auto bg-[#F5F6F2] border-t border-[#DDE3DA]"
    >
      {/* Section Header */}
      <div className="mb-16 sm:mb-20">
        <span className="text-xs font-mono-data text-[#00524B] uppercase tracking-[0.2em] mb-4 block font-bold">
          Export & Present
        </span>
        <h2 className="font-headline text-3xl sm:text-5xl md:text-[56px] text-[#141E1A] mb-4 sm:mb-6 leading-tight">
          Publication-ready figures.
        </h2>
        <p className="text-base sm:text-lg text-[#65716B] max-w-2xl leading-relaxed">
          Generate clean, high-resolution climate maps and analytical visualizations designed to go directly into reports, papers, presentations, and technical documents.
        </p>
      </div>

      {/* Editorial Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
        {/* Large Primary Figure (Span 8 cols) */}
        <div
          onClick={() => handleOpenStudio('precipitation_distribution')}
          className="lg:col-span-8 group cursor-pointer"
        >
          <div className="bg-white border border-[#DDE3DA] rounded-xl p-6 sm:p-8 shadow-xs transition-all duration-500 hover:shadow-md hover:-translate-y-1 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline text-lg sm:text-xl text-[#141E1A]">
                Precipitation Climatology (1991-2020)
              </h4>
              <span className="text-xs font-mono-data text-[#65716B] uppercase tracking-widest bg-[#F5F6F2] px-2.5 py-1 rounded border border-[#DDE3DA]">
                Global Raster
              </span>
            </div>

            <div className="aspect-[16/9] bg-[#EBF6EF]/30 rounded-lg border border-[#DDE3DA]/50 flex items-center justify-center relative overflow-hidden">
              {/* Simulated Scientific Map */}
              <svg className="w-full h-full opacity-85" viewBox="0 0 800 450">
                <path
                  d="M100,150 Q200,100 300,200 T500,150 T700,250"
                  fill="none"
                  stroke="#176B63"
                  strokeOpacity="0.12"
                  strokeWidth="40"
                />
                <path
                  d="M150,200 Q250,150 350,250 T550,200 T750,300"
                  fill="none"
                  stroke="#176B63"
                  strokeOpacity="0.08"
                  strokeWidth="60"
                />
                <rect fill="url(#blue-gradient)" height="10" width="200" x="50" y="400" rx="2" />
                <defs>
                  <linearGradient id="blue-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#ebf6ef', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#176b63', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded border border-[#DDE3DA] text-[10px] font-mono-data text-[#65716B] shadow-xs">
                mm/month
              </div>
            </div>

            <p className="mt-6 text-xs sm:text-sm text-[#65716B] italic leading-relaxed">
              Figure 1. Mean monthly precipitation totals derived from high-resolution satellite telemetry and ground-station synthesis.
            </p>
          </div>
        </div>

        {/* Secondary Figures Stack (Span 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
          {/* Anomaly Figure */}
          <div
            onClick={() => handleOpenStudio('copernicus_anomaly')}
            className="bg-white border border-[#DDE3DA] rounded-xl p-6 shadow-xs transition-all duration-500 hover:shadow-md hover:-translate-y-1 group cursor-pointer flex-1"
          >
            <h4 className="font-headline text-lg text-[#141E1A] mb-4">Temperature Anomaly</h4>
            <div className="h-36 bg-[#EBF6EF]/30 rounded-lg border border-[#DDE3DA]/50 flex items-center justify-center p-2">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <rect fill="#DDE3DA" height="1" width="260" x="20" y="75" />
                <rect fill="#B94A48" fillOpacity="0.6" height="35" width="20" x="50" y="40" rx="1" />
                <rect fill="#176B63" fillOpacity="0.4" height="25" width="20" x="80" y="75" rx="1" />
                <rect fill="#B94A48" fillOpacity="0.8" height="45" width="20" x="110" y="30" rx="1" />
                <rect fill="#176B63" fillOpacity="0.4" height="15" width="20" x="140" y="75" rx="1" />
                <rect fill="#B94A48" fillOpacity="0.7" height="40" width="20" x="170" y="35" rx="1" />
                <rect fill="#B94A48" fillOpacity="0.9" height="55" width="20" x="200" y="20" rx="1" />
              </svg>
            </div>
            <p className="mt-4 text-xs text-[#65716B]">Regional variance from 1950-1980 baseline.</p>
          </div>

          {/* Seasonal Figure */}
          <div
            onClick={() => handleOpenStudio('seasonal_cycle_bands')}
            className="bg-white border border-[#DDE3DA] rounded-xl p-6 shadow-xs transition-all duration-500 hover:shadow-md hover:-translate-y-1 group cursor-pointer flex-1"
          >
            <h4 className="font-headline text-lg text-[#141E1A] mb-4">Seasonal Cycle</h4>
            <div className="h-36 bg-[#EBF6EF]/30 rounded-lg border border-[#DDE3DA]/50 flex items-center justify-center p-2">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <path
                  d="M30,120 C80,120 120,30 150,30 C180,30 220,120 270,120"
                  fill="none"
                  stroke="#176B63"
                  strokeWidth="2.5"
                />
                <text fill="#65716B" fontFamily="Inter" fontSize="10" x="30" y="140">
                  JAN
                </text>
                <text fill="#65716B" fontFamily="Inter" fontSize="10" x="250" y="140">
                  DEC
                </text>
              </svg>
            </div>
            <p className="mt-4 text-xs text-[#65716B]">12-month aggregate vegetation index (NDVI).</p>
          </div>
        </div>
      </div>

      {/* Export Capability Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-[#DDE3DA]">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h5 className="font-mono-data text-xs text-[#141E1A] uppercase tracking-wider font-bold">
            Export formats
          </h5>
          <p className="text-xs sm:text-sm text-[#65716B]">
            High-resolution raster and vector exports for presentations, reports, and research workflows.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => handleOpenStudio()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDE3DA] rounded-lg shadow-xs hover:border-[#176B63] hover:text-[#176B63] transition-colors cursor-pointer text-xs font-mono-data"
          >
            <Image className="w-4 h-4 text-[#00524B]" />
            <span>PNG (300/600 DPI)</span>
          </button>
          <button
            onClick={() => handleOpenStudio()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDE3DA] rounded-lg shadow-xs hover:border-[#176B63] hover:text-[#176B63] transition-colors cursor-pointer text-xs font-mono-data"
          >
            <FileCode2 className="w-4 h-4 text-[#00524B]" />
            <span>SVG (Vector)</span>
          </button>
          <button
            onClick={() => handleOpenStudio()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDE3DA] rounded-lg shadow-xs hover:border-[#176B63] hover:text-[#176B63] transition-colors cursor-pointer text-xs font-mono-data"
          >
            <FileText className="w-4 h-4 text-[#00524B]" />
            <span>PDF Ready</span>
          </button>

          <button
            onClick={() => handleOpenStudio()}
            className="ml-2 font-mono-data text-xs uppercase tracking-wider text-[#00524B] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <span>Explore visualizations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
