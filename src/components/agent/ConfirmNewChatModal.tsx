// ── TerraFlux Confirm New Chat Warning Modal ─────────────────────────────────

import React from 'react';
import { AlertTriangle, PlusCircle, X } from 'lucide-react';
import { useAgentStore } from '../../stores/useAgentStore';

export const ConfirmNewChatModal: React.FC = () => {
  const { isConfirmNewChatOpen, closeConfirmNewChat, startNewConversation } = useAgentStore();

  if (!isConfirmNewChatOpen) return null;

  const handleConfirm = () => {
    startNewConversation();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={closeConfirmNewChat}
    >
      <div
        className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/80 to-amber-500/0" />

        {/* Close Icon Button */}
        <button
          onClick={closeConfirmNewChat}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
              Start a new conversation?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Starting a new thread will archive your current active chat session. You won't be able to resume typing in this thread.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={closeConfirmNewChat}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all border border-slate-700/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-950/40 transition-all font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            Start New Chat
          </button>
        </div>
      </div>
    </div>
  );
};
