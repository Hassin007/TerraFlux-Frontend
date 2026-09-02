// ── TerraFlux Topographical Hero Section ───────────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { WireframeGlobe } from './WireframeGlobe';
import {
  Compass,
  ArrowRight,
  BarChart3,
  Globe2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveView } = useViewStore();

  const scrollToPlaygrounds = () => {
    document.getElementById('section-playgrounds')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] pt-20 pb-16 flex flex-col justify-center overflow-hidden border-b border-[#DDE3DA]">
      {/* Background Topo grid texture */}
      <div className="absolute inset-0 bg-topo-grid opacity-70 pointer-events-none" />

      {/* Atmospheric radial ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#176B63]/10 via-[#557A5A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Narrative Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DDE3DA] text-xs font-mono-data text-[#65716B] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#176B63]" />
            <span className="text-[#17211D] font-medium">RESEARCH & NATURE PLATFORM</span>
            <span className="text-[#DDE3DA] hidden sm:inline">|</span>
            <span className="text-[#557A5A] hidden sm:inline">1980–TODAY CONTINUOUS HISTORY</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#17211D] tracking-tight leading-[1.12]">
            Clear Climate History &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B63] via-[#135952] to-[#557A5A]">
              Weather Insights
            </span>{' '}
            for Any Region.
          </h1>

          {/* Subtitle / Scope */}
          <p className="text-sm sm:text-base text-[#65716B] max-w-2xl leading-relaxed">
            Explore 45 years of continuous temperature, rainfall, and wind data. Compare past trends with clear, plain-English summaries and export presentation-ready charts in seconds.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('app')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#176B63] hover:bg-[#135952] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer group"
              id="hero-launch-studio-btn"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Open Explorer & Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={scrollToPlaygrounds}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F5F6F2] text-[#17211D] font-medium text-sm border border-[#DDE3DA] transition-all cursor-pointer shadow-xs"
              id="hero-explore-demo-btn"
            >
              <span>Preview Tools</span>
              <span className="text-xs text-[#89938D] font-mono-data">↓</span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DDE3DA] text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] shadow-xs">
              <p className="text-[#89938D] font-mono-data text-[11px]">Historical Depth</p>
              <p className="text-base font-bold text-[#17211D] font-mono-data mt-0.5">45 Years</p>
              <p className="text-[10px] text-[#557A5A]">1980 to today</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] shadow-xs">
              <p className="text-[#89938D] font-mono-data text-[11px]">Boundary Explorer</p>
              <p className="text-base font-bold text-[#176B63] font-mono-data mt-0.5">Country to District</p>
              <p className="text-[10px] text-[#89938D]">Global mapping</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] shadow-xs">
              <p className="text-[#89938D] font-mono-data text-[11px]">Chart Studio</p>
              <p className="text-base font-bold text-[#B9822B] font-mono-data mt-0.5">High Res</p>
              <p className="text-[10px] text-[#89938D]">PNG, SVG, Vector PDF</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] shadow-xs">
              <p className="text-[#89938D] font-mono-data text-[11px]">Climate Assistant</p>
              <p className="text-base font-bold text-[#4D8FA8] font-mono-data mt-0.5">Plain English</p>
              <p className="text-[10px] text-[#89938D]">Step-by-step answers</p>
            </div>
          </div>
        </div>

        {/* Right 3D Interactive Centerpiece */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <WireframeGlobe />
          {/* Floating HUD callout tags */}
          <div className="absolute top-6 right-4 p-2.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#DDE3DA] text-[11px] font-mono-data shadow-xs hidden sm:block">
            <div className="flex items-center gap-2 text-[#17211D]">
              <span className="w-2 h-2 rounded-full bg-[#176B63]" />
              <span>FOCUS BOUNDARY VIEW</span>
            </div>
            <p className="text-[#65716B] mt-0.5">Highlighted region borders</p>
          </div>

          <div className="absolute bottom-6 left-4 p-2.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#DDE3DA] text-[11px] font-mono-data shadow-xs hidden sm:block">
            <div className="flex items-center gap-2 text-[#557A5A]">
              <span className="w-2 h-2 rounded-full bg-[#557A5A]" />
              <span>WEATHER SAMPLING GRID</span>
            </div>
            <p className="text-[#65716B] mt-0.5">High-accuracy local grid points</p>
          </div>
        </div>
      </div>
    </section>
  );
};
