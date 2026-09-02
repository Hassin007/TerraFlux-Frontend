// ── TerraFlux Mode 2 HTTP 429 Cooldown Banner (FR-12) ──────────────────────

import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { useCooldownTimer } from '../../hooks/useCooldownTimer';
import { Clock, AlertOctagon } from 'lucide-react';

export const CooldownBanner: React.FC = () => {
  const { cooldownRetryAt } = useAgentStore();
  const { remainingSeconds, formattedTime, isCooldown } = useCooldownTimer();

  if (!isCooldown || !cooldownRetryAt) return null;

  return (
    <div className="p-4 bg-[#12161A] border-t border-amber-500/30 text-xs font-mono-data space-y-2 select-none shrink-0">
      <div className="flex items-center justify-between text-amber-400">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span className="font-bold tracking-wide">
            RATE LIMIT COOLDOWN (GLOBAL IP)
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      <p className="text-[11px] text-[#8C9BAE] leading-relaxed">
        Computational quota reached. System cooling down to preserve ERA5 reanalysis pipeline bandwidth.
      </p>
    </div>
  );
};
