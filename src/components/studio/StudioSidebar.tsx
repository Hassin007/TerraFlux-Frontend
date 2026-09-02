// ── TerraFlux Scientific Studio Configuration Sidebar ─────────────────────

import React from 'react';
import { useStudioStore } from '../../stores/useStudioStore';
import { PresetSelectorGrid } from './PresetSelectorGrid';
import { RotateCw, Sliders, BarChart2, Calendar, Layers, Palette, AlertTriangle } from 'lucide-react';

export const VISUAL_TYPES = [
  { id: 'anomaly', name: 'Climate Anomaly (Copernicus / Baseline)' },
  { id: 'trend', name: 'Time-Series Climate Trend' },
  { id: 'climatology', name: 'Seasonal Climatology (Climograph)' },
  { id: 'precipitation', name: 'Monthly Precipitation Totals' },
  { id: 'distribution', name: 'Distribution & Extremes Analysis' },
  { id: 'heatmap', name: 'Year × Month Matrix Heatmap' },
];

export const GEE_PRIMARY_VARIABLES = [
  { id: 'temperature_2m_mean', label: 'Mean Temperature (°C)' },
  { id: 'temperature_2m_max', label: 'Max Temperature (°C)' },
  { id: 'temperature_2m_min', label: 'Min Temperature (°C)' },
  { id: 'precipitation_sum', label: 'Total Precipitation (mm)' },
  { id: 'wind_speed_10m_max', label: 'Wind Speed (km/h)' },
  { id: 'relative_humidity_2m_mean', label: 'Relative Humidity (%)' },
  { id: 'snow_depth_max', label: 'Snow Depth (m)' },
  { id: 'soil_moisture_0_to_7cm_mean', label: 'Soil Moisture (0-7cm) (m³/m³)' },
];

export const SECONDARY_VARIABLES = [
  { id: 'shortwave_radiation_sum', label: 'Solar Radiation (MJ/m²) [Max 15y]' },
  { id: 'et0_fao_evapotranspiration', label: 'Evapotranspiration (mm) [Max 15y]' },
  { id: 'wind_gusts_10m_max', label: 'Wind Gusts (km/h) [Max 15y]' },
  { id: 'cloud_cover_mean', label: 'Cloud Cover (%) [Max 15y]' },
  { id: 'pressure_msl_mean', label: 'Sea-Level Pressure (hPa) [Max 15y]' },
  { id: 'snowfall_sum', label: 'Total Snowfall (cm) [Max 15y]' },
];

export const BASELINE_PERIODS = [
  { id: '1991-2020', label: '1991–2020 (Current WMO Standard)' },
  { id: '1981-2010', label: '1981–2010 (Previous WMO Standard)' },
  { id: '1961-1990', label: '1961–1990 (Pre-Rapid Warming)' },
];

export const THEME_OPTIONS = [
  { id: 'publication_light', label: 'Publication Light (Journal)' },
  { id: 'presentation_light', label: 'Presentation Light (Vibrant)' },
  { id: 'dark_modern', label: 'Dark Modern' },
];

const GEE_COMMON_VARS = new Set([
  'temperature_2m_mean',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
  'relative_humidity_2m_mean',
  'snow_depth_max',
  'soil_moisture_0_to_7cm_mean',
]);

export const StudioSidebar: React.FC = () => {
  const {
    request,
    setFigureType,
    setVariable,
    setYearRange,
    setBaselinePeriod,
    setTheme,
    fetchPreview,
    isLoadingPreview,
  } = useStudioStore();

  const showBaseline = request.figure_type === 'anomaly' || request.figure_type === 'heatmap';
  const isMultiDecadal = (request.end_year - request.start_year) >= 15;
  const isUnsupportedMultiDecadal = isMultiDecadal && !GEE_COMMON_VARS.has(request.variable);

  return (
    <div className="w-full lg:w-80 h-full bg-[#F5F6F2] border-r border-[#DDE3DA] p-4 sm:p-5 overflow-y-auto space-y-4 text-xs select-none flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#DDE3DA] font-display font-bold text-sm text-[#17211D]">
          <Sliders className="w-4 h-4 text-[#176B63]" />
          <span>CHART SETTINGS</span>
        </div>

        {/* 1. Visual Type */}
        <div>
          <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-bold">
            <BarChart2 className="w-3.5 h-3.5 text-[#176B63]" />
            <span>Visual Type</span>
          </label>
          <select
            value={request.figure_type}
            onChange={(e) => setFigureType(e.target.value)}
            className="w-full bg-white text-xs font-semibold text-[#17211D] p-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
          >
            {VISUAL_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Climate Variable with GEE & Open-Meteo optgroups */}
        <div>
          <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-bold">
            <Layers className="w-3.5 h-3.5 text-[#176B63]" />
            <span>Climate Variable</span>
          </label>
          <select
            value={request.variable}
            onChange={(e) => setVariable(e.target.value)}
            className="w-full bg-white text-xs font-semibold text-[#17211D] p-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
          >
            <optgroup label="🛰️ Primary GEE Variables (Multi-Decadal 1950–Present)">
              {GEE_PRIMARY_VARIABLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="📊 Secondary Variables (Max 15 Years)">
              {SECONDARY_VARIABLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 3. Analysis Period */}
        <div>
          <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#176B63]" />
            <span>Analysis Period</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-mono-data text-[#65716B] block mb-0.5">From</span>
              <input
                type="number"
                min={1940}
                max={request.end_year - 1}
                value={request.start_year}
                onChange={(e) => setYearRange(Number(e.target.value), request.end_year)}
                className="w-full bg-white text-xs font-mono-data font-bold text-[#17211D] p-2 rounded-lg border border-[#DDE3DA] focus:border-[#176B63]"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono-data text-[#65716B] block mb-0.5">To</span>
              <input
                type="number"
                min={request.start_year + 1}
                max={2026}
                value={request.end_year}
                onChange={(e) => setYearRange(request.start_year, Number(e.target.value))}
                className="w-full bg-white text-xs font-mono-data font-bold text-[#17211D] p-2 rounded-lg border border-[#DDE3DA] focus:border-[#176B63]"
              />
            </div>
          </div>
        </div>

        {/* 4. Baseline Period (Climatology) - Dynamically shown for anomaly & heatmap */}
        {showBaseline && (
          <div className="animate-in fade-in duration-150">
            <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 font-bold">
              Baseline Period (Climatology)
            </label>
            <select
              value={request.baseline_period || '1991-2020'}
              onChange={(e) => setBaselinePeriod(e.target.value)}
              className="w-full bg-white text-xs font-semibold text-[#17211D] p-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
            >
              {BASELINE_PERIODS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 5. Preset Dimensions */}
        <PresetSelectorGrid />

        {/* 6. Theme / Palette */}
        <div>
          <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-bold">
            <Palette className="w-3.5 h-3.5 text-[#176B63]" />
            <span>Theme / Palette</span>
          </label>
          <select
            value={request.theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-white text-xs font-semibold text-[#17211D] p-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none cursor-pointer"
          >
            {THEME_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 15-Year Multi-Decadal Variable Limit Notice */}
        {isUnsupportedMultiDecadal && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-mono-data text-amber-900 flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              This variable supports up to 15 years maximum. For 15+ years analysis, please choose Temperature, Precipitation, Wind Speed, Relative Humidity, Snow Depth, or Soil Moisture.
            </span>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => fetchPreview()}
        disabled={isLoadingPreview || isUnsupportedMultiDecadal}
        className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#DDE3DA]/50 text-[#17211D] font-bold border border-[#DDE3DA] shadow-xs transition-all cursor-pointer disabled:opacity-50"
      >
        <RotateCw className={`w-3.5 h-3.5 text-[#176B63] ${isLoadingPreview ? 'animate-spin' : ''}`} />
        <span>Refresh Visual</span>
      </button>
    </div>
  );
};
