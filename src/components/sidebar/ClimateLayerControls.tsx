import React from 'react';
import { useClimateStore, computeRainfallBounds } from '../../stores/useClimateStore';
import { useMapStore } from '../../stores/useMapStore';
import {
  Thermometer,
  Flame,
  Snowflake,
  CloudRain,
  Droplets,
  Wind,
  Compass,
  Cloud,
  Gauge,
  Sun,
  CloudSnow,
  Layers,
  Waves,
  Calendar,
  Lock,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sparkles,
  RotateCw,
} from 'lucide-react';

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

const TEMPERATURE_VARS = new Set([
  'temperature_2m_mean',
  'temperature_2m_max',
  'temperature_2m_min',
]);

interface VariableOption {
  key: string;
  name: string;
  unit: string;
  icon: React.ElementType;
}

interface VariableCategory {
  category: string;
  items: VariableOption[];
}

const VARIABLE_GROUPS: VariableCategory[] = [
  {
    category: 'Temperature (ERA5-Land)',
    items: [
      { key: 'temperature_2m_mean', name: 'Mean Temperature', unit: '°C', icon: Thermometer },
      { key: 'temperature_2m_max', name: 'Maximum Temperature', unit: '°C', icon: Flame },
      { key: 'temperature_2m_min', name: 'Minimum Temperature', unit: '°C', icon: Snowflake },
    ],
  },
  {
    category: 'Precipitation & Moisture',
    items: [
      { key: 'precipitation_sum', name: 'Total Precipitation', unit: 'mm', icon: CloudRain },
      { key: 'relative_humidity_2m_mean', name: 'Relative Humidity', unit: '%', icon: Droplets },
      { key: 'soil_moisture_0_to_7cm_mean', name: 'Soil Moisture (0-7cm)', unit: 'm³/m³', icon: Layers },
    ],
  },
  {
    category: 'Wind & Cryosphere',
    items: [
      { key: 'wind_speed_10m_max', name: 'Maximum Wind Speed', unit: 'km/h', icon: Wind },
      { key: 'snow_depth_max', name: 'Snow Depth', unit: 'm', icon: Snowflake },
    ],
  },
];

export const ClimateLayerControls: React.FC = () => {
  const {
    selectedVariable,
    setSelectedVariable,
    aggregationMode,
    setAggregationMode,
    startDate,
    endDate,
    setDateRange,
    showRasterLayer,
    setShowRasterLayer,
    showPointGrid,
    setShowPointGrid,
    gridResult,
  } = useClimateStore();

  const { selectedRegion } = useMapStore();
  const isDisabled = !selectedRegion;
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const isTemperatureVariable = TEMPERATURE_VARS.has(selectedVariable);
  const isPrecipitationVariable = selectedVariable === 'precipitation_sum';

  const {
    rainfallScaleMode,
    setRainfallScaleMode,
    rainfallCustomMin,
    rainfallCustomMax,
    setRainfallCustomRange,
    applyRainfallScale,
    appliedRainfallBounds,
  } = useClimateStore();

  const [isApplyingScale, setIsApplyingScale] = React.useState(false);
  const [scaleAppliedNotice, setScaleAppliedNotice] = React.useState(false);

  const activeComputedRainfallBounds = React.useMemo(() => {
    return computeRainfallBounds(
      rainfallScaleMode,
      rainfallCustomMin,
      rainfallCustomMax,
      startDate,
      endDate,
      gridResult.points
    );
  }, [rainfallScaleMode, rainfallCustomMin, rainfallCustomMax, startDate, endDate, gridResult.points]);

  const handleApplyScale = async () => {
    setIsApplyingScale(true);
    await applyRainfallScale();
    setIsApplyingScale(false);
    setScaleAppliedNotice(true);
    setTimeout(() => setScaleAppliedNotice(false), 2500);
  };

  const isMultiDecadal = React.useMemo(() => {
    if (!startDate || !endDate) return false;
    const d1 = new Date(startDate).getTime();
    const d2 = new Date(endDate).getTime();
    const diffYears = Math.abs(d2 - d1) / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears >= 15;
  }, [startDate, endDate]);

  const handleReducerChange = (mode: 'mean' | 'max' | 'min') => {
    setAggregationMode(mode);
  };

  const selectedVariableObj = React.useMemo<VariableOption>(() => {
    for (const group of VARIABLE_GROUPS) {
      const match = group.items.find((it) => it.key === selectedVariable);
      if (match) return match;
    }
    return { key: selectedVariable, name: selectedVariable, unit: '', icon: Thermometer };
  }, [selectedVariable]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const SelectedIcon = selectedVariableObj.icon;

  return (
    <div className={`space-y-4 pt-2 border-t border-[#DDE3DA] transition-opacity duration-200 ${isDisabled ? 'opacity-40 pointer-events-none select-none' : 'opacity-100'}`}>
      {/* 15-Year Open-Meteo Fallback Notice Banner */}
      {gridResult.notice && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-mono-data text-amber-900 flex items-start gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{gridResult.notice}</span>
        </div>
      )}

      {/* Disabled Helper Prompt */}
      {isDisabled && (
        <div className="p-2.5 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] text-[11px] font-mono-data text-[#65716B] flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#89938D] shrink-0" />
          <span>Select a target location above to enable climate controls.</span>
        </div>
      )}

      {/* 1. Meteorological Variable Selector with Professional Lucide Icons */}
      <div className="relative" ref={dropdownRef}>
        <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
          <span>Weather Variable</span>
          <span className="text-[#557A5A] text-[10px] font-semibold">8 GEE Variables</span>
        </label>

        {/* Custom Professional Trigger Button */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F5F6F2] hover:bg-white border border-[#DDE3DA] hover:border-[#176B63]/50 rounded-xl transition-all shadow-xs cursor-pointer text-left text-xs font-medium text-[#17211D] group"
          id="btn-var-select"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#176B63]/10 border border-[#176B63]/20 flex items-center justify-center text-[#176B63] shrink-0">
              <SelectedIcon className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="font-semibold text-[#17211D]">{selectedVariableObj.name}</span>
              {selectedVariableObj.unit && (
                <span className="ml-1.5 text-[10px] font-mono-data text-[#65716B]">
                  ({selectedVariableObj.unit})
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#89938D] transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-[#176B63]' : ''
            }`}
          />
        </button>

        {/* Floating Custom Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-72 overflow-y-auto bg-white rounded-xl border border-[#DDE3DA] shadow-xl p-1.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
            {VARIABLE_GROUPS.map((grp) => (
              <div key={grp.category} className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-mono-data font-bold uppercase tracking-wider text-[#89938D] bg-[#F5F6F2]/60 rounded-md">
                  {grp.category}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedVariable === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setSelectedVariable(item.key);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#176B63]/10 text-[#176B63] font-semibold'
                          : 'text-[#65716B] hover:text-[#17211D] hover:bg-[#F5F6F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#176B63]' : 'text-[#89938D]'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                        <span className="text-[10px] font-mono-data text-[#89938D] shrink-0">
                          {item.unit}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#176B63] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1b. Statistic Reducer Toggle (Mean, Peak Extreme, Lowest Extreme) - Only for temperature variables */}
      {isTemperatureVariable && (
        <div className="p-2.5 rounded-xl bg-white border border-[#DDE3DA] space-y-2 animate-in fade-in duration-150">
          <label className="text-[11px] font-mono-data text-[#17211D] font-semibold uppercase tracking-wider block flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#176B63]" />
              Statistic Reducer
            </span>
            <span className="text-[#176B63] text-[10px] font-mono-data font-bold">
              {aggregationMode === 'mean' ? 'Average' : aggregationMode === 'max' ? 'Peak Max' : 'Lowest Min'}
            </span>
          </label>

          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA]">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => handleReducerChange('mean')}
              className={`py-1 px-1.5 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer text-center ${
                aggregationMode === 'mean'
                  ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Time-averaged baseline over the selected dates"
            >
              Average
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => handleReducerChange('max')}
              className={`py-1 px-1.5 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer text-center ${
                aggregationMode === 'max'
                  ? 'bg-white text-[#B9822B] shadow-xs border border-[#B9822B]/40'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Peak absolute maximum reached over the selected dates"
            >
              Peak Max
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => handleReducerChange('min')}
              className={`py-1 px-1.5 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer text-center ${
                aggregationMode === 'min'
                  ? 'bg-white text-[#4D8FA8] shadow-xs border border-[#4D8FA8]/40'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Lowest absolute minimum reached over the selected dates"
            >
              Lowest Min
            </button>
          </div>

          <p className="text-[10px] text-[#89938D] leading-tight">
            {aggregationMode === 'mean' && 'Computes average baseline over the selected time range.'}
            {aggregationMode === 'max' && 'Computes peak extreme heatwave values reached over the time range.'}
            {aggregationMode === 'min' && 'Computes lowest freezing/cold snap values reached over the time range.'}
          </p>
        </div>
      )}

      {/* 1c. Dedicated Rainfall Hybrid Scale Control - Only when Total Precipitation is selected */}
      {isPrecipitationVariable && (
        <div className="p-3 rounded-xl bg-white border border-[#DDE3DA] space-y-2.5 animate-in fade-in duration-150 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono-data text-[#17211D] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#176B63]" />
              <span>Rainfall Scale</span>
            </label>
            <span className="text-[10px] font-mono-data text-[#176B63] font-semibold bg-[#176B63]/10 px-2 py-0.5 rounded border border-[#176B63]/20">
              {rainfallScaleMode === 'auto' ? 'Automatic' : rainfallScaleMode === 'standard' ? 'Standard' : 'Custom'}
            </span>
          </div>

          {/* Scale Mode Selector Pills */}
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA]">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => setRainfallScaleMode('auto')}
              className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                rainfallScaleMode === 'auto'
                  ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Calculates range directly from displayed spatial data"
            >
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Auto</span>
              </div>
            </button>

            <button
              type="button"
              disabled={isDisabled}
              onClick={() => setRainfallScaleMode('standard')}
              className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                rainfallScaleMode === 'standard'
                  ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Predefined standard meteorological intervals for time window"
            >
              <div className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>Standard</span>
              </div>
            </button>

            <button
              type="button"
              disabled={isDisabled}
              onClick={() => setRainfallScaleMode('custom')}
              className={`py-1.5 px-1 rounded-md text-[10px] font-mono-data font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                rainfallScaleMode === 'custom'
                  ? 'bg-white text-[#176B63] shadow-xs border border-[#176B63]/30'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
              title="Specify custom min and max threshold limits"
            >
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Custom</span>
              </div>
            </button>
          </div>

          {/* Mode-Specific Details / Inputs */}
          {rainfallScaleMode === 'auto' && (
            <div className="p-2 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono-data">
                <span className="text-[#65716B]">Live Spatial Bounds:</span>
                <span className="font-bold text-[#176B63]">
                  {activeComputedRainfallBounds.label}
                </span>
              </div>
              <p className="text-[9.5px] text-[#89938D] leading-tight">
                Calibrates contrast dynamically to highlight relative rainfall peaks within the region.
              </p>
            </div>
          )}

          {rainfallScaleMode === 'standard' && (
            <div className="p-2 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono-data">
                <span className="text-[#65716B]">Time-Window Scale:</span>
                <span className="font-bold text-[#176B63]">
                  {activeComputedRainfallBounds.label}
                </span>
              </div>
              <p className="text-[9.5px] text-[#89938D] leading-tight">
                Standard meteorological threshold scale calibrated for cumulative precipitation.
              </p>
            </div>
          )}

          {rainfallScaleMode === 'custom' && (
            <div className="space-y-2 p-2.5 rounded-lg bg-[#F5F6F2] border border-[#DDE3DA]">
              <div className="grid grid-cols-2 gap-2 font-mono-data text-[10px]">
                <div>
                  <label className="text-[#65716B] block mb-1">Min (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="10"
                    value={rainfallCustomMin}
                    onChange={(e) => setRainfallCustomRange(parseFloat(e.target.value) || 0, rainfallCustomMax)}
                    className="w-full bg-white border border-[#DDE3DA] rounded-md px-2 py-1 text-xs text-[#17211D] focus:border-[#176B63] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#65716B] block mb-1">Max (mm)</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    step="50"
                    value={rainfallCustomMax}
                    onChange={(e) => setRainfallCustomRange(rainfallCustomMin, parseFloat(e.target.value) || 100)}
                    className="w-full bg-white border border-[#DDE3DA] rounded-md px-2 py-1 text-xs text-[#17211D] focus:border-[#176B63] focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[9.5px] text-[#89938D] leading-tight font-mono-data">
                Active span: {rainfallCustomMin} mm to {rainfallCustomMax} mm
              </p>
            </div>
          )}

          {/* Explicit Apply Button */}
          <button
            type="button"
            disabled={isDisabled || isApplyingScale}
            onClick={handleApplyScale}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono-data font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              scaleAppliedNotice
                ? 'bg-[#426748] text-white'
                : 'bg-[#176B63] hover:bg-[#00524B] text-white active:scale-[0.98]'
            }`}
          >
            {isApplyingScale ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Applying Scale to GEE Tiles...</span>
              </>
            ) : scaleAppliedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Scale Applied & Map Updated!</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Apply Scale to Map</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 2. Temporal Horizon Date Pickers */}
      <div>
        <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#176B63]" />
            Time Range
          </span>
          <span className="text-[#557A5A] text-[10px]">1-Yr Default</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] font-mono-data text-[#65716B] block mb-0.5">Start Date</span>
            <input
              type="date"
              disabled={isDisabled}
              value={startDate}
              min="1980-01-01"
              max="2026-12-31"
              onChange={(e) => setDateRange(e.target.value, endDate)}
              className="w-full bg-[#F5F6F2] text-xs font-mono-data text-[#17211D] px-2.5 py-1.5 rounded-lg border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] font-mono-data text-[#65716B] block mb-0.5">End Date</span>
            <input
              type="date"
              disabled={isDisabled}
              value={endDate}
              min="1980-01-01"
              max="2026-12-31"
              onChange={(e) => setDateRange(startDate, e.target.value)}
              className="w-full bg-[#F5F6F2] text-xs font-mono-data text-[#17211D] px-2.5 py-1.5 rounded-lg border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Display Toggles (Interpolated Raster & Point Grid) */}
      <div className="space-y-2 pt-2 border-t border-[#DDE3DA]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#65716B]">Color Heatmap Overlay</span>
          <button
            disabled={isDisabled}
            onClick={() => setShowRasterLayer(!showRasterLayer)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              showRasterLayer ? 'bg-[#176B63]' : 'bg-[#DDE3DA]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                showRasterLayer ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#65716B]">Weather Station Points</span>
          <button
            disabled={isDisabled}
            onClick={() => setShowPointGrid(!showPointGrid)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              showPointGrid ? 'bg-[#176B63]' : 'bg-[#DDE3DA]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                showPointGrid ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
