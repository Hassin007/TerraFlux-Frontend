// ── TerraFlux Agent Brand Identity Badge ─────────────────────────────────────

import React from 'react';

export interface AgentLogoBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatusDot?: boolean;
  status?: 'online' | 'streaming' | 'cooldown' | 'expired' | 'idle';
  className?: string;
}

const SIZE_CONFIGS = {
  xs: {
    container: 'w-5 h-5 rounded-md p-0.5',
    img: 'w-3.5 h-3.5',
    dot: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5',
  },
  sm: {
    container: 'w-6 h-6 rounded-md p-1',
    img: 'w-4 h-4',
    dot: 'w-2 h-2 -bottom-0.5 -right-0.5',
  },
  md: {
    container: 'w-8 h-8 rounded-lg p-1.5',
    img: 'w-5 h-5',
    dot: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
  },
  lg: {
    container: 'w-10 h-10 rounded-xl p-2',
    img: 'w-6 h-6',
    dot: 'w-3 h-3 -bottom-0.5 -right-0.5',
  },
  xl: {
    container: 'w-12 h-12 rounded-2xl p-2.5',
    img: 'w-7 h-7',
    dot: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
  },
};

const STATUS_COLORS = {
  online: 'bg-[#557A5A]',
  streaming: 'bg-[#176B63] animate-pulse',
  cooldown: 'bg-[#B9822B]',
  expired: 'bg-rose-500',
  idle: 'bg-[#557A5A]',
};

export const AgentLogoBadge: React.FC<AgentLogoBadgeProps> = ({
  size = 'md',
  showStatusDot = false,
  status = 'online',
  className = '',
}) => {
  const config = SIZE_CONFIGS[size];

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`bg-[#00524B]/10 border border-[#00524B]/20 flex items-center justify-center shadow-xs transition-transform ${config.container} ${className}`}
      >
        <img
          src="/TerraFlux logo.svg"
          alt="TF"
          className={`${config.img} object-contain`}
        />
      </div>

      {showStatusDot && (
        <span
          className={`absolute rounded-full border-2 border-white shadow-xs ${
            config.dot
          } ${STATUS_COLORS[status] || STATUS_COLORS.online}`}
        />
      )}
    </div>
  );
};
