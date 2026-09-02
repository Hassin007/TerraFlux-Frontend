// ── TerraFlux Interactive Colormap Scale & Legend ─────────────────────────

import React, { useMemo } from 'react';
import { useClimateStore } from '../../stores/useClimateStore';
import { getVariableColormap, ColorStop } from '../../utils/colormaps';

export const MapLegendCard: React.FC = () => {
  const { selectedVariable, showRasterLayer, gridResult, appliedRainfallBounds } = useClimateStore();

  const colormap = useMemo(() => {
    if (selectedVariable === 'precipitation_sum' && appliedRainfallBounds) {
      return getVariableColormap(
        selectedVariable,
        appliedRainfallBounds.min,
        appliedRainfallBounds.max
      );
    }
    return getVariableColormap(selectedVariable);
  }, [selectedVariable, appliedRainfallBounds]);

  const stops = colormap.stops;
  const minVal = stops[0].value;
  const maxVal = stops[stops.length - 1].value;
  const range = maxVal - minVal || 1;

  // Build continuous CSS gradient stops
  const gradientCss = useMemo(() => {
    return stops
      .map((s) => {
        const pct = ((s.value - minVal) / range) * 100;
        return `${s.color} ${pct.toFixed(1)}%`;
      })
      .join(', ');
  }, [stops, minVal, range]);

  // Select spaced, non-overlapping tick stops (minimum 15% distance apart)
  const displayStops = useMemo(() => {
    const result: ColorStop[] = [];
    let lastPct = -100;

    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      const pct = ((s.value - minVal) / range) * 100;

      // Always include first and last; require >= 15% gap for intermediate ticks
      if (i === 0) {
        result.push(s);
        lastPct = pct;
      } else if (i === stops.length - 1) {
        // If last stop is too close to previous intermediate stop, remove previous
        if (pct - lastPct < 14 && result.length > 1) {
          result.pop();
        }
        result.push(s);
      } else if (pct - lastPct >= 15 && 100 - pct >= 14) {
        result.push(s);
        lastPct = pct;
      }
    }
    return result;
  }, [stops, minVal, range]);

  // Guard condition strictly AFTER all hooks are called
  if (!showRasterLayer || !gridResult.points || gridResult.points.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute bottom-6 left-6 z-20 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#DDE3DA] shadow-md min-w-[290px] max-w-sm text-xs font-mono-data select-none"
      id="map-legend-card"
    >
      {/* Header: Variable Name + Unit Pill */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[#0f172a] font-bold text-xs tracking-tight">{colormap.name}</span>
          {gridResult.aggregation_mode && gridResult.aggregation_mode !== 'mean' && (
            <span
              className={`text-[9px] font-mono-data font-bold px-1.5 py-0.2 rounded border ${
                gridResult.aggregation_mode === 'max'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-300'
              }`}
            >
              {gridResult.aggregation_mode === 'max' ? 'PEAK MAX' : 'LOWEST MIN'}
            </span>
          )}
        </div>
        <span className="text-[#176B63] font-bold text-[10px] bg-[#176B63]/10 px-2 py-0.5 rounded-md border border-[#176B63]/20 whitespace-nowrap">
          {colormap.unit}
        </span>
      </div>

      {/* Color Gradient Ramp Bar */}
      <div
        className="w-full h-3.5 rounded-full border border-black/10 shadow-inner"
        style={{
          background: `linear-gradient(to right, ${gradientCss})`,
        }}
      />

      {/* Non-Overlapping Breakpoint Tick Labels */}
      <div className="relative w-full h-4 mt-1.5 overflow-visible">
        {displayStops.map((s, idx) => {
          const pct = ((s.value - minVal) / range) * 100;
          const isFirst = idx === 0;
          const isLast = idx === displayStops.length - 1;

          return (
            <div
              key={idx}
              className={`absolute text-[10px] font-bold text-[#475569] whitespace-nowrap ${
                isFirst
                  ? 'left-0 text-left'
                  : isLast
                  ? 'right-0 text-right'
                  : '-translate-x-1/2 text-center'
              }`}
              style={!isFirst && !isLast ? { left: `${pct.toFixed(1)}%` } : undefined}
            >
              {s.label || s.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};
