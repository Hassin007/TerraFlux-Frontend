import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  Gauge,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WeatherForecastData, DailyForecastDay } from '../../types';

interface ForecastCardProps {
  forecast: WeatherForecastData;
}

// Map WMO icon keys to Lucide React components with high-contrast colors
function getWeatherIconComponent(iconKey: string, className: string = 'w-5 h-5') {
  switch (iconKey) {
    case 'sun':
      return <Sun className={`${className} text-amber-500`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-600`} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-500`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-600`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-cyan-600`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-blue-600`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-violet-600`} />;
    case 'cloud-snow':
      return <CloudSnow className={`${className} text-sky-500`} />;
    default:
      return <CloudSun className={`${className} text-amber-600`} />;
  }
}

// Format ISO date (e.g. "2026-09-07") to readable day name & date
function formatDayLabel(dateStr: string, index: number): { dayName: string; shortDate: string } {
  try {
    const d = new Date(dateStr + 'T12:00:00Z');
    if (index === 0) {
      return {
        dayName: 'Today',
        shortDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    }
    if (index === 1) {
      return {
        dayName: 'Tomorrow',
        shortDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    }
    return {
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
      shortDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
  } catch {
    return { dayName: dateStr, shortDate: '' };
  }
}

// Format hourly time (e.g. "2026-09-07T14:00") to "14:00"
function formatHourLabel(isoTimeStr: string): string {
  try {
    const parts = isoTimeStr.split('T');
    if (parts.length > 1) {
      return parts[1].slice(0, 5);
    }
    return isoTimeStr;
  } catch {
    return isoTimeStr;
  }
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const [showHourly, setShowHourly] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const cur = forecast.current;
  const daily = forecast.daily || [];
  const hourly = forecast.hourly || [];
  const alerts = forecast.alerts || [];

  const selectedDay: DailyForecastDay | undefined = daily[selectedDayIndex] || daily[0];
  const todayDaily: DailyForecastDay | undefined = daily[0];

  return (
    <div className="my-2.5 w-full rounded-2xl border border-[#DDE3DA] bg-white p-3.5 sm:p-4 shadow-xs text-[#17211D] transition-all">
      {/* ── 1. Header: Location & Geo Metadata ────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#DDE3DA]/80 pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B63]/10 text-[#176B63] border border-[#176B63]/20 shadow-2xs shrink-0">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold tracking-tight text-[#17211D] truncate">
                {forecast.region_name}
              </h3>
              {forecast.country_code && forecast.country_code !== 'WLD' && (
                <span className="rounded bg-[#F5F6F2] px-1.5 py-0.2 text-[9px] font-mono font-semibold text-[#65716B] border border-[#DDE3DA] uppercase shrink-0">
                  {forecast.country_code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#65716B] font-mono-data truncate">
              <span>
                {forecast.lat >= 0 ? `${forecast.lat.toFixed(2)}°N` : `${Math.abs(forecast.lat).toFixed(2)}°S`},{' '}
                {forecast.lon >= 0 ? `${forecast.lon.toFixed(2)}°E` : `${Math.abs(forecast.lon).toFixed(2)}°W`}
              </span>
              {forecast.elevation !== undefined && <span>• {forecast.elevation}m</span>}
              <span>• {forecast.timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Severe Weather Alerts (If any) ─────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="mt-2.5 space-y-1.5">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs leading-relaxed ${
                alert.severity === 'warning'
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 shrink-0 mt-0.5 ${
                  alert.severity === 'warning' ? 'text-red-600' : 'text-amber-600'
                }`}
              />
              <div className="min-w-0">
                <span className="font-bold">{alert.title}: </span>
                <span className="opacity-95">{alert.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Current Live Conditions Banner ─────────────────────────────────── */}
      {cur && (
        <div className="mt-2.5 rounded-xl border border-[#DDE3DA] bg-gradient-to-br from-[#F5F6F2] via-white to-[#EBF6EF]/40 p-3">
          {/* Top Row: Main Temperature, Feels-like & Today's Extrema */}
          <div className="flex items-center justify-between gap-3 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#DDE3DA] shadow-2xs shrink-0">
                {getWeatherIconComponent(cur.weather_icon, 'w-6 h-6')}
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17211D]">
                    {Math.round(cur.temperature_2m)}°C
                  </span>
                  <span className="text-[11px] text-[#65716B] font-medium">
                    Feels {Math.round(cur.apparent_temperature)}°C
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#176B63]">
                  {cur.weather_label}
                </div>
              </div>
            </div>

            {todayDaily && (
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#17211D]">
                  <span className="text-rose-600">H: {Math.round(todayDaily.temperature_2m_max)}°</span>{' '}
                  <span className="text-sky-600">L: {Math.round(todayDaily.temperature_2m_min)}°</span>
                </div>
                {todayDaily.precipitation_probability_max > 0 ? (
                  <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                    {todayDaily.precipitation_probability_max}% rain ({todayDaily.precipitation_sum}mm)
                  </div>
                ) : (
                  <div className="text-[10px] text-[#89938D] mt-0.5">No rain expected</div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row: 4 Metric Cards in Dedicated Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[#DDE3DA]/70">
            {/* Humidity */}
            <div className="flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 border border-[#DDE3DA] shadow-2xs min-w-0">
              <div className="h-6 w-6 rounded-md bg-cyan-50 flex items-center justify-center shrink-0">
                <Droplets className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[#65716B] leading-none truncate">Humidity</div>
                <div className="text-xs font-bold text-[#17211D] leading-tight mt-0.5 truncate">
                  {cur.relative_humidity_2m}%
                </div>
              </div>
            </div>

            {/* Wind */}
            <div className="flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 border border-[#DDE3DA] shadow-2xs min-w-0">
              <div className="h-6 w-6 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
                <Wind className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[#65716B] leading-none truncate">Wind</div>
                <div className="text-xs font-bold text-[#17211D] leading-tight mt-0.5 truncate">
                  {Math.round(cur.wind_speed_10m)} km/h
                </div>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 border border-[#DDE3DA] shadow-2xs min-w-0">
              <div className="h-6 w-6 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                <Gauge className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[#65716B] leading-none truncate">Pressure</div>
                <div className="text-xs font-bold text-[#17211D] leading-tight mt-0.5 truncate">
                  {Math.round(cur.surface_pressure)} hPa
                </div>
              </div>
            </div>

            {/* Cloud Cover */}
            <div className="flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 border border-[#DDE3DA] shadow-2xs min-w-0">
              <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <Cloud className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[#65716B] leading-none truncate">Cloud</div>
                <div className="text-xs font-bold text-[#17211D] leading-tight mt-0.5 truncate">
                  {cur.cloud_cover ?? 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. 7-Day Outlook Carousel / Ribbon ─────────────────────────────────── */}
      {daily.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between pb-1.5 text-xs font-bold text-[#17211D]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#176B63]" />
              <span>{daily.length}-Day Outlook</span>
            </div>
            {selectedDay && (
              <span className="text-[10px] font-mono-data text-[#65716B]">
                UV: {selectedDay.uv_index_max} | Rain: {selectedDay.precipitation_probability_max}%
              </span>
            )}
          </div>

          {/* Smooth Scrollable Daily Chips Ribbon */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300">
            {daily.map((day, idx) => {
              const { dayName, shortDate } = formatDayLabel(day.date, idx);
              const isSelected = selectedDayIndex === idx;

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center rounded-xl p-2 text-center transition-all cursor-pointer border min-w-[66px] flex-1 ${
                    isSelected
                      ? 'border-[#176B63] bg-[#EBF6EF] shadow-xs ring-1 ring-[#176B63]/30'
                      : 'border-[#DDE3DA] bg-white hover:bg-[#F5F6F2] hover:border-[#176B63]/40'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#17211D] leading-tight">{dayName}</span>
                  <span className="text-[9px] text-[#65716B] leading-tight">{shortDate}</span>

                  <div className="my-1.5 flex h-6 w-6 items-center justify-center">
                    {getWeatherIconComponent(day.weather_icon, 'w-5 h-5')}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <span className="text-[#17211D]">{Math.round(day.temperature_2m_max)}°</span>
                    <span className="text-[#65716B] text-[10px] font-normal">
                      {Math.round(day.temperature_2m_min)}°
                    </span>
                  </div>

                  {/* Precipitation badge */}
                  {day.precipitation_probability_max > 0 ? (
                    <div className="mt-1 flex items-center gap-0.5 rounded bg-blue-50 px-1 py-0.2 text-[9px] font-semibold text-blue-700 border border-blue-200/60">
                      <Droplets className="h-2.5 w-2.5" />
                      <span>{day.precipitation_probability_max}%</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-[9px] text-[#89938D]">0%</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Expandable 24-Hour Hourly Curve ─────────────────────────────────── */}
      {hourly.length > 0 && (
        <div className="mt-2.5 border-t border-[#DDE3DA] pt-2">
          <button
            onClick={() => setShowHourly(!showHourly)}
            className="flex w-full items-center justify-between rounded-lg px-1.5 py-1 text-xs font-semibold text-[#17211D] hover:bg-[#F5F6F2] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#176B63]" />
              <span>24-Hour Hourly Timeline</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#65716B]">
              <span>{showHourly ? 'Hide' : 'Show'}</span>
              {showHourly ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </div>
          </button>

          {showHourly && (
            <div className="mt-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-slate-300">
              <div className="flex gap-1.5 min-w-max">
                {hourly.slice(0, 24).map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl border border-[#DDE3DA] bg-white px-2 py-1.5 text-center text-xs min-w-[62px] shadow-2xs"
                  >
                    <span className="text-[10px] font-mono text-[#65716B]">
                      {formatHourLabel(h.time)}
                    </span>
                    <div className="my-1">
                      {getWeatherIconComponent(h.weather_icon, 'w-4 h-4')}
                    </div>
                    <span className="font-bold text-[#17211D] text-[11px]">
                      {Math.round(h.temperature_2m)}°C
                    </span>
                    {h.precipitation_probability > 0 ? (
                      <span className="mt-0.5 text-[9px] text-blue-600 font-semibold">
                        {h.precipitation_probability}%
                      </span>
                    ) : (
                      <span className="mt-0.5 text-[9px] text-[#89938D]">0%</span>
                    )}
                    <span className="mt-0.5 text-[9px] text-[#65716B]">
                      {Math.round(h.wind_speed_10m)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
