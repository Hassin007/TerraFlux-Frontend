// ── TerraFlux Global Command Palette (Ctrl+K) ──────────────────────────────

import React, { useState, useEffect } from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { useMapStore } from '../../stores/useMapStore';
import { useClimateStore } from '../../stores/useClimateStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { useAgentStore } from '../../stores/useAgentStore';
import { useAgentStream } from '../../hooks/useAgentStream';
import { searchRegions } from '../../api/geocodingApi';
import { WORLD_REGIONS } from '../../utils/geoData';
import { RegionCandidate, FigureTypeKey } from '../../types';
import {
  Search,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  BarChart2,
  Sparkles,
  Layers,
  X,
  CornerDownLeft,
  Mountain,
  Loader2,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isCmdkOpen, setCmdkOpen, setActiveView } = useViewStore();
  const { selectRegion } = useMapStore();
  const { setSelectedVariable } = useClimateStore();
  const { openStudio } = useStudioStore();
  const { openPopover } = useAgentStore();
  const { submitQuery } = useAgentStream();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [remoteRegions, setRemoteRegions] = useState<RegionCandidate[]>([]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(!isCmdkOpen);
      }
      if (e.key === 'Escape' && isCmdkOpen) {
        setCmdkOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdkOpen, setCmdkOpen]);

  // Live debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setRemoteRegions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const results = await searchRegions(query, abortController.signal);
        setRemoteRegions(results);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[cmdk] Search error:', err);
          const fallback = WORLD_REGIONS.filter(
            (r) =>
              r.display_name.toLowerCase().includes(query.toLowerCase()) ||
              r.country.toLowerCase().includes(query.toLowerCase())
          );
          setRemoteRegions(fallback);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  if (!isCmdkOpen) return null;

  const displayRegions = query.trim().length >= 2 ? remoteRegions : WORLD_REGIONS;

  const variables = [
    { key: 'temperature_2m_mean', label: 'Temperature Map (°C)', icon: Thermometer },
    { key: 'precipitation_sum', label: 'Rainfall & Total Rain (mm)', icon: CloudRain },
    { key: 'wind_speed_10m_max', label: 'Wind Speed (km/h)', icon: Wind },
    { key: 'surface_solar_radiation', label: 'Sunlight & Solar Energy (MJ/m²)', icon: Sun },
  ];

  const presets: { key: FigureTypeKey; label: string; desc: string }[] = [
    { key: 'copernicus_anomaly', label: 'Yearly Temperature Changes (1980–Today)', desc: 'Compare yearly heat to normal baseline' },
    { key: 'walter_lieth_climograph', label: 'Monthly Rain & Temperature Chart', desc: 'Rainfall totals paired with temperature curves' },
    { key: 'year_month_heatmap', label: 'Monthly Temperature Heatmap', desc: 'Grid of warm and cool months over time' },
    { key: 'ols_decadal_trend', label: 'Long-Term Warming Trend', desc: 'Average temperature rise per decade' },
  ];

  const copilotPrompts = [
    { text: 'Summer Heatwave & Temperature Changes in Sindh (2024)', icon: Thermometer },
    { text: 'Indus Basin Monsoon Rainfall & River Flow Trends', icon: CloudRain },
    { text: 'European Alps Mountain Snow & Seasonal Warming', icon: Mountain },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-[#17211D]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white border border-[#DDE3DA] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
        id="cmdk-dialog"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#DDE3DA] gap-3 bg-[#F5F6F2]/70">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-[#176B63] animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[#176B63]" />
          )}
          <input
            autoFocus
            type="text"
            placeholder="Search places, weather layers, charts, or ask Assistant..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#17211D] placeholder-[#89938D] focus:outline-none font-sans"
            id="cmdk-input"
          />
          <button
            onClick={() => setCmdkOpen(false)}
            className="p-1 rounded-md text-[#89938D] hover:text-[#17211D] hover:bg-[#DDE3DA]/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Results Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Regions Category */}
          {displayRegions.length > 0 && (
            <div>
              <p className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#176B63]" />
                Places & Boundary Areas
              </p>
              <div className="space-y-1">
                {displayRegions.map((region, idx) => (
                  <button
                    key={`${region.osm_id || region.short_name}_${idx}`}
                    onClick={() => {
                      selectRegion(region);
                      setActiveView('app');
                      setCmdkOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#17211D] hover:bg-[#176B63]/10 hover:border-[#176B63]/30 border border-transparent transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-6 h-6 rounded bg-[#F5F6F2] text-[10px] font-mono-data text-[#557A5A] flex items-center justify-center border border-[#DDE3DA] shrink-0">
                        {region.country_code_2 || 'GL'}
                      </span>
                      <div className="truncate">
                        <span className="font-semibold group-hover:text-[#176B63] transition-colors truncate">
                          {region.display_name}
                        </span>
                        <span className="text-[#89938D] ml-2 text-[11px]">
                          ADM {region.admin_level_hint}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-data text-[#89938D] group-hover:text-[#17211D] shrink-0 ml-2">
                      {region.lat.toFixed(1)}°, {region.lon.toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weather & Climate Layers */}
          <div>
            <p className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#557A5A]" />
              Weather & Climate Maps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {variables.map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.key}
                    onClick={() => {
                      setSelectedVariable(v.key);
                      setActiveView('app');
                      setCmdkOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#17211D] bg-[#F5F6F2] hover:bg-[#176B63]/10 hover:border-[#176B63]/30 border border-[#DDE3DA] transition-all text-left cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#176B63]" />
                    <span className="truncate">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Figure Studio Presets */}
          <div>
            <p className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#B9822B]" />
              Chart & Graph Types
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    openStudio({ figure_type: p.key });
                    setCmdkOpen(false);
                  }}
                  className="flex flex-col px-3 py-2 rounded-lg text-xs text-[#17211D] bg-[#F5F6F2] hover:bg-[#176B63]/10 hover:border-[#176B63]/30 border border-[#DDE3DA] transition-all text-left cursor-pointer"
                >
                  <span className="font-semibold text-[#17211D]">{p.label}</span>
                  <span className="text-[10px] text-[#65716B]">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Climate Assistant Prompts */}
          <div>
            <p className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#176B63]" />
              Ask Climate Assistant
            </p>
            <div className="space-y-1">
              {copilotPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      openPopover();
                      submitQuery(p.text);
                      setCmdkOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#17211D] bg-[#F5F6F2]/60 hover:bg-[#176B63]/10 border border-[#DDE3DA] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#176B63]" />
                      <span>{p.text}</span>
                    </div>
                    <span className="text-[10px] font-mono-data text-[#176B63] group-hover:underline flex items-center gap-1">
                      Ask Assistant <CornerDownLeft className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#F5F6F2] border-t border-[#DDE3DA] flex items-center justify-between text-[11px] text-[#65716B] font-mono-data">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-white text-[#17211D] border border-[#DDE3DA]">Esc</kbd> Close
            </span>
          </div>
          <span className="text-[#176B63]">TerraFlux WebGIS Explorer</span>
        </div>
      </div>
    </div>
  );
};
