// ── TerraFlux Mode 2 Floating Action Button (FAB) ──────────────────────────

import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { X } from 'lucide-react';

export const AgentFab: React.FC = () => {
  const { isPopoverOpen, togglePopover, uiLockState } = useAgentStore();

  const isStreaming = uiLockState === 'streaming';

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <button
        onClick={togglePopover}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer group ${
          isPopoverOpen
            ? 'bg-white text-[#17211D] border border-[#DDE3DA] hover:bg-[#F5F6F2]'
            : 'bg-white border-2 border-[#176B63]/25 text-[#176B63] hover:border-[#176B63] hover:shadow-[0_8px_24px_rgba(23,107,99,0.25)] hover:scale-105'
        }`}
        id="copilot-fab-btn"
        title="TerraFlux Agent"
      >
        {isPopoverOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 text-[#17211D]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <img
              src="/TerraFlux logo.svg"
              alt="TerraFlux Agent"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
            />
            {/* Live Status Indicator */}
            <span
              className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                isStreaming
                  ? 'bg-[#176B63] animate-ping'
                  : 'bg-[#557A5A]'
              }`}
            />
            <span
              className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border-2 border-white ${
                isStreaming ? 'bg-[#176B63]' : 'bg-[#557A5A]'
              }`}
            />
          </div>
        )}
      </button>
    </div>
  );
};

