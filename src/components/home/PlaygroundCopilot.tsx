// ── TerraFlux Micro-Playground 3: Intelligent Climate Assistant ────────────

import React, { useEffect } from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { Sparkles, Terminal, CheckCircle2, Loader2, Thermometer, CloudRain, Mountain } from 'lucide-react';
import katex from 'katex';

export const PlaygroundCopilot: React.FC = () => {
  const {
    homePlayground,
    triggerCopilotDemoPrompt,
  } = useViewStore();

  const { activePromptIndex, currentStep, isSimulating, simulatedOutput, formulaText } =
    homePlayground.copilotDemo;

  const promptChips = [
    { title: 'Summer Heatwave & Temperature Changes in Sindh', idx: 0, icon: Thermometer },
    { title: 'Indus Basin Monsoon Rainfall & River Flow Trends', idx: 1, icon: CloudRain },
    { title: 'European Alps Mountain Snow & Seasonal Warming', idx: 2, icon: Mountain },
  ];

  // Auto trigger the first prompt when mounted if none selected
  useEffect(() => {
    if (activePromptIndex === null) {
      triggerCopilotDemoPrompt(0);
    }
  }, []);

  const renderFormulaHtml = (math: string) => {
    try {
      return { __html: katex.renderToString(math, { displayMode: true, throwOnError: false }) };
    } catch {
      return { __html: math };
    }
  };

  const stepsList = [
    { step: 1, tool: 'resolve_region', name: 'Find map boundaries for the selected region' },
    { step: 2, tool: 'get_climate_stats', name: 'Load 45-year continuous temperature & rain data' },
    { step: 3, tool: 'compute_ols_trend', name: 'Calculate warming trend and compare to normal' },
    { step: 4, tool: 'render_figure', name: 'Draw high-resolution comparison chart' },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Explanation & Controls */}
        <div className="w-full lg:w-1/2 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#176B63]/10 border border-[#176B63]/30 text-xs font-mono-data text-[#176B63]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLAYGROUND 03</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#17211D]">
              Climate Assistant & Step-by-Step Explanations
            </h3>
            <p className="text-xs sm:text-sm text-[#65716B] mt-2 leading-relaxed">
              Ask questions in natural everyday language. The Climate Assistant analyzes past weather records, shows what each tool is doing step-by-step, explains physical atmospheric formulas in plain English, and creates custom charts.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                1. Click a Sample Question:
              </label>
              <div className="space-y-2">
                {promptChips.map((chip) => {
                  const isActive = activePromptIndex === chip.idx;
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.idx}
                      onClick={() => triggerCopilotDemoPrompt(chip.idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#176B63]/10 border-[#176B63] text-[#176B63] font-semibold'
                          : 'bg-[#F5F6F2] border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#176B63]" />
                        <span>{chip.title}</span>
                      </div>
                      <span className="text-[10px] font-mono-data text-[#176B63]">
                        {isActive ? '● ACTIVE' : 'RUN →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Tool Step Ticker */}
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                2. Live Tool Progress:
              </label>
              <div className="space-y-1.5 bg-[#F5F6F2] p-3 rounded-xl border border-[#DDE3DA] text-xs font-mono-data">
                {stepsList.map((st) => {
                  const isCompleted = currentStep > st.step;
                  const isRunning = currentStep === st.step && isSimulating;

                  return (
                    <div
                      key={st.step}
                      className={`flex items-center gap-2.5 py-1 px-2 rounded ${
                        isRunning
                          ? 'bg-[#176B63]/10 text-[#176B63]'
                          : isCompleted
                          ? 'text-[#557A5A]'
                          : 'text-[#89938D]'
                      }`}
                    >
                      {isRunning ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#176B63]" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#557A5A]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#DDE3DA]" />
                      )}
                      <span className="text-[11px] truncate">{st.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Typewriter Result Preview Box */}
        <div className="w-full lg:w-1/2 h-[340px] sm:h-[380px] bg-white rounded-xl border border-[#DDE3DA] p-5 relative flex flex-col justify-between overflow-y-auto select-none shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DA] text-xs font-mono-data">
              <div className="flex items-center gap-2 text-[#17211D]">
                <Terminal className="w-3.5 h-3.5 text-[#176B63]" />
                <span>ASSISTANT ANSWER FEED</span>
              </div>
              <span className="text-[10px] text-[#557A5A]">LIVE RESPONSE</span>
            </div>

            {/* LaTeX Formula Rendering Card */}
            {formulaText && (
              <div className="my-3 p-2.5 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA] overflow-x-auto text-xs">
                <div dangerouslySetInnerHTML={renderFormulaHtml(formulaText)} />
              </div>
            )}

            {/* Output Markdown narrative */}
            <div className="text-xs text-[#17211D] leading-relaxed space-y-2 mt-2">
              {isSimulating ? (
                <div className="flex items-center gap-2 text-[#65716B] py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-[#176B63]" />
                  <span>Synthesizing climate explanation and drawing chart...</span>
                </div>
              ) : (
                <p className="text-[#17211D]">{simulatedOutput}</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE3DA] flex items-center justify-between text-[11px] font-mono-data text-[#65716B]">
            <span>Content Filter: Verified</span>
            <span className="text-[#176B63]">Ready for Questions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
