// ── TerraFlux Sidebar Location Search Autocomplete ─────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { useMapStore } from '../../stores/useMapStore';
import { searchRegions } from '../../api/geocodingApi';
import { WORLD_REGIONS } from '../../utils/geoData';
import { RegionCandidate } from '../../types';
import { Search, MapPin, X, Loader2, Globe, CheckCircle2 } from 'lucide-react';

export const LocationSearchInput: React.FC = () => {
  const { selectedRegion, selectRegion, clearSelectedRegion, isLoadingBoundary } = useMapStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [remoteResults, setRemoteResults] = useState<RegionCandidate[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setRemoteResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const results = await searchRegions(query, abortController.signal);
        setRemoteResults(results);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[geocoding] Search error:', err);
          const localFiltered = WORLD_REGIONS.filter(
            (r) =>
              r.display_name.toLowerCase().includes(query.toLowerCase()) ||
              r.country.toLowerCase().includes(query.toLowerCase()) ||
              r.short_name.toLowerCase().includes(query.toLowerCase())
          );
          setRemoteResults(localFiltered);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (region: RegionCandidate) => {
    setQuery('');
    setIsOpen(false);
    selectRegion(region);
  };

  const displayList = query.trim().length >= 2 ? remoteResults : WORLD_REGIONS;

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="text-[11px] font-mono-data text-[#65716B] uppercase tracking-wider block mb-1 flex items-center justify-between">
        <span>Target Location</span>
        <span className="text-[#176B63] text-[10px] flex items-center gap-1 font-semibold">
          {isLoadingBoundary ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[#176B63]" />
              Resolving...
            </>
          ) : (
            <>
              <Globe className="w-3 h-3" />
              Live Geocoding
            </>
          )}
        </span>
      </label>

      {/* Selected Location Card */}
      {selectedRegion ? (
        <div className="p-3 bg-[#176B63]/5 border border-[#176B63]/30 rounded-xl relative flex items-center justify-between group transition-all">
          <div className="flex items-center gap-2.5 min-w-0 pr-6">
            <div className="w-7 h-7 rounded-lg bg-[#176B63]/10 border border-[#176B63]/25 flex items-center justify-center text-[#176B63] shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#17211D] truncate">
                  {selectedRegion.short_name || selectedRegion.display_name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#176B63] shrink-0" />
              </div>
              <p className="text-[10px] font-mono-data text-[#65716B] truncate">
                {selectedRegion.country} • ADM{selectedRegion.admin_level_hint} • {selectedRegion.lat.toFixed(2)}°N, {selectedRegion.lon.toFixed(2)}°E
              </p>
            </div>
          </div>

          <button
            onClick={clearSelectedRegion}
            className="p-1 rounded-lg text-[#89938D] hover:text-[#B94A48] hover:bg-white transition-colors cursor-pointer shrink-0"
            title="Clear selected location"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Search Input Box */
        <div className="relative flex items-center">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-[#176B63] animate-spin absolute left-3 pointer-events-none" />
          ) : (
            <Search className="w-4 h-4 text-[#176B63] absolute left-3 pointer-events-none" />
          )}

          <input
            type="text"
            placeholder="Search country, province, or city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-[#F5F6F2] text-xs text-[#17211D] pl-9 pr-8 py-2.5 rounded-xl border border-[#DDE3DA] focus:border-[#176B63] focus:outline-none transition-colors font-sans"
            id="location-search-field"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 text-[#89938D] hover:text-[#17211D] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Autocomplete Dropdown Stream */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#DDE3DA] rounded-xl shadow-lg z-40 max-h-64 overflow-y-auto p-1 space-y-1">
          {isSearching && displayList.length === 0 ? (
            <div className="p-3 text-center text-xs text-[#65716B] flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#176B63]" />
              <span>Querying global boundaries...</span>
            </div>
          ) : displayList.length === 0 ? (
            <div className="p-3 text-center text-xs text-[#65716B]">
              No regions matching "{query}"
            </div>
          ) : (
            displayList.map((r, idx) => (
              <button
                key={`${r.osm_id || r.short_name}_${idx}`}
                onClick={() => handleSelect(r)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  selectedRegion?.osm_id === r.osm_id && r.osm_id
                    ? 'bg-[#176B63]/10 text-[#176B63] font-semibold border border-[#176B63]/20'
                    : 'text-[#65716B] hover:text-[#17211D] hover:bg-[#F5F6F2]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#176B63] shrink-0" />
                  <span className="truncate">{r.display_name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {r.country_code_2 && (
                    <span className="px-1 py-0.5 rounded bg-[#F5F6F2] border border-[#DDE3DA] text-[9px] font-mono-data text-[#557A5A]">
                      {r.country_code_2}
                    </span>
                  )}
                  <span className="text-[10px] font-mono-data text-[#557A5A]">
                    ADM {r.admin_level_hint}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
