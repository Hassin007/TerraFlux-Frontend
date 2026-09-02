// ── TerraFlux Live Cooldown Timer Hook for HTTP 429 Rate Limiting ──────────

import { useState, useEffect } from 'react';
import { useAgentStore } from '../stores/useAgentStore';

export function useCooldownTimer() {
  const { cooldownRetryAt, uiLockState, setUiLockState, setCooldownRetryAt } = useAgentStore();
  const [formattedTime, setFormattedTime] = useState<string>('00:00:00');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    if (uiLockState !== 'cooldown' || !cooldownRetryAt) {
      setFormattedTime('00:00:00');
      setRemainingSeconds(0);
      return;
    }

    const calculateRemaining = () => {
      const targetTime = new Date(cooldownRetryAt).getTime();
      const now = Date.now();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setUiLockState('idle');
        setCooldownRetryAt(null);
        setFormattedTime('00:00:00');
        setRemainingSeconds(0);
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      const hh = hrs.toString().padStart(2, '0');
      const mm = mins.toString().padStart(2, '0');
      const ss = secs.toString().padStart(2, '0');

      setRemainingSeconds(totalSec);
      setFormattedTime(`${hh}:${mm}:${ss}`);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [cooldownRetryAt, uiLockState, setUiLockState, setCooldownRetryAt]);

  return {
    isCooldown: uiLockState === 'cooldown',
    formattedTime,
    remainingSeconds,
  };
}
