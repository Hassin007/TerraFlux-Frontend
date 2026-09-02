// ── TerraFlux Mode 2 Guardrail & System Message Alerts (FR-10) ─────────────

import React from 'react';
import { GuardrailType } from '../../types';
import { ShieldAlert, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface GuardrailProps {
  type?: GuardrailType;
  content: string;
}

export const GuardrailMessage: React.FC<GuardrailProps> = ({ type = 'blocked', content }) => {
  switch (type) {
    case 'blocked':
      return (
        <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono-data space-y-1 my-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>TOPIC GUARDRAIL TRIGGERED</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">{content}</p>
        </div>
      );

    case 'token_limit':
      return (
        <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-800 text-xs font-mono-data space-y-1 my-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <AlertTriangle className="w-4 h-4 text-slate-600" />
            <span>CONTEXT TOKEN LIMIT REACHED</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-800">{content}</p>
        </div>
      );

    case 'inactivity_expired':
      return (
        <div className="p-3.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-900 text-xs font-mono-data space-y-1 my-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold text-sky-800">
            <Clock className="w-4 h-4 text-sky-700" />
            <span>SESSION INACTIVITY TIMEOUT</span>
          </div>
          <p className="text-[11px] leading-relaxed text-sky-900">{content}</p>
        </div>
      );

    case 'error':
    default:
      return (
        <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs font-mono-data space-y-1 my-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <RefreshCw className="w-4 h-4 text-rose-700" />
            <span>SYSTEM PROCESSING ERROR</span>
          </div>
          <p className="text-[11px] leading-relaxed text-rose-900">{content}</p>
        </div>
      );
  }
};
