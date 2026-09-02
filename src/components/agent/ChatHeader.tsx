// ── TerraFlux Copilot Chat Window Header ──────────────────────────────────

import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { AgentLogoBadge } from './AgentLogoBadge';
import {
  Plus,
  Maximize2,
  Minimize2,
  X,
  AlertTriangle,
} from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const {
    uiLockState,
    activeConversation,
    isExpanded,
    toggleExpand,
    openConfirmNewChat,
    startNewConversation,
    togglePopover,
  } = useAgentStore();

  const handleNewChatClick = () => {
    // If conversation has more than initial welcome message, show soft warning confirmation
    if (activeConversation.messages.length > 1) {
      openConfirmNewChat();
    } else {
      startNewConversation();
    }
  };

  const isNearLimit = activeConversation.tokensUsed >= activeConversation.tokenLimit * 0.9;

  const getStatusBadge = () => {
    switch (uiLockState) {
      case 'streaming':
        return { text: 'EXECUTING', color: 'text-[#176B63] border-[#176B63]/30 bg-[#176B63]/10 font-bold', status: 'streaming' as const };
      case 'cooldown':
      case 'daily_quota':
        return { text: 'RATE LIMITED', color: 'text-[#B9822B] border-[#B9822B]/30 bg-[#B9822B]/10', status: 'cooldown' as const };
      case 'session_expired':
        return { text: 'IDLE EXPIRED', color: 'text-rose-600 border-rose-200 bg-rose-50', status: 'expired' as const };
      default:
        return { text: 'ONLINE', color: 'text-[#176B63] border-[#DDE3DA] bg-white', status: 'online' as const };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="h-14 px-4 bg-[#F5F6F2] border-b border-[#DDE3DA] flex items-center justify-between select-none shrink-0">
      {/* Title & Live Status Indicator */}
      <div className="flex items-center gap-2.5">
        <AgentLogoBadge
          size="md"
          showStatusDot={true}
          status={statusInfo.status}
        />

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-xs tracking-wide text-[#17211D]">
              TERRAFLUX AGENT
            </h3>
            <span className={`text-[10px] font-mono-data px-1.5 py-0.2 rounded border ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Usage Telemetry */}
          <div className="flex items-center gap-1 text-[10px] font-mono-data text-[#65716B]">
            <span className={isNearLimit ? 'text-[#B9822B] font-bold' : ''}>
              CAPACITY: {activeConversation.tokensUsed.toLocaleString()} / {activeConversation.tokenLimit.toLocaleString()}
            </span>
            {isNearLimit && <AlertTriangle className="w-3 h-3 text-[#B9822B]" />}
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1 text-[#65716B]">
        {/* New Session Button */}
        <button
          onClick={handleNewChatClick}
          disabled={uiLockState === 'streaming'}
          className="p-1.5 rounded-lg hover:text-[#17211D] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer disabled:opacity-40"
          title="New Conversation"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Expand / Minimize Window */}
        <button
          onClick={toggleExpand}
          className="p-1.5 rounded-lg hover:text-[#17211D] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer hidden sm:block"
          title={isExpanded ? 'Contract Popover' : 'Expand Popover'}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={togglePopover}
          className="p-1.5 rounded-lg hover:text-[#17211D] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
