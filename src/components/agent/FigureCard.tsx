// ── TerraFlux Copilot Inline Figure Card with 404 Expiry Fallback (FR-11) ─

import React, { useState } from 'react';
import { FigureItem } from '../../types';
import { useAgentStore } from '../../stores/useAgentStore';
import { API_BASE } from '../../api/client';
import { BarChart3, Maximize2, AlertCircle } from 'lucide-react';

interface FigureCardProps {
  figure: FigureItem;
}

export const FigureCard: React.FC<FigureCardProps> = ({ figure }) => {
  const [hasError, setHasError] = useState(false);
  const { setLightboxFigure } = useAgentStore();

  const title = figure.title || `Chart for ${figure.region_name || 'Region'}`;
  const isRealUrl = figure.url && figure.url !== 'generated-chart-active';
  const imgUrl = isRealUrl
    ? figure.url.startsWith('http')
      ? figure.url
      : `${API_BASE}${figure.url.startsWith('/') ? '' : '/'}${figure.url}`
    : '';

  if (hasError) {
    return (
      <div className="my-3 p-4 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] flex items-center gap-3 text-xs font-mono-data text-[#65716B]">
        <AlertCircle className="w-5 h-5 text-[#B9822B] shrink-0" />
        <div>
          <p className="font-semibold text-[#17211D]">Chart Unavailable</p>
          <p className="text-[10px] mt-0.5">
            This generated visual could not be loaded or has expired (12-hour server TTL).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-xl bg-white border border-[#DDE3DA] overflow-hidden shadow-xs select-none">
      {/* Figure Card Header */}
      <div className="px-3.5 py-2.5 bg-[#F5F6F2] border-b border-[#DDE3DA] flex items-center justify-between text-xs font-mono-data">
        <div className="flex items-center gap-2 truncate">
          <BarChart3 className="w-4 h-4 text-[#176B63] shrink-0" />
          <span className="font-bold text-[#17211D] truncate">{title}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#557A5A] border border-[#DDE3DA] shrink-0 uppercase">
          {figure.format || 'PNG'}
        </span>
      </div>

      {/* Visual Representation */}
      <div
        onClick={() => setLightboxFigure(figure)}
        className="relative h-48 bg-[#FBFBFA] flex items-center justify-center p-2 cursor-pointer group overflow-hidden border-b border-[#DDE3DA]"
      >
        {isRealUrl ? (
          <img
            src={imgUrl}
            alt={title}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          />
        ) : (
          <svg className="w-full h-full" viewBox="0 0 400 180">
            <line x1="20" y1="90" x2="380" y2="90" stroke="#DDE3DA" strokeDasharray="3 3" />
            <path
              d="M 30 130 Q 120 70 200 110 T 370 40"
              fill="none"
              stroke="#176B63"
              strokeWidth="3"
            />
            <rect x="50" y="90" width="14" height="35" fill="#4D8FA8" rx="2" />
            <rect x="90" y="90" width="14" height="20" fill="#4D8FA8" rx="2" />
            <rect x="130" y="65" width="14" height="25" fill="#557A5A" rx="2" />
            <rect x="170" y="55" width="14" height="35" fill="#557A5A" rx="2" />
            <rect x="210" y="45" width="14" height="45" fill="#B9822B" rx="2" />
            <rect x="250" y="35" width="14" height="55" fill="#B9822B" rx="2" />
            <rect x="290" y="25" width="14" height="65" fill="#B9822B" rx="2" />
            <rect x="330" y="15" width="14" height="75" fill="#B94A48" rx="2" />
          </svg>
        )}

        {/* Hover zoom overlay */}
        <div className="absolute inset-0 bg-[#17211D]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity text-xs font-mono-data text-white">
          <Maximize2 className="w-4 h-4 text-white" />
          <span>Click to Inspect Full-Res</span>
        </div>
      </div>

      {/* Metadata Footers */}
      {figure.metadata && (
        <div className="p-2.5 bg-white flex items-center justify-between text-[10px] font-mono-data text-[#65716B]">
          {figure.metadata.trend && <span>Trend: {figure.metadata.trend}</span>}
          {figure.metadata.peak_anomaly && (
            <span className="text-[#176B63] font-semibold">
              Peak: {figure.metadata.peak_anomaly}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
