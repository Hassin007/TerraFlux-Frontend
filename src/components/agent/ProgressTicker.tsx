import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { AgentLogoBadge } from './AgentLogoBadge';
import { Loader2, Check } from 'lucide-react';

export const ProgressTicker: React.FC = () => {
  const { activeToolSteps, progressTicker, uiLockState, streamingContent } = useAgentStore();

  if (uiLockState !== 'streaming') return null;

  const steps =
    activeToolSteps.length > 0
      ? activeToolSteps
      : progressTicker
      ? [
          {
            id: 'fallback_step',
            tool: progressTicker.tool,
            message: progressTicker.message,
            status: 'running' as const,
            timestamp: new Date().toISOString(),
          },
        ]
      : [];

  // If there are no tool steps and content is already streaming, don't show the initial loader
  if (steps.length === 0 && streamingContent) return null;

  return (
    <div className="rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] p-2.5 space-y-1.5 shadow-xs animate-in fade-in duration-150">
      {steps.length > 0 ? (
        steps.map((step) => {
          const isRunning = step.status === 'running';
          return (
            <div
              key={step.id}
              className="flex items-center gap-2.5 text-xs py-0.5 px-1 rounded transition-colors"
            >
              <AgentLogoBadge size="xs" />
              <span className="text-[#17211D] font-mono text-[11px] truncate flex-1">
                {step.message}
              </span>
              {isRunning ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#176B63] shrink-0 ml-1" />
              ) : (
                <Check className="w-3 h-3 text-[#557A5A] stroke-[2.5] shrink-0 ml-1" />
              )}
            </div>
          );
        })
      ) : (
        <div className="flex items-center gap-2.5 text-xs py-0.5 px-1">
          <AgentLogoBadge size="xs" showStatusDot={true} status="streaming" />
          <span className="text-[#17211D] font-mono text-[11px] truncate flex-1">
            Analyzing climate query...
          </span>
          <Loader2 className="w-3 h-3 animate-spin text-[#176B63] shrink-0 ml-1" />
        </div>
      )}
    </div>
  );
};


