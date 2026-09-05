// ── TerraFlux Scientific Figure Studio Export Toolbar ──────────────────────

import React, { useState } from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { exportFigure } from '../../api/figureApi';
import { Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export const ExportActionToolbar: React.FC = () => {
  const { request, setDpi, isExporting, setExporting } = useStudioStore();
  const [downloadSuccessName, setDownloadSuccessName] = useState<string | null>(null);

  const handleExport = async (format: 'png' | 'pdf' | 'svg') => {
    setExporting(true, `Exporting ${format.toUpperCase()}...`);

    try {
      const downloadedFilename = await exportFigure({
        ...request,
        format,
        dpi: request.dpi || 300,
      });

      setExporting(false, null);
      setDownloadSuccessName(downloadedFilename);
      setTimeout(() => setDownloadSuccessName(null), 4000);
    } catch (err: any) {
      console.error('[studio] Export error:', err);
      alert('Export failed: ' + (err?.message || 'Unknown error'));
      setExporting(false, null);
    }
  };

  const hasRegion = Boolean(request.region_name && request.region_name.trim());

  return (
    <div className="p-3.5 sm:p-4 bg-[#F5F6F2] border-t border-[#DDE3DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-data">
      {/* Export Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-[11px] font-bold text-[#65716B] uppercase tracking-wider hidden sm:inline">
          Export:
        </span>

        <button
          onClick={() => handleExport('png')}
          disabled={isExporting || !hasRegion}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#DDE3DA]/40 text-[#17211D] font-bold border border-[#DDE3DA] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#176B63]" />
          ) : (
            <Download className="w-3.5 h-3.5 text-[#176B63]" />
          )}
          <span>Download PNG</span>
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting || !hasRegion}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#176B63] hover:bg-[#135952] text-white font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-white" />
          )}
          <span>Download PDF (Publication)</span>
        </button>
      </div>

      {/* Resolution Selector */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label className="text-[11px] text-[#65716B] font-bold">Resolution:</label>
        <select
          value={request.dpi || 300}
          onChange={(e) => setDpi(Number(e.target.value))}
          className="bg-white text-xs font-mono-data font-bold text-[#17211D] px-2.5 py-1.5 rounded-lg border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
        >
          <option value={150}>150 DPI (Presentation)</option>
          <option value={300}>300 DPI (Publication)</option>
          <option value={600}>600 DPI (High-Res Print)</option>
        </select>
      </div>

      {/* Success Download Toast */}
      {downloadSuccessName && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B63] text-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="truncate max-w-xs text-xs font-semibold">Downloaded: {downloadSuccessName}</span>
        </div>
      )}
    </div>
  );
};
