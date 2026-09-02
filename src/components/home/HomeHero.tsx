// ── TerraFlux Home Hero Section ────────────────────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setActiveView } = useViewStore();
  const { openStudio } = useStudioStore();

  const scrollToInstruments = () => {
    const el = document.getElementById('precision-instruments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWorkflow = () => {
    const el = document.getElementById('workflow-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[880px] md:min-h-[920px] flex flex-col items-center justify-center px-4 overflow-hidden hero-gradient">
      {/* Background Radial & Vector Glow Effect */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none mix-blend-multiply flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[#176B63]/10 blur-3xl animate-float pointer-events-none" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8 mt-10 md:mt-14">
        {/* Top Analysis Engine Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[#426748] font-mono-data text-xs uppercase tracking-widest shadow-xs">
          Global Analysis Engine
        </div>

        {/* Main Title */}
        <h1 className="font-headline text-[42px] sm:text-[56px] md:text-[72px] leading-[1.1] text-[#141E1A] tracking-tight text-balance">
          Planetary Intelligence for a{' '}
          <span className="text-[#176B63] italic font-medium">Changing World</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#65716B] max-w-2xl text-balance leading-relaxed font-sans">
          Deploy high-precision environmental models, track critical climate variables, and synthesize complex geospatial data within a professional-grade research instrument.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveView('app');
              openStudio();
            }}
            className="bg-[#176B63] text-white font-mono-data text-xs uppercase tracking-wider px-8 py-4 rounded-lg shadow-xs hover:shadow-md hover:bg-[#00524B] transition-all duration-300 cursor-pointer"
            id="hero-enter-studio-btn"
          >
            Enter Studio
          </button>
          <button
            onClick={scrollToWorkflow}
            className="bg-white border border-[#176B63] text-[#176B63] font-mono-data text-xs uppercase tracking-wider px-8 py-4 rounded-lg shadow-xs hover:bg-[#EBF6EF] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            id="hero-view-docs-btn"
          >
            <span>View Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        onClick={scrollToInstruments}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#65716B] opacity-75 hover:opacity-100 transition-opacity animate-bounce cursor-pointer select-none"
      >
        <span className="font-mono-data text-[10px] uppercase tracking-widest">
          Scroll to Explore
        </span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
};
