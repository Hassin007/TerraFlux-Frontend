// ── TerraFlux Cinematic Launch Portal Section ──────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { Compass, ArrowRight, Sparkles, Globe2, Shield } from 'lucide-react';

export const LaunchPortalSection: React.FC = () => {
  const { setActiveView } = useViewStore();

  return (
    <section className="relative py-20 overflow-hidden text-center bg-white border-t border-[#DDE3DA]">
      {/* Radial glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[350px] bg-[#176B63]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F6F2] border border-[#DDE3DA] text-xs font-mono-data text-[#176B63]">
          <Sparkles className="w-3.5 h-3.5 text-[#176B63]" />
          <span>INSTANT CLIMATE WORKSPACE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#17211D] tracking-tight">
          Ready to Explore <span className="text-[#176B63]">Climate Data</span>?
        </h2>

        <p className="text-sm sm:text-base text-[#65716B] max-w-xl mx-auto leading-relaxed">
          Open the full interactive map view to examine administrative boundaries, sample historical weather grids, and export clear figures.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('app')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#176B63] hover:bg-[#135952] text-white font-bold text-base transition-all shadow-sm hover:shadow-md cursor-pointer group"
            id="portal-enter-btn"
          >
            <Compass className="w-5 h-5 text-white" />
            <span>Launch TerraFlux Workspace</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-6 text-xs text-[#65716B] font-mono-data">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#557A5A]" /> Instant Access
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#176B63]" /> Worldwide Coverage
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B9822B]" /> Climate Assistant Ready
          </span>
        </div>
      </div>
    </section>
  );
};
