// ── TerraFlux Full-Resolution Figure Lightbox Modal ────────────────────────

import React, { useState, useEffect } from 'react';
import { useAgentStore } from '../../stores/useAgentStore';
import { API_BASE } from '../../api/client';
import { X, Download, AlertCircle, Loader2 } from 'lucide-react';

export const FigureLightbox: React.FC = () => {
  const { lightboxFigure, setLightboxFigure } = useAgentStore();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading and error states when a new figure is selected
  useEffect(() => {
    if (lightboxFigure) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [lightboxFigure?.url]);

  if (!lightboxFigure) return null;

  const title = lightboxFigure.title || `Diagnostic Chart: ${lightboxFigure.region_name || 'Region'}`;
  const isRealUrl = Boolean(lightboxFigure.url && lightboxFigure.url !== 'generated-chart-active');
  const imgUrl = isRealUrl
    ? (lightboxFigure.url || '').startsWith('http')
      ? lightboxFigure.url || ''
      : `${API_BASE}${(lightboxFigure.url || '').startsWith('/') ? '' : '/'}${lightboxFigure.url}`
    : '';

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!isRealUrl || hasError || !imgUrl || isDownloading) return;
    setIsDownloading(true);

    try {
      const res = await fetch(imgUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const ext = lightboxFigure.format || 'png';
      const cleanRegion = (lightboxFigure.region_name || 'Region').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `TerraFlux_${cleanRegion}_${lightboxFigure.figure_type || 'figure'}.${ext}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('[Lightbox] Download error:', err);
      // Fallback
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `TerraFlux_${(lightboxFigure.region_name || 'Region').replace(/[^a-zA-Z0-9]/g, '_')}.${lightboxFigure.format || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#17211D]/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white border border-[#DDE3DA] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Lightbox Header */}
        <div className="px-5 py-3.5 bg-[#F5F6F2] border-b border-[#DDE3DA] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#141E1A] truncate">
            <span className="font-bold truncate">{title}</span>
            {lightboxFigure.region_name && (
              <span className="text-[#65716B] shrink-0">[{lightboxFigure.region_name}]</span>
            )}
          </div>
          <button
            onClick={() => setLightboxFigure(null)}
            className="p-1.5 rounded-lg text-[#65716B] hover:text-[#141E1A] hover:bg-[#DDE3DA]/50 transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full-res Visual Body */}
        <div className="p-6 bg-[#FBFBFA] flex-1 flex items-center justify-center overflow-auto min-h-[350px] relative">
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-[#B9822B]/10 border border-[#B9822B]/20 flex items-center justify-center mb-4 text-[#B9822B]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-mono-data text-[#17211D]">Chart Unavailable or Expired</h4>
              <p className="text-xs text-[#65716B] mt-1.5 leading-relaxed">
                This generated visual could not be loaded from the server or has expired (12-hour server TTL).
              </p>
              <button
                onClick={() => setLightboxFigure(null)}
                className="mt-5 px-4 py-2 rounded-lg bg-[#DDE3DA]/60 hover:bg-[#DDE3DA] text-xs font-mono-data text-[#17211D] font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          ) : isRealUrl ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FBFBFA] gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#176B63]" />
                  <span className="text-xs font-mono-data text-[#65716B]">Loading high-resolution figure...</span>
                </div>
              )}
              <img
                src={imgUrl}
                alt={title}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className={`max-w-full max-h-[60vh] object-contain rounded-lg border border-[#DDE3DA] shadow-xs transition-opacity duration-200 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </>
          ) : (
            <svg className="w-full max-w-2xl h-80" viewBox="0 0 600 300">
              <rect width="600" height="300" fill="#FFFFFF" stroke="#DDE3DA" strokeWidth="1" rx="8" />
              <text x="30" y="40" fill="#141E1A" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
                {title}
              </text>
              <text x="30" y="65" fill="#65716B" fontSize="12" fontFamily="monospace">
                High-Precision Climate Diagnostics | 300 DPI Export Ready
              </text>
              <line x1="30" y1="240" x2="570" y2="240" stroke="#DDE3DA" strokeWidth="1" />
              <line x1="30" y1="160" x2="570" y2="160" stroke="#DDE3DA" strokeDasharray="3 3" />
              <path
                d="M 50 210 Q 180 120 300 170 T 550 80"
                fill="none"
                stroke="#176B63"
                strokeWidth="4"
              />
              <rect x="70" y="160" width="20" height="40" fill="#4D8FA8" rx="3" />
              <rect x="130" y="160" width="20" height="25" fill="#4D8FA8" rx="3" />
              <rect x="190" y="125" width="20" height="35" fill="#557A5A" rx="3" />
              <rect x="250" y="110" width="20" height="50" fill="#557A5A" rx="3" />
              <rect x="310" y="90" width="20" height="70" fill="#B9822B" rx="3" />
              <rect x="370" y="70" width="20" height="90" fill="#B9822B" rx="3" />
              <rect x="430" y="55" width="20" height="105" fill="#B94A48" rx="3" />
              <rect x="490" y="40" width="20" height="120" fill="#B94A48" rx="3" />
            </svg>
          )}
        </div>

        {/* Footer info & download */}
        <div className="px-5 py-3 bg-[#F5F6F2] border-t border-[#DDE3DA] flex items-center justify-between text-xs font-mono-data">
          <span className="text-[#65716B]">Publication-Grade Climate Figure</span>
          <button
            onClick={handleDownload}
            disabled={!isRealUrl || hasError || isDownloading}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-xs ${
              !isRealUrl || hasError || isDownloading
                ? 'bg-[#DDE3DA] text-[#65716B] cursor-not-allowed opacity-60'
                : 'bg-[#176B63] hover:bg-[#135952] text-white cursor-pointer'
            }`}
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Downloading...' : 'Download High-Res'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
