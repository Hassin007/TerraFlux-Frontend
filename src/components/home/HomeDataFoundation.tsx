// ── TerraFlux Data Foundation Section (ERA5 & Boundary Hierarchy) ──────────

import React from 'react';
import { ChevronDown } from 'lucide-react';

export const HomeDataFoundation: React.FC = () => {
  const variables = [
    'Temperature (2m)',
    'Precipitation',
    'Wind Vectors',
    'Relative Humidity',
    'Surface Pressure',
    'Soil Moisture',
    'Solar Irradiance',
    'NDVI Index',
  ];

  const hierarchyLevels = [
    'Global Analysis Grid (0.25°)',
    'Country (ADM 0)',
    'Province / State / Region (ADM 1)',
    'District / Local Area (ADM 2–3)',
  ];

  return (
    <section
      id="datasets-coverage"
      className="py-24 sm:py-32 px-4 md:px-10 max-w-[1440px] mx-auto bg-[#F5F6F2] relative overflow-hidden border-t border-[#DDE3DA]"
    >
      {/* Background Grid & Map Silhouette */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,250 L1000,250 M500,0 L500,500" fill="none" stroke="#176B63" strokeWidth="1" />
          <circle cx="500" cy="250" fill="none" r="100" stroke="#176B63" strokeWidth="0.5" />
          <circle cx="500" cy="250" fill="none" r="200" stroke="#176B63" strokeWidth="0.5" />
          <path
            d="M100,100 Q250,50 400,150 T700,100 T900,200"
            fill="none"
            opacity="0.5"
            stroke="#176B63"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-16 sm:mb-20">
          <span className="text-xs font-mono-data text-[#00524B] uppercase tracking-[0.2em] mb-4 block font-bold">
            Data Foundation
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl md:text-[56px] text-[#141E1A] mb-4 sm:mb-6 leading-tight">
            Built on climate data.
          </h2>
          <p className="text-base sm:text-lg text-[#65716B] max-w-2xl leading-relaxed">
            Analyze historical climate conditions across regions and time using structured, multidimensional climate datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Primary Dataset Information */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded bg-[#00524B] text-white font-mono-data text-[11px] uppercase tracking-widest mb-4">
                ERA5 GLOBAL REANALYSIS
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl text-[#141E1A] mb-2">
                Climate Reanalysis
              </h3>
              <p className="text-sm sm:text-base text-[#65716B] max-w-xl leading-relaxed">
                Global atmospheric and land-surface climate reanalysis data suitable for historical climate analysis.
              </p>
            </div>

            {/* Variable Pills */}
            <div className="flex flex-wrap gap-2">
              {variables.map((variable, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg border border-[#DDE3DA] text-xs font-medium text-[#65716B] bg-white shadow-2xs hover:border-[#176B63] transition-colors"
                >
                  {variable}
                </span>
              ))}
            </div>

            {/* 3 Metric Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-[#DDE3DA]">
              <div>
                <div className="font-headline text-2xl text-[#141E1A] font-bold">GLOBAL</div>
                <div className="text-xs font-mono-data text-[#65716B] uppercase tracking-wider mt-1">
                  Geographic coverage
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl text-[#141E1A] font-bold">1950 → Present</div>
                <div className="text-xs font-mono-data text-[#65716B] uppercase tracking-wider mt-1">
                  Temporal coverage
                </div>
              </div>
              <div>
                <div className="font-headline text-2xl text-[#141E1A] font-bold uppercase">
                  Spatial + Temporal
                </div>
                <div className="text-xs font-mono-data text-[#65716B] uppercase tracking-wider mt-1">
                  Multidimensional
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Hierarchy Tree Card */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-sm border border-[#DDE3DA] p-6 sm:p-8 rounded-xl shadow-xs">
            <div className="flex flex-col items-center gap-3">
              {hierarchyLevels.map((level, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-4 py-2.5 border border-[#DDE3DA] rounded-lg font-mono-data text-xs text-[#141E1A] bg-white shadow-2xs w-full text-center hover:border-[#176B63] transition-colors">
                    {level}
                  </div>
                  {idx < hierarchyLevels.length - 1 && (
                    <div className="flex flex-col items-center my-[-4px]">
                      <div className="h-4 w-px bg-[#DDE3DA]" />
                      <ChevronDown className="w-4 h-4 text-[#89938D]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="mt-8 text-xs text-[#65716B] text-center italic leading-relaxed">
              Administrative boundaries are provided separately from climate datasets and can be layered onto climate fields for spatial analysis.
            </p>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#DDE3DA] flex justify-center text-center">
          <p className="text-xs font-mono-data text-[#65716B] uppercase tracking-widest">
            Data processing is performed server-side using reproducible analytical workflows.
          </p>
        </div>
      </div>
    </section>
  );
};
