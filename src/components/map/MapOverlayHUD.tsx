// ── TerraFlux WebGIS Floating Overlay HUD ──────────────────────────────────

import React from 'react';
import { useMapStore } from '../../stores/useMapStore';
import { useClimateStore } from '../../stores/useClimateStore';
import {
  MapPin,
  Eye,
  Navigation,
} from 'lucide-react';

interface MapOverlayHUDProps {
  cursorCoords: { lat: number; lon: number } | null;
}

export const MapOverlayHUD: React.FC<MapOverlayHUDProps> = ({ cursorCoords }) => {
  const {
    activeRegion,
    adminLevel,
    basemapStyle,
    setBasemapStyle,
    camera,
    resetCamera,
    invertedMaskEnabled,
    toggleInvertedMask,
  } = useMapStore();

  const { gridResult, activeLayerMode, isTileLoading } = useClimateStore();

  return (
    <div className="pointer-events-none select-none">
      {/* Top Left: Regional Breadcrumbs & Admin Tier */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#DDE3DA] text-xs font-mono-data shadow-xs">
          <MapPin className="w-4 h-4 text-[#176B63]" />
          {activeRegion ? (
            <>
              <div className="flex items-center gap-1.5 text-[#17211D]">
                <span className="text-[#65716B]">{activeRegion.country}</span>
                <span className="text-[#89938D]">/</span>
                <span className="font-bold text-[#17211D]">{activeRegion.short_name}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#176B63]/10 text-[#176B63] font-bold text-[10px] border border-[#176B63]/20">
                ADM {adminLevel}
              </span>
            </>
          ) : (
            <span className="text-[#65716B] font-semibold">Global Overview</span>
          )}
        </div>

        {/* Inverted Mask Indicator Toggle */}
        <button
          onClick={toggleInvertedMask}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border text-xs font-mono-data transition-all cursor-pointer shadow-xs ${
            invertedMaskEnabled
              ? 'border-[#176B63] text-[#176B63] bg-[#176B63]/5 font-semibold'
              : 'border-[#DDE3DA] text-[#65716B] hover:text-[#17211D]'
          }`}
          title="Toggle Focus Dimming Mask"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{invertedMaskEnabled ? 'FOCUS: ON' : 'FOCUS: OFF'}</span>
        </button>
      </div>

      {/* Top Right: Basemap Selector & Compass Controls */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
        {/* Basemap Switcher */}
        <div className="flex bg-white/95 p-1 rounded-xl border border-[#DDE3DA] text-xs font-mono-data shadow-xs">
          {(
            [
              { key: 'light', label: 'Light' },
              { key: 'topo', label: 'Topographic' },
              { key: 'satellite', label: 'Satellite' },
            ] as const
          ).map((style) => (
            <button
              key={style.key}
              onClick={() => setBasemapStyle(style.key)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemapStyle === style.key
                  ? 'bg-[#176B63] text-white font-bold shadow-xs'
                  : 'text-[#65716B] hover:text-[#17211D]'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Compass Reset Button */}
        <button
          onClick={resetCamera}
          className="p-2 rounded-xl bg-white/95 border border-[#DDE3DA] text-[#65716B] hover:text-[#17211D] hover:bg-[#F5F6F2] transition-all shadow-xs cursor-pointer"
          title="Reset Map Orientation (North Up)"
        >
          <Navigation
            className="w-4 h-4 text-[#176B63] transition-transform"
            style={{ transform: `rotate(${-camera.bearing}deg)` }}
          />
        </button>
      </div>

      {/* Bottom Right HUD: Live Coordinates & Sampling Telemetry */}
      <div className="absolute bottom-6 right-36 z-20 pointer-events-auto hidden md:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#DDE3DA] text-xs font-mono-data text-[#65716B] shadow-xs">
        <div className="flex items-center gap-1.5 text-[#17211D]">
          <span className="text-[#557A5A]">LAT:</span>
          <span>{cursorCoords ? cursorCoords.lat.toFixed(3) : activeRegion ? activeRegion.lat.toFixed(3) : '0.000'}°N</span>
        </div>
        <div className="w-px h-3 bg-[#DDE3DA]" />
        <div className="flex items-center gap-1.5 text-[#17211D]">
          <span className="text-[#557A5A]">LON:</span>
          <span>{cursorCoords ? cursorCoords.lon.toFixed(3) : activeRegion ? activeRegion.lon.toFixed(3) : '0.000'}°E</span>
        </div>
        <div className="w-px h-3 bg-[#DDE3DA]" />
        <div className="text-[11px] font-medium flex items-center gap-1.5">
          {isTileLoading ? (
            <span className="text-[#B9822B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9822B] animate-ping" />
              GEE TILES...
            </span>
          ) : activeLayerMode === 'gee_tiles' ? (
            <span className="text-[#176B63] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#176B63]" />
              GEE TILES
            </span>
          ) : (
            <span className="text-[#4D8FA8] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4D8FA8]" />
              OPEN-METEO
            </span>
          )}
        </div>
      </div>

      {/* Bottom Right: Unobtrusive TerraFlux Brand Badge / Watermark */}
      <div className="absolute bottom-6 right-4 z-20 pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#DDE3DA]/80 shadow-xs text-xs font-mono-data">
        <img
          src="/TerraFlux logo.svg"
          alt="TerraFlux Logo"
          className="w-4 h-4 object-contain opacity-90"
        />
        <span className="font-bold text-[10px] tracking-wider text-[#00524B]">TERRAFLUX</span>
      </div>
    </div>
  );
};
