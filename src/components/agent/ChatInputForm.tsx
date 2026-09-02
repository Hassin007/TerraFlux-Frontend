import React, { useState, useRef, useEffect } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { useAgentStream } from '../../hooks/useAgentStream';
import { Send, Sparkles, Loader2, Clock, PlusCircle, AlertCircle, Map, Terminal } from 'lucide-react';

const EXAMPLE_MAP_CMD = '/map Karachi precipitation mean 2021-2025';
const EXAMPLE_MAP_SYNTAX = '/map <location> <variable> <reducer> <dates>';

export const ChatInputForm: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [isSlashMenuDismissed, setIsSlashMenuDismissed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { uiLockState, activeConversation, startNewConversation } = useAgentStore();
  const { submitQuery } = useAgentStream();

  const isLocked = uiLockState !== 'idle';

  // Determine if slash command autocomplete menu should be visible
  const isTypingSlash =
    inputVal.startsWith('/') &&
    !inputVal.includes(' ') &&
    !isSlashMenuDismissed &&
    (inputVal === '/' || '/map'.startsWith(inputVal.toLowerCase()));

  // Determine if active command helper banner should be visible
  const isMapCommandActive = inputVal.trimStart().startsWith('/map');

  // Reset menu dismissal when user deletes or changes input
  useEffect(() => {
    if (inputVal === '/') {
      setIsSlashMenuDismissed(false);
    }
  }, [inputVal]);

  const suggestionChips = [
    'Analyze summer heat trends in Sindh, Pakistan',
    'Evaluate Indus Basin monsoon rainfall changes',
    'Summarize temperature shifts across European Alps',
  ];

  const handleSelectSlashCommand = (cmd: string) => {
    setInputVal(cmd);
    setIsSlashMenuDismissed(true);
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!inputVal.trim() || isLocked) return;
    submitQuery(inputVal.trim());
    setInputVal('');
    setIsSlashMenuDismissed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isTypingSlash) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        handleSelectSlashCommand('/map ');
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSlashMenuDismissed(true);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3.5 bg-[#F5F6F2] border-t border-[#DDE3DA] space-y-2 select-none shrink-0 relative">
      {/* 1. Floating Slash Command Autocomplete Menu */}
      {isTypingSlash && (
        <div className="absolute bottom-full left-3.5 right-3.5 mb-2 bg-white rounded-2xl border border-[#176B63]/40 shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#DDE3DA]/70 px-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#176B63] font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>COMMAND PALETTE</span>
            </div>
            <span className="text-[10px] font-mono text-[#89938D]">Tab / Enter to select • Esc to dismiss</span>
          </div>

          <div
            onClick={() => handleSelectSlashCommand('/map ')}
            className="p-2.5 rounded-xl bg-[#F5F6F2] hover:bg-[#EBF6EF] border border-[#DDE3DA] hover:border-[#176B63]/50 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#176B63] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                  <Map className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#17211D]">/map</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#176B63]/10 text-[#176B63] font-semibold border border-[#176B63]/20">
                      Interactive WebGIS
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#176B63] font-bold bg-white px-2 py-0.5 rounded border border-[#DDE3DA] shadow-xs">
                Select ↵
              </span>
            </div>

            <p className="text-[11px] text-[#65716B] leading-tight pl-8">
              Configure and render a live interactive climate raster & grid layer on the 3D globe.
            </p>

            <div className="pl-8 pt-1 space-y-1 text-[10px] font-mono border-t border-[#DDE3DA]/50">
              <div className="text-[#65716B]">
                <span className="text-[#89938D]">Syntax:</span> <code className="text-[#17211D] font-medium">{EXAMPLE_MAP_SYNTAX}</code>
              </div>
              <div className="text-[#176B63]">
                <span className="text-[#89938D]">Example:</span> <code className="font-medium">{EXAMPLE_MAP_CMD}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Active Command Helper Banner with Concrete Example */}
      {isMapCommandActive && (
        <div className="px-3 py-1.5 rounded-xl bg-[#EBF6EF] border border-[#176B63]/30 text-xs text-[#17211D] flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 overflow-hidden text-[11px] font-mono">
            <span className="font-bold text-[#176B63] flex items-center gap-1 shrink-0">
              <Map className="w-3.5 h-3.5" /> /map:
            </span>
            <span className="text-[#65716B] truncate">{EXAMPLE_MAP_SYNTAX}</span>
          </div>
          <button
            type="button"
            onClick={() => setInputVal(EXAMPLE_MAP_CMD)}
            className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-lg bg-white hover:bg-[#176B63] text-[#176B63] hover:text-white border border-[#176B63]/30 transition-colors shrink-0 cursor-pointer shadow-xs"
            title="Click to fill concrete example query"
          >
            Use Example
          </button>
        </div>
      )}

      {/* Session Expired Banner */}
      {uiLockState === 'session_expired' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-amber-900 animate-fade-in">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Conversation timed out after 30 mins of inactivity.</span>
          </div>
          <button
            type="button"
            onClick={() => startNewConversation('inactivity_expired')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#176B63] hover:bg-[#135952] text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Start New Chat
          </button>
        </div>
      )}

      {/* Daily Quota Exceeded Banner */}
      {uiLockState === 'daily_quota' && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-900 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Daily allocation of 200,000 tokens reached. Resets at UTC midnight.</span>
        </div>
      )}

      {/* Quick Suggestion Chips on clean/initial conversation */}
      {activeConversation.messages.length <= 2 && uiLockState === 'idle' && !isMapCommandActive && !isTypingSlash && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                submitQuery(chip);
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#DDE3DA]/40 text-[#65716B] hover:text-[#17211D] text-[11px] font-mono-data border border-[#DDE3DA] shrink-0 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#176B63]" />
              <span className="truncate max-w-[200px]">{chip}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Textarea & Submit */}
      <div className="relative flex items-end gap-2 bg-white border border-[#DDE3DA] focus-within:border-[#176B63] rounded-xl p-2 transition-colors shadow-xs">
        <textarea
          ref={textareaRef}
          rows={2}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLocked}
          placeholder={
            uiLockState === 'session_expired'
              ? 'Session expired. Click "Start New Chat" above to continue...'
              : uiLockState === 'daily_quota'
              ? 'Daily token quota exhausted until UTC midnight.'
              : uiLockState === 'streaming'
              ? 'Analyzing climate records and generating response...'
              : 'Ask a question or type /map to render interactive layer...'
          }
          className="w-full bg-transparent text-xs text-[#17211D] resize-none focus:outline-none placeholder:text-[#89938D] disabled:opacity-60 font-sans"
          id="copilot-input-textarea"
        />

        <button
          onClick={handleSend}
          disabled={!inputVal.trim() || isLocked}
          className="p-2 rounded-lg bg-[#176B63] hover:bg-[#135952] disabled:bg-[#DDE3DA] text-white disabled:text-[#89938D] font-bold transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          id="copilot-submit-btn"
        >
          {uiLockState === 'streaming' ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
