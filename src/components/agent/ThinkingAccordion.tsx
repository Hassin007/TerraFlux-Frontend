import React, { useEffect, useRef, useState } from 'react';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';

interface ThinkingAccordionProps {
  thoughts: string[];
  isLive?: boolean;
  defaultExpanded?: boolean;
}

export const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  thoughts,
  isLive = false,
  defaultExpanded = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // Auto-expand and keep scrolled to bottom while live thinking streams
  useEffect(() => {
    if (isLive && thoughts.length > 0) {
      setIsOpen(true);
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }
  }, [thoughts, isLive]);

  if (!thoughts || thoughts.length === 0) {
    return null;
  }

  const combinedThought = thoughts.join('\n\n---\n\n');

  return (
    <div className="rounded-xl border border-[#DDE3DA] bg-[#F8F9F6] overflow-hidden text-xs transition-all shadow-xs my-2">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#F1F3EE] hover:bg-[#EAECE6] text-[#2C3A33] font-medium transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#176B63]/10 flex items-center justify-center text-[#176B63]">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#17211D]">
            Thinking Process
          </span>
          {isLive ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Reasoning...
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#DDE3DA]/60 text-[#65716B] text-[10px] font-mono">
              Reasoning Complete
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#65716B]">
          <span className="text-[10px] hidden sm:inline">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div
          ref={bodyRef}
          className="p-3 text-[11px] font-mono leading-relaxed text-[#4A5550] bg-white/70 border-t border-[#DDE3DA]/60 max-h-64 overflow-y-auto space-y-2 scroll-smooth"
        >
          <MarkdownContent content={combinedThought} />
          {isLive && (
            <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#176B63] animate-pulse align-middle" />
          )}
        </div>
      )}
    </div>
  );
};
