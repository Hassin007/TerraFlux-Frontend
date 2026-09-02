// ── TerraFlux Quick Metric Summary Telemetry Card ──────────────────────────

import React from 'react';
import { useMapStore } from '../../stores/useMapStore';
import { useClimateStore } from '../../stores/useClimateStore';
import { TrendingUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const QuickSummaryCard: React.FC = () => {
  const { activeRegion, boundaryStrategy, boundaryNotice, boundaryError } = useMapStore();
  const { gridResult } = useClimateStore();

  const { stats } = gridResult;

  return (
    <div className="p-3.5 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-3 font-mono-data text-xs select-none">
      <div className="flex items-center justify-between border-b border-[#DDE3DA] pb-2">
        <div className="flex items-center gap-1.5 text-[#17211D] font-bold truncate">
          <Activity className="w-4 h-4 text-[#176B63] shrink-0" />
          <span className="truncate">{activeRegion.short_name || activeRegion.display_name}</span>
        </div>
        {boundaryStrategy && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-[#176B63] font-semibold border border-[#DDE3DA] shrink-0 uppercase">
            {boundaryStrategy.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      {/* Boundary Resolution Notice / Warning */}
      {boundaryNotice && (
        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{boundaryNotice}</span>
        </div>
      )}

      {boundaryError && !boundaryNotice && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>{boundaryError}</span>
        </div>
      )}

      {/* Primary Key Trends */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-white border border-[#DDE3DA] shadow-xs">
          <span className="text-[10px] text-[#65716B] block">Warming Trend</span>
          <span className="text-sm font-bold text-[#B9822B] flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            +{stats.decadal_trend} °C/dec
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white border border-[#DDE3DA] shadow-xs">
          <span className="text-[10px] text-[#65716B] block">Change from Normal</span>
          <span className="text-sm font-bold text-[#176B63] mt-0.5 block">
            +{stats.baseline_diff} °C
          </span>
        </div>
      </div>

      {/* Grid Sample Metrics */}
      <div className="space-y-1.5 text-[11px] pt-1">
        <div className="flex justify-between text-[#65716B]">
          <span>Regional Average:</span>
          <span className="text-[#17211D] font-bold">
            {stats.mean} {gridResult.points[0]?.unit || '°C'}
          </span>
        </div>
        <div className="flex justify-between text-[#65716B]">
          <span>Observed Low / High:</span>
          <span className="text-[#17211D]">
            {stats.min} / {stats.max} {gridResult.points[0]?.unit || '°C'}
          </span>
        </div>
        <div className="flex justify-between text-[#65716B]">
          <span>Typical Range (10th–90th %):</span>
          <span className="text-[#17211D]">
            {stats.p10} – {stats.p90} {gridResult.points[0]?.unit || '°C'}
          </span>
        </div>
      </div>
    </div>
  );
};
