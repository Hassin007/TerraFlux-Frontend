// ── TerraFlux Bento Precision Instruments & Interactive Playgrounds ────────

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import {
  Map,
  Thermometer,
  Sparkles,
  CloudRain,
  Leaf,
  Send,
  Loader2,
} from 'lucide-react';

export const HomePrecisionInstruments: React.FC = () => {
  // ── Playground 1: Boundary Explorer Timeline Scrubber ─────────────────────
  const [timelineYear, setTimelineYear] = useState<number>(2024);

  // ── Playground 2: Decadal Temperature Shift Hover Bar ──────────────────────
  const [hoveredDecade, setHoveredDecade] = useState<string | null>(null);

  const decadalData = [
    { decade: "'80s", anomaly: '+0.2°', heightPct: 30, color: 'bg-[#DAE5DE]/50 hover:bg-[#DAE5DE]' },
    { decade: "'90s", anomaly: '+0.5°', heightPct: 45, color: 'bg-[#DAE5DE]/70 hover:bg-[#DAE5DE]' },
    { decade: "'00s", anomaly: '+0.8°', heightPct: 60, color: 'bg-[#176B63]/40 hover:bg-[#176B63]/60' },
    { decade: "'10s", anomaly: '+1.1°', heightPct: 80, color: 'bg-[#B9822B]/60 hover:bg-[#B9822B]/80' },
    { decade: "'20s", anomaly: '+1.4°', heightPct: 95, color: 'bg-[#B94A48]/70 hover:bg-[#B94A48] shadow-[0_-4px_12px_rgba(185,74,72,0.15)]' },
  ];

  // ── Playground 3: Climate Assistant Simulation ────────────────────────────
  const [activeQuery, setActiveQuery] = useState<string>(
    'Assess drought vulnerability in the Punjab region over the next 6 months based on current moisture deficits.'
  );
  const [inputCustomText, setInputCustomText] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentToolStep, setCurrentToolStep] = useState<number>(-1);
  const [typedText, setTypedText] = useState<string>('');
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const toolSteps = [
    'Resolving regional polygon...',
    'Retrieving historical moisture data...',
    'Calculating Palmer Drought Severity Index (PDSI)...',
    'Synthesizing anomaly models...',
  ];

  const fullAssistantResponse =
    'Based on current telemetry, the Punjab region shows elevated risk. Moisture deficits are compounding.\n\nProjected PDSI:\n';
  const mathFormula = 'PDSI = 0.897 \\times PDSI_{i-1} + (Z_i / 3)';
  const summaryConclusion =
    'We anticipate severe drought conditions (PDSI < -3.0) persisting through Q3 unless precipitation normalizes.';

  // Run simulation effect whenever activeQuery changes
  useEffect(() => {
    let isCancelled = false;
    setIsSimulating(true);
    setCurrentToolStep(-1);
    setTypedText('');
    setShowFormula(false);
    setShowSummary(false);

    const runSimulation = async () => {
      // Step 1: Query display delay
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;

      // Step 2: Tool progress steps
      for (let i = 0; i < toolSteps.length; i++) {
        setCurrentToolStep(i);
        await new Promise((r) => setTimeout(r, 700));
        if (isCancelled) return;
      }
      setCurrentToolStep(toolSteps.length); // complete

      // Step 3: Typewriter assistant response
      await new Promise((r) => setTimeout(r, 400));
      if (isCancelled) return;

      for (let i = 1; i <= fullAssistantResponse.length; i++) {
        if (isCancelled) return;
        setTypedText(fullAssistantResponse.slice(0, i));
        await new Promise((r) => setTimeout(r, 22));
      }

      // Step 4: Reveal KaTeX Math Formula
      setShowFormula(true);
      await new Promise((r) => setTimeout(r, 300));
      if (isCancelled) return;

      // Step 5: Reveal Summary Text
      setShowSummary(true);
      setIsSimulating(false);
    };

    runSimulation();

    return () => {
      isCancelled = true;
    };
  }, [activeQuery]);

  // KaTeX HTML output
  const renderedFormulaHtml = React.useMemo(() => {
    try {
      return katex.renderToString(mathFormula, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return mathFormula;
    }
  }, [mathFormula]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCustomText.trim() || isSimulating) return;
    setActiveQuery(inputCustomText.trim());
    setInputCustomText('');
  };

  return (
    <section id="precision-instruments" className="py-24 sm:py-32 px-4 md:px-10 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl sm:text-4xl text-[#141E1A] mb-4">
          Precision Instruments
        </h2>
        <p className="text-base text-[#65716B] leading-relaxed">
          Interact with fragmented data streams through structured, purpose-built interfaces designed for clarity and depth.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
        {/* Micro-Playground 1: Boundary Explorer (Span 7 cols) */}
        <div className="md:col-span-7 glass-panel rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-500">
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Map className="w-5 h-5 text-[#176B63] stroke-[1.5px]" />
                <h3 className="font-headline text-xl text-[#141E1A]">Boundary Explorer</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#65716B]">
                Observe structural morphing of regional demarcations over specific timeframes.
              </p>
            </div>
            <span className="bg-[#426748]/10 text-[#426748] font-mono-data text-[10px] px-2 py-1 rounded uppercase tracking-wider border border-[#426748]/20 shrink-0">
              Interactive
            </span>
          </div>

          {/* Morphing Map Geometry Simulation */}
          <div className="flex-grow my-4 rounded-xl border border-[#DDE3DA] bg-[#EBF6EF]/50 relative overflow-hidden flex items-center justify-center min-h-[220px]">
            {/* Abstract representation of map boundary morphing */}
            <div
              className="w-44 h-44 sm:w-52 sm:h-52 border-2 border-[#176B63]/30 rounded-3xl animate-[spin_12s_linear_infinite] flex items-center justify-center transition-all duration-500"
              style={{
                borderRadius: `${30 + ((timelineYear - 1990) / 34) * 25}%`,
                transform: `rotate(${((timelineYear - 1990) / 34) * 90}deg)`,
              }}
            >
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 border-2 border-[#176B63]/50 rounded-[40%] animate-[spin_8s_linear_reverse_infinite] flex items-center justify-center"
                style={{
                  borderRadius: `${40 - ((timelineYear - 1990) / 34) * 15}%`,
                }}
              >
                <div className="w-16 h-16 bg-[#176B63]/20 rounded-full blur-md" />
              </div>
            </div>

            {/* Scrubber Timeline Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#65716B] font-mono-data uppercase tracking-wider">
              <span>1990</span>
              <div className="flex-grow mx-4 relative flex items-center">
                <input
                  type="range"
                  min={1990}
                  max={2024}
                  value={timelineYear}
                  onChange={(e) => setTimelineYear(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DDE3DA] rounded-lg appearance-none cursor-pointer accent-[#176B63] z-20"
                />
              </div>
              <span className="font-bold text-[#176B63]">{timelineYear}</span>
            </div>
          </div>
        </div>

        {/* Micro-Playground 2: Climate History & Temperature Shift (Span 5 cols) */}
        <div className="md:col-span-5 glass-panel rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-4 relative group hover:shadow-md transition-all duration-500">
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-5 h-5 text-[#B94A48] stroke-[1.5px]" />
                <h3 className="font-headline text-xl text-[#141E1A]">Temperature Shift</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#65716B]">
                Decadal variance in median surface temperatures.
              </p>
            </div>
            <span className="font-mono-data text-[10px] text-[#B94A48] bg-[#B94A48]/10 px-2 py-0.5 rounded border border-[#B94A48]/20">
              {hoveredDecade ? `Hovered: ${hoveredDecade}` : 'ERA5 GLOBAL'}
            </span>
          </div>

          <div className="flex-grow mt-4 flex flex-col justify-end gap-2 h-full min-h-[220px]">
            {/* Decadal Bars */}
            <div className="flex items-end justify-between h-44 gap-2.5 px-2 border-b border-[#DDE3DA] pb-2">
              {decadalData.map((item) => (
                <div
                  key={item.decade}
                  onMouseEnter={() => setHoveredDecade(`${item.decade} (${item.anomaly})`)}
                  onMouseLeave={() => setHoveredDecade(null)}
                  className={`w-full rounded-t-sm transition-all duration-300 relative group/bar cursor-pointer ${item.color}`}
                  style={{ height: `${item.heightPct}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-mono-data font-bold text-[#141E1A] opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded shadow-xs border border-[#DDE3DA] whitespace-nowrap z-20">
                    {item.anomaly}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between px-2 text-xs text-[#65716B] font-mono-data pt-1">
              <span>'80s</span>
              <span>'90s</span>
              <span>'00s</span>
              <span>'10s</span>
              <span className="font-bold text-[#141E1A]">'20s</span>
            </div>
          </div>
        </div>

        {/* Micro-Playground 3: Climate Assistant (Span 12 cols) */}
        <div className="md:col-span-12 glass-panel rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-stretch border border-[#176B63]/20 bg-gradient-to-br from-white via-white to-[#EBF6EF]/30 hover:shadow-md transition-all duration-500">
          {/* Left Context & Prompt Selection */}
          <div className="flex-1 max-w-lg flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#176B63]/10 text-[#176B63] font-mono-data text-xs uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesis Engine</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl text-[#141E1A] mb-3">
                Climate Assistant
              </h3>
              <p className="text-sm text-[#65716B] mb-6 leading-relaxed">
                Translate vast arrays of environmental telemetry into concise, actionable intelligence using our natural language synthesis models.
              </p>
            </div>

            {/* Prompt Chips */}
            <div>
              <span className="text-[11px] font-mono-data text-[#89938D] uppercase tracking-wider block mb-2">
                Select Analysis Scenario
              </span>
              <div className="flex flex-wrap gap-2" id="prompt-chips">
                <button
                  onClick={() =>
                    setActiveQuery(
                      'Assess drought vulnerability in the Punjab region over the next 6 months based on current moisture deficits.'
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    activeQuery.includes('Punjab')
                      ? 'bg-[#176B63] text-white border-[#176B63]'
                      : 'border-[#DDE3DA] text-[#65716B] bg-white hover:bg-[#EBF6EF]'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Rainfall & Drought</span>
                </button>

                <button
                  onClick={() =>
                    setActiveQuery('Analyze vegetation index changes in the Amazon basin for Q3 2023.')
                  }
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    activeQuery.includes('Amazon')
                      ? 'bg-[#176B63] text-white border-[#176B63]'
                      : 'border-[#DDE3DA] text-[#65716B] bg-white hover:bg-[#EBF6EF]'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-[#426748]" />
                  <span>Plant Health</span>
                </button>

                <button
                  onClick={() =>
                    setActiveQuery(
                      'Identify temperature anomalies exceeding +2.0°C in Northern Europe this week.'
                    )
                  }
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    activeQuery.includes('Europe')
                      ? 'bg-[#176B63] text-white border-[#176B63]'
                      : 'border-[#DDE3DA] text-[#65716B] bg-white hover:bg-[#EBF6EF]'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5 text-[#B94A48]" />
                  <span>Temperature Extremes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Chat UI Simulation */}
          <div className="flex-1 w-full bg-[#F5F6F2]/70 rounded-xl border border-[#DDE3DA] p-4 sm:p-5 shadow-inner relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            <div ref={chatScrollRef} className="flex flex-col gap-3 w-full relative z-10 flex-grow overflow-y-auto max-h-[280px]">
              {/* User Query Bubble */}
              <div className="flex justify-end mb-1 fade-in">
                <div className="bg-[#DFEBE4] text-[#141E1A] text-xs sm:text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-xs border border-[#DDE3DA]/50">
                  {activeQuery}
                </div>
              </div>

              {/* Tool Execution Steps Ticker */}
              {currentToolStep >= 0 && (
                <div className="flex flex-col gap-1.5 mb-2 ml-4 fade-in">
                  <div className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider flex items-center gap-2">
                    {currentToolStep < toolSteps.length ? (
                      <span className="w-2 h-2 rounded-full bg-[#176B63]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#426748]" />
                    )}
                    <span>
                      {currentToolStep < toolSteps.length
                        ? toolSteps[currentToolStep]
                        : 'Analysis complete.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Assistant Response Bubble */}
              {typedText && (
                <div className="flex items-start gap-2.5 mb-2 fade-in">
                  <div className="w-7 h-7 rounded-full bg-[#176B63] flex items-center justify-center shrink-0 shadow-xs mt-1 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white text-[#141E1A] text-xs sm:text-sm px-4 py-3.5 rounded-2xl rounded-tl-sm border border-[#DDE3DA] shadow-xs w-full max-w-[90%] space-y-2">
                    <p className="whitespace-pre-line text-[#65716B] leading-relaxed">
                      {typedText}
                    </p>

                    {/* KaTeX Mathematical Formula Card */}
                    {showFormula && (
                      <div
                        className="my-2 p-2.5 bg-[#F5F6F2] rounded-lg border border-[#DDE3DA] text-center font-mono-data overflow-x-auto text-xs fade-in"
                        dangerouslySetInnerHTML={{ __html: renderedFormulaHtml }}
                      />
                    )}

                    {/* Summary Conclusion */}
                    {showSummary && (
                      <p className="text-xs sm:text-sm text-[#141E1A] font-medium leading-relaxed fade-in block pt-1 border-t border-[#DDE3DA]/50">
                        {summaryConclusion}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Input Box in Chat Window */}
            <form onSubmit={handleCustomSubmit} className="relative mt-3 flex items-center gap-2 z-10">
              <input
                type="text"
                value={inputCustomText}
                onChange={(e) => setInputCustomText(e.target.value)}
                placeholder="Try asking your own scenario..."
                disabled={isSimulating}
                className="w-full bg-white text-xs text-[#141E1A] px-3 py-2 rounded-lg border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputCustomText.trim() || isSimulating}
                className="p-2 rounded-lg bg-[#176B63] hover:bg-[#00524B] disabled:bg-[#DDE3DA] text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>

            {/* Faded underlying background glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#176B63]/5 rounded-full blur-2xl pointer-events-none z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
