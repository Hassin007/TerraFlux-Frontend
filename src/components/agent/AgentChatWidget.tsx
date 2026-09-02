import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { AgentFab } from './AgentFab';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputForm } from './ChatInputForm';
import { CooldownBanner } from './CooldownBanner';
import { FigureLightbox } from './FigureLightbox';
import { ConfirmNewChatModal } from './ConfirmNewChatModal';

export const AgentChatWidget: React.FC = () => {
  const { isPopoverOpen, isExpanded } = useAgentStore();

  return (
    <>
      {/* Floating Action Button */}
      <AgentFab />

      {/* Floating Chat Popover Window */}
      {isPopoverOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 bg-white/95 backdrop-blur-2xl border border-[#DDE3DA] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isExpanded
              ? 'w-[95vw] sm:w-[680px] h-[85vh] sm:h-[740px]'
              : 'w-[92vw] sm:w-[420px] h-[75vh] sm:h-[600px]'
          }`}
          id="copilot-popover-window"
        >
          <ChatHeader />
          <ChatMessageList />
          <CooldownBanner />
          <ChatInputForm />
        </div>
      )}

      {/* Full-res Figure Lightbox */}
      <FigureLightbox />

      {/* Soft Warning Confirm New Chat Modal */}
      <ConfirmNewChatModal />
    </>
  );
};
