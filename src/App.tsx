// ── TerraFlux Master Single-Page Application (SPA) Root ───────────────────

import React, { useEffect } from 'react';
import { useViewStore } from './stores/useViewStore';
import { useAgentStore } from './stores/useAgentStore';
import { useStudioStore } from './stores/useStudioStore';
import { NavigationHeader } from './components/layout/NavigationHeader';
import { CommandPalette } from './components/layout/CommandPalette';
import { HomeLandingPage } from './components/home/HomeLandingPage';
import { AppWorkspaceView } from './components/app/AppWorkspaceView';

export default function App() {
  const { activeView, setCmdkOpen, isCmdkOpen } = useViewStore();
  const { togglePopover } = useAgentStore();
  const { closeStudio, isStudioOpen } = useStudioStore();

  // Global Keyboard Shortcuts (Ctrl+K, Esc, Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdkOpen(!isCmdkOpen);
      }

      // Ctrl+/ / Cmd+/ -> Climate Assistant toggle
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        togglePopover();
      }

      // Escape -> close open modals or command palette
      if (e.key === 'Escape') {
        if (isCmdkOpen) setCmdkOpen(false);
        else if (isStudioOpen) closeStudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdkOpen, isStudioOpen, setCmdkOpen, togglePopover, closeStudio]);

  const isAppView = activeView === 'app';

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F5F6F2] text-[#17211D] font-sans antialiased selection:bg-[#176B63]/20 selection:text-[#17211D] ${
        isAppView ? 'h-screen overflow-hidden' : 'overflow-x-hidden overflow-y-auto'
      }`}
    >
      {/* 1. Persistent Top Navigation Header */}
      <NavigationHeader />

      {/* 2. Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* 3. Main Route Switching: Home Prologue vs Mode 1/2 Workspace */}
      <main
        className={`flex-1 w-full relative pt-16 ${
          isAppView ? 'h-full overflow-hidden flex flex-col' : 'min-h-screen'
        }`}
      >
        {activeView === 'home' ? <HomeLandingPage /> : <AppWorkspaceView />}
      </main>
    </div>
  );
}
