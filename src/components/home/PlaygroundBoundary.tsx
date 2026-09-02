// ── TerraFlux Micro-Playground 1: Boundary & Focus Masking ──────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { Layers, Eye, MapPin } from 'lucide-react';

export const PlaygroundBoundary: React.FC = () => {
  const {
    homePlayground,
    setBoundaryDemoAdminLevel,
    toggleBoundaryDemoMask,
    setBoundaryDemoRegion,
  } = useViewStore();

  const { adminLevel, invertedMask, selectedRegion } = homePlayground.boundaryDemo;

  const sampleRegions = [
    { name: 'Punjab, Pakistan', short: 'Punjab', code: 'PK', adm: 1 },
    { name: 'Sindh, Pakistan', short: 'Sindh', code: 'PK', adm: 1 },
    { name: 'Indus River Basin', short: 'Indus Basin', code: 'PK/IN', adm: 0 },
    { name: 'European Alps Range', short: 'Alps Range', code: 'EU', adm: 0 },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Explanation & Controls */}
        <div className="w-full lg:w-1/2 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#176B63]/10 border border-[#176B63]/30 text-xs font-mono-data text-[#176B63]">
            <Layers className="w-3.5 h-3.5" />
            <span>PLAYGROUND 01</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#17211D]">
              Boundary Explorer & Highlighted Region Mask
            </h3>
            <p className="text-xs sm:text-sm text-[#65716B] mt-2 leading-relaxed">
              TerraFlux instantly identifies countries, states/provinces, districts, and natural river basins. Turning on the Focus Mask gently softens the surrounding globe so you can focus cleanly on your selected area.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="space-y-4 pt-2">
            {/* Region Selector Pills */}
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                1. Select Target Area:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sampleRegions.map((reg) => {
                  const isSelected = selectedRegion === reg.name;
                  return (
                    <button
                      key={reg.short}
                      onClick={() => setBoundaryDemoRegion(reg.name)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#176B63]/10 border-[#176B63] text-[#176B63] font-semibold'
                          : 'bg-[#F5F6F2] border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{reg.short}</span>
                      <span className="text-[10px] font-mono-data text-[#557A5A]">{reg.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Level Selector */}
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                2. Boundary Level:
              </label>
              <div className="flex gap-2 bg-[#F5F6F2] p-1 rounded-lg border border-[#DDE3DA]">
                {[
                  { lvl: 0, label: 'Country / Basin' },
                  { lvl: 1, label: 'Province / State' },
                  { lvl: 2, label: 'District' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setBoundaryDemoAdminLevel(item.lvl as any)}
                    className={`flex-1 py-1.5 text-xs font-mono-data rounded-md transition-all cursor-pointer ${
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

            {/* Inverted Mask Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA]">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-[#176B63]" />
                <div>
                  <p className="text-xs font-medium text-[#17211D]">Focus Background Dimmer</p>
                  <p className="text-[10px] text-[#65716B]">Dims the outer map to highlight target boundary</p>
                </div>
              </div>
              <button
                onClick={toggleBoundaryDemoMask}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  invertedMask ? 'bg-[#176B63]' : 'bg-[#DDE3DA]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    invertedMask ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Tactile Canvas Preview */}
        <div className="w-full lg:w-1/2 h-[340px] sm:h-[380px] bg-[#F5F6F2] rounded-xl border border-[#DDE3DA] relative overflow-hidden flex items-center justify-center select-none">
          {/* Base topographic background grid */}
          <div className="absolute inset-0 bg-topo-grid opacity-60" />

          {/* Surrounding world dimming layer if invertedMask is active */}
          {invertedMask && (
            <div className="absolute inset-0 bg-[#17211D]/15 backdrop-blur-[1px] transition-all duration-500" />
          )}

          {/* Centered target boundary polygon representation */}
          <div className="relative z-10 flex flex-col items-center">
            {/* SVG Polygon with Alpine Teal border & soft shadow */}
            <svg
              className={`w-64 h-64 sm:w-72 sm:h-72 transition-all duration-500 ${
                invertedMask ? 'drop-shadow-[0_8px_24px_rgba(23,107,99,0.25)]' : ''
              }`}
              viewBox="0 0 200 200"
            >
              <polygon
                points={
                  adminLevel === 0
                    ? '100,20 150,45 175,90 160,150 120,180 60,170 30,120 40,60'
                    : adminLevel === 1
                    ? '100,35 140,55 160,95 145,145 110,165 65,155 45,115 55,65'
                    : '100,50 130,65 145,95 135,130 110,145 75,140 60,110 70,75'
                }
                fill={invertedMask ? 'rgba(255, 255, 255, 0.95)' : 'rgba(23, 107, 99, 0.08)'}
                stroke="#176B63"
                strokeWidth={adminLevel === 2 ? '1.8' : '2.5'}
                strokeLinejoin="round"
                className="transition-all duration-500"
              />

              {/* Sample internal climate grid points */}
              <circle cx="95" cy="85" r="3.5" fill="#B9822B" />
              <circle cx="120" cy="105" r="3.5" fill="#557A5A" />
              <circle cx="80" cy="120" r="3.5" fill="#176B63" />
              <circle cx="110" cy="135" r="3.5" fill="#4D8FA8" />
              <circle cx="135" cy="80" r="3.5" fill="#B94A48" />
            </svg>

            {/* Floating Tag over preview */}
            <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-lg bg-white/90 border border-[#DDE3DA] backdrop-blur-md flex items-center justify-between text-xs font-mono-data shadow-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#176B63]" />
                <span className="text-[#17211D] font-semibold">{selectedRegion}</span>
              </div>
              <span className="text-[11px] text-[#557A5A] font-medium">
                {invertedMask ? 'FOCUS: ACTIVE' : 'FOCUS: OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
