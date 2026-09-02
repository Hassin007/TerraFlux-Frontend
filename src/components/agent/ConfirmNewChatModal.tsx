// ── TerraFlux Confirm New Chat Warning Modal ─────────────────────────────────

import React from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import { useAgentStore } from '../../stores/useAgentStore';

export const ConfirmNewChatModal: React.FC = () => {
  const { isConfirmNewChatOpen, closeConfirmNewChat, startNewConversation } = useAgentStore();

  if (!isConfirmNewChatOpen) return null;

  const handleConfirm = () => {
    startNewConversation();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#17211D]/45 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={closeConfirmNewChat}
    >
      <div
        className="relative w-full max-w-md bg-white border border-[#DDE3DA] rounded-2xl shadow-2xl p-6 text-[#141E1A] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#176B63]/10 via-[#176B63] to-[#176B63]/10" />

        {/* Close Icon Button */}
        <button
          onClick={closeConfirmNewChat}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#65716B] hover:text-[#141E1A] hover:bg-[#F5F6F2] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#EBF6EF] border border-[#176B63]/20 text-[#176B63] shrink-0">
            <MessageSquarePlus className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-[#141E1A] tracking-tight">
              Start a new conversation?
            </h3>
            <p className="text-xs text-[#65716B] mt-1.5 leading-relaxed">
              Starting a new thread will archive your current active chat session. You can still view past inquiries, but new messages will start in a clean context.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#DDE3DA]">
          <button
            type="button"
            onClick={closeConfirmNewChat}
            className="px-4 py-2.5 text-xs font-mono-data uppercase tracking-wider text-[#65716B] hover:text-[#141E1A] bg-[#F5F6F2] hover:bg-[#EBF6EF] rounded-lg border border-[#DDE3DA] transition-all cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono-data uppercase tracking-wider text-white bg-[#176B63] hover:bg-[#00524B] rounded-lg shadow-xs hover:shadow-md transition-all font-bold cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Start New Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

