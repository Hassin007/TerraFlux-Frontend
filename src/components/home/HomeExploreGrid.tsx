// ── TerraFlux Explore Climate Data 2x2 Matrix ──────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { useStudioStore } from '../../stores/useStudioStore';
import {
  MapPin,
  TrendingUp,
  BarChart3,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { FigureTypeKey } from '../../types';

export const HomeExploreGrid: React.FC = () => {
  const { setActiveView } = useViewStore();
  const { openStudio, setFigureType } = useStudioStore();

  const handleCardClick = (preset?: FigureTypeKey) => {
    setActiveView('app');
    if (preset) {
      setFigureType(preset);
      openStudio();
    }
  };

  return (
    <section className="bg-[#F5F6F2] py-24 sm:py-32 px-4 md:px-10 border-t border-[#DDE3DA]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-mono-data text-[#65716B] uppercase tracking-widest block">
            Explore Climate Data
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#141E1A] leading-tight">
            See how climate changes across space and time.
          </h2>
          <p className="text-sm sm:text-base text-[#65716B] leading-relaxed">
            Explore spatial patterns, temporal trends, anomalies, and seasonal behavior across regions and time periods.
          </p>
        </div>

        {/* Right Column: 2x2 Grid of Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Spatial Maps */}
          <div
            onClick={() => handleCardClick()}
            className="bg-white border border-[#DDE3DA] p-6 sm:p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#176B63] hover:shadow-md group cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="mb-4">
                <MapPin className="w-6 h-6 text-[#00524B] mb-3 stroke-[1.5px]" />
                <h4 className="font-headline text-xl text-[#141E1A] mb-2">Spatial Maps</h4>
                <p className="text-xs sm:text-sm text-[#65716B] leading-relaxed">
                  Explore how temperature, precipitation, and other climate variables vary across geographic regions.
                </p>
              </div>

              <div className="mt-4">
                <div className="h-24 w-full bg-[#EBF6EF]/40 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-[#DDE3DA]/50">
                  <svg
                    fill="none"
                    height="60"
                    viewBox="0 0 120 60"
                    width="120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 10C25 15 35 12 45 18C55 24 65 10 75 15C85 20 95 15 100 25V45C95 35 85 40 75 35C65 30 55 44 45 38C35 32 25 35 20 30V10Z"
                      fill="#176B63"
                      fillOpacity="0.2"
                      stroke="#176B63"
                      strokeWidth="1"
                    />
                    <rect fill="#176B63" fillOpacity="0.1" height="4" width="40" x="20" y="50" />
                    <rect fill="#176B63" fillOpacity="0.4" height="4" width="40" x="60" y="50" />
                  </svg>
                </div>
                <span className="text-xs font-mono-data uppercase tracking-wider text-[#65716B] group-hover:text-[#176B63] transition-colors flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Climate Trends */}
          <div
            onClick={() => handleCardClick('ols_decadal_trend')}
            className="bg-white border border-[#DDE3DA] p-6 sm:p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#176B63] hover:shadow-md group cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="mb-4">
                <TrendingUp className="w-6 h-6 text-[#00524B] mb-3 stroke-[1.5px]" />
                <h4 className="font-headline text-xl text-[#141E1A] mb-2">Climate Trends</h4>
                <p className="text-xs sm:text-sm text-[#65716B] leading-relaxed">
                  Track how climate variables change over months, seasons, years, and longer historical periods.
                </p>
              </div>

              <div className="mt-4">
                <div className="h-24 w-full bg-[#EBF6EF]/40 rounded-lg mb-4 flex items-center justify-center border border-[#DDE3DA]/50">
                  <svg
                    fill="none"
                    height="50"
                    viewBox="0 0 100 50"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 40C25 38 35 30 50 25C65 20 75 15 90 10"
                      stroke="#176B63"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <line stroke="#DDE3DA" strokeWidth="1" x1="10" x2="90" y1="45" y2="45" />
                    <line stroke="#DDE3DA" strokeWidth="1" x1="10" x2="10" y1="5" y2="45" />
                  </svg>
                </div>
                <span className="text-xs font-mono-data uppercase tracking-wider text-[#65716B] group-hover:text-[#176B63] transition-colors flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Climate Anomalies */}
          <div
            onClick={() => handleCardClick('copernicus_anomaly')}
            className="bg-white border border-[#DDE3DA] p-6 sm:p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#176B63] hover:shadow-md group cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="mb-4">
                <BarChart3 className="w-6 h-6 text-[#00524B] mb-3 stroke-[1.5px]" />
                <h4 className="font-headline text-xl text-[#141E1A] mb-2">Climate Anomalies</h4>
                <p className="text-xs sm:text-sm text-[#65716B] leading-relaxed">
                  Identify periods and regions that differ from historical climate conditions.
                </p>
              </div>

              <div className="mt-4">
                <div className="h-24 w-full bg-[#EBF6EF]/40 rounded-lg mb-4 flex items-center justify-center border border-[#DDE3DA]/50">
                  <svg
                    fill="none"
                    height="50"
                    viewBox="0 0 100 50"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line stroke="#DDE3DA" strokeWidth="1" x1="10" x2="90" y1="25" y2="25" />
                    <rect fill="#176B63" fillOpacity="0.4" height="15" width="8" x="20" y="25" />
                    <rect fill="#B94A48" fillOpacity="0.6" height="15" width="8" x="35" y="10" />
                    <rect fill="#176B63" fillOpacity="0.4" height="10" width="8" x="50" y="25" />
                    <rect fill="#B94A48" fillOpacity="0.6" height="20" width="8" x="65" y="5" />
                    <rect fill="#176B63" fillOpacity="0.4" height="5" width="8" x="80" y="25" />
                  </svg>
                </div>
                <span className="text-xs font-mono-data uppercase tracking-wider text-[#65716B] group-hover:text-[#176B63] transition-colors flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Seasonal Climatology */}
          <div
            onClick={() => handleCardClick('seasonal_cycle_bands')}
            className="bg-white border border-[#DDE3DA] p-6 sm:p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#176B63] hover:shadow-md group cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="mb-4">
                <CalendarDays className="w-6 h-6 text-[#00524B] mb-3 stroke-[1.5px]" />
                <h4 className="font-headline text-xl text-[#141E1A] mb-2">Seasonal Climatology</h4>
                <p className="text-xs sm:text-sm text-[#65716B] leading-relaxed">
                  Reveal recurring seasonal patterns and compare typical climate behavior across months.
                </p>
              </div>

              <div className="mt-4">
                <div className="h-24 w-full bg-[#EBF6EF]/40 rounded-lg mb-4 flex items-center justify-center border border-[#DDE3DA]/50">
                  <svg
                    fill="none"
                    height="50"
                    viewBox="0 0 100 50"
                    width="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 40C20 40 30 10 50 10C70 10 80 40 90 40"
                      fill="#176B63"
                      fillOpacity="0.05"
                      stroke="#176B63"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <line stroke="#DDE3DA" strokeWidth="1" x1="10" x2="90" y1="45" y2="45" />
                  </svg>
                </div>
                <span className="text-xs font-mono-data uppercase tracking-wider text-[#65716B] group-hover:text-[#176B63] transition-colors flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
