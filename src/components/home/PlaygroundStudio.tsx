// ── TerraFlux Micro-Playground 2: Weather & Climate Charts ───────────────────

import React from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { BarChart3 } from 'lucide-react';
import { FigureTypeKey } from '../../types';

export const PlaygroundStudio: React.FC = () => {
  const {
    homePlayground,
    setStudioDemoFigureType,
    setStudioDemoYear,
    setStudioDemoAspectPreset,
  } = useViewStore();

  const { figureType, selectedYear, aspectPreset } = homePlayground.studioDemo;

  // Generate 20 synthetic historical bars for the interactive slider
  const years = Array.from({ length: 21 }, (_, i) => 1986 + i * 2);
  const barsData = years.map((yr) => {
    const t = (yr - 1980) / (2026 - 1980);
    const baseAnomaly = -0.8 + t * 2.2;
    const noise = Math.sin(yr * 1.5) * 0.35;
    const anomaly = Number((baseAnomaly + noise).toFixed(2));
    const isHighlighted = yr <= selectedYear;
    return { year: yr, anomaly, isHighlighted };
  });

  return (
    <div className="p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Explanation & Interactive Controls */}
        <div className="w-full lg:w-1/2 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#557A5A]/10 border border-[#557A5A]/30 text-xs font-mono-data text-[#557A5A]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>PLAYGROUND 02</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#17211D]">
              Clear Charts & Long-Term Trend Visuals
            </h3>
            <p className="text-xs sm:text-sm text-[#65716B] mt-2 leading-relaxed">
              Create 10 clear, publication-grade chart types (Yearly Temperature Differences, Rain & Temperature climographs, Long-Term Warming Trends, and Monthly Heatmaps) ready to export in high-resolution PNG, vector SVG, and PDF.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Chart Type Tabs */}
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                1. Select Chart Type:
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#F5F6F2] p-1.5 rounded-xl border border-[#DDE3DA]">
                {[
                  { key: 'copernicus_anomaly', label: 'Yearly Changes' },
                  { key: 'walter_lieth_climograph', label: 'Rain & Temp' },
                  { key: 'year_month_heatmap', label: 'Month Heatmap' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setStudioDemoFigureType(item.key as FigureTypeKey)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      figureType === item.key
                        ? 'bg-[#176B63] text-white font-semibold shadow-xs'
                        : 'text-[#65716B] hover:text-[#17211D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Playable Decade Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-data mb-2">
                <span className="text-[#65716B]">2. Drag Year Slider:</span>
                <span className="text-[#176B63] font-bold text-sm">{selectedYear}</span>
              </div>
              <input
                type="range"
                min={1986}
                max={2026}
                step={2}
                value={selectedYear}
                onChange={(e) => setStudioDemoYear(Number(e.target.value))}
                className="w-full h-2 bg-[#DDE3DA] rounded-lg appearance-none cursor-pointer accent-[#176B63]"
              />
              <div className="flex justify-between text-[10px] font-mono-data text-[#89938D] mt-1">
                <span>1986 (Past Normal)</span>
                <span>2006 (Warming Shift)</span>
                <span>2026 (Record Heat)</span>
              </div>
            </div>

            {/* Aspect Ratio Presets */}
            <div>
              <label className="text-xs font-mono-data text-[#65716B] block mb-2">
                3. Page Layout Format:
              </label>
              <div className="flex gap-2">
                {(['16:9', 'A4', '1:1'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setStudioDemoAspectPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-data border transition-all cursor-pointer ${
                      aspectPreset === preset
                        ? 'bg-white border-[#176B63] text-[#176B63] font-bold shadow-xs'
                        : 'bg-[#F5F6F2] border-[#DDE3DA] text-[#65716B] hover:text-[#17211D]'
                    }`}
                  >
                    {preset} Format
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Tactile Bar Graph Animation Preview */}
        <div className="w-full lg:w-1/2 h-[340px] sm:h-[380px] bg-white rounded-xl border border-[#DDE3DA] p-5 relative flex flex-col justify-between select-none shadow-xs">
          {/* Header Title */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono-data">
              <span className="text-[#17211D] font-bold">Yearly Temperature Differences</span>
              <span className="text-[#65716B]">Baseline: 1991–2020 Normal</span>
            </div>
            <p className="text-[11px] text-[#557A5A] font-mono-data mt-0.5">
              Long-Term Warming Rate: <b>+0.31 °C / decade</b>
            </p>
          </div>

          {/* Dynamic Anomaly Bars */}
          <div className="relative h-44 flex items-center justify-between gap-1 sm:gap-1.5 px-2 border-b border-t border-[#DDE3DA] my-auto">
            {/* Zero Baseline reference line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-[#DDE3DA] border-dashed" />

            {barsData.map((bar) => {
              const isPositive = bar.anomaly >= 0;
              const heightPercent = Math.min(90, Math.abs(bar.anomaly) * 45);

              return (
                <div key={bar.year} className="flex-1 flex flex-col items-center h-full justify-center">
                  <div
                    className="w-full rounded-xs transition-all duration-300 relative group"
                    style={{
                      height: `${heightPercent}%`,
                      transform: isPositive ? 'translateY(-50%)' : 'translateY(50%)',
                      backgroundColor: !bar.isHighlighted
                        ? 'rgba(221, 227, 218, 0.7)'
                        : isPositive
                        ? '#B9822B'
                        : '#4D8FA8',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick Stats Metric Footer */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-data pt-2 border-t border-[#DDE3DA]">
            <div className="p-2 rounded bg-[#F5F6F2]">
              <span className="text-[10px] text-[#65716B] block">Normal Average</span>
              <span className="text-[#17211D] font-bold">24.6 °C</span>
            </div>
            <div className="p-2 rounded bg-[#F5F6F2]">
              <span className="text-[10px] text-[#65716B] block">Year Difference</span>
              <span className="text-[#B9822B] font-bold">
                {selectedYear >= 2015 ? '+1.84 °C' : selectedYear >= 2000 ? '+0.62 °C' : '-0.45 °C'}
              </span>
            </div>
            <div className="p-2 rounded bg-[#F5F6F2]">
              <span className="text-[10px] text-[#65716B] block">Resolution</span>
              <span className="text-[#176B63] font-bold">300 DPI Vector</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
