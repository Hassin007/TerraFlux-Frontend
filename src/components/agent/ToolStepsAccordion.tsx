import React, { useEffect, useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  MapPin,
  CloudRain,
  LineChart,
  Network,
  TrendingUp,
  Map,
  Activity,
} from 'lucide-react';
import { ToolExecutionStep } from '../../types';

interface ToolStepsAccordionProps {
  steps: ToolExecutionStep[];
  isLive?: boolean;
  defaultExpanded?: boolean;
}

// Map tool names to human-friendly action categories & tailored Lucide icons
const TOOL_ACTION_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string }
> = {
  resolve_region: {
    label: 'Geospatial Boundary',
    icon: MapPin,
    colorClass: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  },
  get_climate_stats: {
    label: 'Climate Observations',
    icon: CloudRain,
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  render_figure: {
    label: 'Scientific Visualization',
    icon: LineChart,
    colorClass: 'text-violet-700 bg-violet-50 border-violet-200',
  },
  list_child_regions: {
    label: 'Sub-Region Discovery',
    icon: Network,
    colorClass: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  compare_region_trends: {
    label: 'Trend Analysis',
    icon: TrendingUp,
    colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  },
  render_interactive_map: {
    label: 'Interactive 3D WebGIS',
    icon: Map,
    colorClass: 'text-teal-800 bg-teal-50 border-teal-200',
  },
};

export const ToolStepsAccordion: React.FC<ToolStepsAccordionProps> = ({
  steps,
  isLive = false,
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // Auto-expand when in-flight live streaming has active tool steps
  useEffect(() => {
    if (isLive && steps.length > 0) {
      setIsOpen(true);
    }
  }, [steps.length, isLive]);

  if (!steps || steps.length === 0) {
    return null;
  }

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const runningStep = steps.find((s) => s.status === 'running');

  return (
    <div className="rounded-xl border border-[#DDE3DA] bg-[#F8F9F6] overflow-hidden text-xs transition-all shadow-xs my-2">
      {/* Accordion Header (Styled consistent with Thinking Process banner) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#F1F3EE] hover:bg-[#EAECE6] text-[#2C3A33] font-medium transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#176B63]/10 flex items-center justify-center text-[#176B63]">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#17211D]">
            Execution Steps
          </span>

          {isLive && runningStep ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Step {completedCount + 1} of {steps.length} in progress...
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#DDE3DA]/60 text-[#65716B] text-[10px] font-mono">
              {steps.length} {steps.length === 1 ? 'Step' : 'Steps'} Completed
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

      {/* Accordion Body: Vertical Step Timeline */}
      {isOpen && (
        <div className="p-3.5 bg-white/80 border-t border-[#DDE3DA]/60 space-y-0">
          <div className="relative pl-1">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const isRunning = step.status === 'running';
              const meta = TOOL_ACTION_META[step.tool] || {
                label: 'Analysis Step',
                icon: Activity,
                colorClass: 'text-slate-700 bg-slate-50 border-slate-200',
              };
              const ActionIcon = meta.icon;

              return (
                <div key={step.id || `step_${idx}`} className="relative flex items-start gap-3 group">
                  {/* Vertical Connecting Stem Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[13px] top-[26px] bottom-[-6px] w-[2px] ${
                        step.status === 'completed' ? 'bg-emerald-500/40' : 'bg-[#DDE3DA]'
                      }`}
                    />
                  )}

                  {/* Numbered Checkmark Circle Node using Lucide CheckCircle2 */}
                  <div className="relative z-10 shrink-0 pt-0.5">
                    {isRunning ? (
                      <div className="relative flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center shadow-xs">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-700 text-white font-mono text-[8px] font-bold flex items-center justify-center shadow-xs border border-white">
                          {idx + 1}
                        </span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-600/15 stroke-[2.2] shrink-0" />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-700 text-white font-mono text-[8px] font-bold flex items-center justify-center shadow-xs border border-white">
                          {idx + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Step Information Card */}
                  <div
                    className={`flex-1 min-w-0 pb-4 ${
                      isLast ? 'pb-1' : ''
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-[#F5F6F2]/80 border border-[#DDE3DA]/80 hover:border-[#176B63]/30 transition-all space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${meta.colorClass}`}
                          >
                            <ActionIcon className="w-3 h-3 shrink-0" />
                            <span>{meta.label}</span>
                          </span>
                        </div>

                        {step.timestamp && (
                          <span className="text-[10px] font-mono text-[#89938D] shrink-0">
                            {new Date(step.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Dynamic Message Description */}
                      <p className="text-xs text-[#17211D] font-medium leading-relaxed">
                        {step.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
