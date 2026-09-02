// ── TerraFlux Top Navigation Bar ───────────────────────────────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { useAgentStore } from '../../stores/useAgentStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { Globe, User, Search, Sparkles, BarChart3, Map } from 'lucide-react';

export const NavigationHeader: React.FC = () => {
  const { activeView, setActiveView, toggleCmdk } = useViewStore();
  const { togglePopover, isPopoverOpen } = useAgentStore();
  const { openStudio, openSaveMapModal } = useStudioStore();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 bg-white/95 backdrop-blur-md border-b border-[#DDE3DA] transition-colors select-none">
      {/* Brand Logo */}
      <div
        onClick={() => setActiveView('home')}
        className="font-headline text-2xl font-semibold text-[#00524B] flex items-center gap-2 cursor-pointer group"
        id="nav-brand-logo"
      >
        <img
          alt="TerraFlux Logo"
          className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          src="/TerraFlux logo.svg"
        />
        <span className="tracking-tight">TerraFlux</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6 md:gap-8 items-center h-full">
        <button
          onClick={() => setActiveView('home')}
          className={`h-full flex items-center font-mono-data text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeView === 'home'
              ? 'text-[#00524B] border-b-2 border-[#00524B] font-bold'
              : 'text-[#65716B] hover:text-[#00524B]'
          }`}
          id="nav-tab-overview"
        >
          Overview
        </button>
        <button
          onClick={() => setActiveView('app')}
          className={`h-full flex items-center font-mono-data text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeView === 'app'
              ? 'text-[#00524B] border-b-2 border-[#00524B] font-bold'
              : 'text-[#65716B] hover:text-[#00524B]'
          }`}
          id="nav-tab-explorer"
        >
          Explorer & Studio
        </button>
      </nav>

      {/* Trailing Actions */}
      <div className="flex items-center gap-2 md:gap-3 text-[#65716B]">
        {/* Quick Search palette */}
        <button
          onClick={toggleCmdk}
          className="p-2 rounded-lg hover:text-[#00524B] hover:bg-[#F5F6F2] transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-mono-data border border-[#DDE3DA]"
          title="Search area or parameter (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#65716B]" />
          <span>Search</span>
          <kbd className="px-1 text-[10px] bg-white rounded border border-[#DDE3DA]">⌘K</kbd>
        </button>

        {/* Save Map Button */}
        <button
          onClick={() => openSaveMapModal()}
          className="p-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-mono-data border border-[#DDE3DA]"
          title="Save Map (Cartography Studio)"
        >
          <Map className="w-3.5 h-3.5 text-emerald-700" />
          <span>Save Map</span>
        </button>

        {/* Chart Studio */}
        <button
          onClick={() => openStudio()}
          className="p-2 rounded-lg hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-mono-data border border-[#DDE3DA]"
          title="Chart & Visuals Studio"
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          <span>Studio</span>
        </button>

        {/* Climate Assistant Toggle */}
        <button
          onClick={togglePopover}
          className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono-data ${
            isPopoverOpen
              ? 'bg-[#176B63] text-white'
              : 'hover:text-[#00524B] hover:bg-[#F5F6F2] border border-[#DDE3DA]'
          }`}
          title="Climate Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Assistant</span>
        </button>

        {/* Global GIS quick toggle */}
        <button
          onClick={() => setActiveView('app')}
          className="p-1.5 rounded-lg hover:text-[#00524B] hover:bg-[#F5F6F2] transition-colors cursor-pointer"
          title="Open Global Map"
        >
          <Globe className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveView('app')}
          className="p-1.5 rounded-lg hover:text-[#00524B] hover:bg-[#F5F6F2] transition-colors cursor-pointer"
          title="Workspace Session"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
