// ── TerraFlux Home Footer ──────────────────────────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';

export const HomeFooter: React.FC = () => {
  const { setActiveView } = useViewStore();

  return (
    <footer className="border-t border-[#DDE3DA] bg-white py-12 px-4 md:px-10 mt-12 select-none">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveView('home')}
          className="font-headline text-xl font-semibold text-[#141E1A] flex items-center gap-2.5 opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
        >
          <img
            alt="TerraFlux Logo"
            className="h-6 w-auto object-contain"
            src="/TerraFlux logo.svg"
          />
          <span>TerraFlux</span>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex items-center gap-6 text-xs font-mono-data text-[#65716B]">
          <button
            onClick={() => setActiveView('home')}
            className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('app')}
            className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider"
          >
            Explore & Studio
          </button>
          <button
            onClick={() => setActiveView('guide')}
            className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider font-semibold text-[#00524B]"
          >
            Guide & FAQ
          </button>
        </div>

        {/* Copyright Notice */}
        <div className="text-xs font-mono-data text-[#65716B] uppercase tracking-widest text-center sm:text-right">
          © 2024 Planetary Intelligence Systems
        </div>
      </div>
    </footer>
  );
};
