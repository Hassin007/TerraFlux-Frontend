import React, { useEffect, useRef, useState } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { AgentLogoBadge } from './AgentLogoBadge';
import { MarkdownContent } from './MarkdownContent';
import { ProgressTicker } from './ProgressTicker';
import { ThinkingAccordion } from './ThinkingAccordion';
import { ToolStepsAccordion } from './ToolStepsAccordion';
import { FigureCard } from './FigureCard';
import { ForecastCard } from './ForecastCard';
import { GuardrailMessage } from './GuardrailMessage';
import { User, Copy, Check } from 'lucide-react';

export const ChatMessageList: React.FC = () => {
  const {
    activeConversation,
    activeToolSteps,
    activeThoughts,
    streamingContent,
    uiLockState,
  } = useAgentStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Smooth internal-only scroll as tokens, thoughts, and tool steps stream in
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [
    activeConversation.messages,
    activeToolSteps,
    activeThoughts,
    streamingContent,
    uiLockState,
  ]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-white"
    >
      {activeConversation.messages.map((msg, index) => {
        // User message bubble
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="flex justify-end gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#176B63]/10 border border-[#176B63]/25 p-3 text-[#17211D]">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[10px] font-mono-data text-[#557A5A] block text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#176B63] text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        }

        // Guardrail or System message
        if (msg.role === 'system' || msg.isGuardrail) {
          return (
            <GuardrailMessage
              key={msg.id}
              type={msg.guardrailType}
              content={msg.content}
            />
          );
        }

        // Dedicated Branded Identity Card for Welcome / Intro
        if (msg.id === 'msg_welcome' && index === 0) {
          return (
            <div key={msg.id} className="space-y-3 animate-in fade-in duration-200">
              {/* Branded Identity Hero Card */}
              <div className="rounded-2xl bg-gradient-to-b from-[#F5F6F2] to-white border border-[#DDE3DA] p-4 text-[#17211D] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AgentLogoBadge size="md" showStatusDot={true} status="online" />
                    <div>
                      <h3 className="font-display font-bold text-sm tracking-tight text-[#17211D]">
                        TerraFlux Agent
                      </h3>
                      <p className="text-[11px] text-[#65716B]">
                        Geospatial Climate Analytics & Visual Intelligence
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="flex items-center gap-1 text-[10px] text-[#65716B] hover:text-[#17211D] p-1.5 rounded-lg hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer"
                    title="Copy welcome guide"
                  >
                    {copiedId === msg.id ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-mono text-[10px]">
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-[#17211D] leading-relaxed pt-1 border-t border-[#DDE3DA]/60">
                  <MarkdownContent content={msg.content} />
                </div>
              </div>
            </div>
          );
        }

        // Standard Assistant response message
        return (
          <div key={msg.id} className="flex justify-start gap-2.5">
            <div className="shrink-0 mt-1">
              <AgentLogoBadge size="sm" />
            </div>
            <div className="max-w-[90%] space-y-2 flex-1">
              {/* Collapsible Reasoning Process Accordion */}
              {msg.thoughts && msg.thoughts.length > 0 && (
                <ThinkingAccordion
                  thoughts={msg.thoughts}
                  isLive={false}
                  defaultExpanded={false}
                />
              )}

              {/* Collapsible Execution Steps Timeline Accordion */}
              {msg.toolSteps && msg.toolSteps.length > 0 && (
                <ToolStepsAccordion
                  steps={msg.toolSteps}
                  isLive={false}
                  defaultExpanded={false}
                />
              )}

              <div className="rounded-2xl rounded-tl-sm bg-[#F5F6F2] border border-[#DDE3DA] p-3.5 text-[#17211D] shadow-xs">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#DDE3DA]/60 text-[10px] font-mono-data text-[#176B63] font-bold">
                  <span>TerraFlux Agent</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="flex items-center gap-1 text-[10px] text-[#65716B] hover:text-[#17211D] px-1.5 py-0.5 rounded hover:bg-[#DDE3DA]/60 transition-colors cursor-pointer"
                    title="Copy response text"
                  >
                    {copiedId === msg.id ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-mono text-[10px]">
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-sans text-[10px]">
                        <Copy className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>

                <MarkdownContent content={msg.content} />

                {/* Inline Weather Forecast Card */}
                {msg.forecast && <ForecastCard forecast={msg.forecast} />}

                {/* Inline Synthesized Figures */}
                {msg.figures &&
                  msg.figures.map((fig, idx) => (
                    <FigureCard key={fig.id || `fig_${idx}`} figure={fig} />
                  ))}

                <span className="text-[10px] font-mono-data text-[#65716B] block text-right mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Live In-flight Assistant Turn (Streaming UX like Gemini/Claude) */}
      {uiLockState === 'streaming' && (
        <div className="flex justify-start gap-2.5 animate-in fade-in duration-150">
          <div className="shrink-0 mt-1">
            <AgentLogoBadge size="sm" showStatusDot={true} status="streaming" />
          </div>
          <div className="max-w-[90%] space-y-2 flex-1">
            {/* Live Reasoning Process */}
            {activeThoughts.length > 0 && (
              <ThinkingAccordion
                thoughts={activeThoughts}
                isLive={true}
                defaultExpanded={true}
              />
            )}

            {/* Live Execution Steps Timeline Accordion */}
            {activeToolSteps.length > 0 ? (
              <ToolStepsAccordion
                steps={activeToolSteps}
                isLive={true}
                defaultExpanded={true}
              />
            ) : (
              <ProgressTicker />
            )}

            {/* Live Token Streaming Bubble */}
            {streamingContent && (
              <div className="rounded-2xl rounded-tl-sm bg-[#F5F6F2] border border-[#DDE3DA] p-3.5 text-[#17211D] shadow-xs">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#DDE3DA]/60 text-[10px] font-mono-data text-[#176B63] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>TerraFlux Agent</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#176B63] animate-pulse" />
                  </span>
                  <span className="text-[10px] text-[#65716B] font-mono font-normal">
                    Streaming...
                  </span>
                </div>

                <div className="relative text-xs leading-relaxed">
                  <MarkdownContent content={streamingContent} />
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#176B63] animate-pulse align-middle" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
