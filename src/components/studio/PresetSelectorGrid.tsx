// ── TerraFlux Scientific Studio Aspect Ratio Presets Grid ──────────────────

import React from 'react';
import { useStudioStore } from '../../stores/useStudioStore';

export const PRESET_OPTIONS = [
  { id: 'presentation_16_9', name: 'Presentation 16:9', ratio: '16:9' },
  { id: 'presentation_4_3', name: 'Presentation 4:3', ratio: '4:3' },
  { id: 'report_a4_landscape', name: 'Report A4 Land', ratio: '1.414:1' },
  { id: 'report_a4_portrait', name: 'Report A4 Port', ratio: '1:1.414' },
  { id: 'publication_double_col', name: 'Journal 2-Col', ratio: '1.8:1' },
  { id: 'publication_single_col', name: 'Journal 1-Col', ratio: '1.2:1' },
  { id: 'square_1_1', name: 'Square 1:1', ratio: '1:1' },
];

export const PresetSelectorGrid: React.FC = () => {
  const { request, setPreset } = useStudioStore();

  return (
    <div>
      <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 font-bold">
        Preset Dimensions & Ratio
      </label>
      <div className="grid grid-cols-2 gap-2" id="chart-presets">
        {PRESET_OPTIONS.map((p) => {
          const isSelected = request.preset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-mono-data border transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-[#176B63] border-[#176B63] text-white font-bold shadow-xs'
                  : 'bg-white border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] hover:border-[#176B63]/50'
              }`}
            >
              <div className="font-semibold text-xs leading-tight whitespace-normal break-words">
                {p.name}
              </div>
              <div
                className={`text-[10px] mt-0.5 font-mono-data ${
                  isSelected ? 'text-white/80' : 'text-[#89938D]'
                }`}
              >
                {p.ratio}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
