// ── TerraFlux WebGIS MapLibre Viewport ──────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../stores/useMapStore';
import { useClimateStore } from '../../stores/useClimateStore';
import { MapOverlayHUD } from './MapOverlayHUD';
import { MapLegendCard } from './MapLegendCard';
import {
  getColorForValue,
  getVariableColormap,
  buildPolygonClippedRaster,
} from '../../utils/colormaps';
import { ClimateSamplePoint } from '../../types';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export const MapContainer: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [, setMapTick] = useState(0);
  const [hoveredPointInfo, setHoveredPointInfo] = useState<{
    point: ClimateSamplePoint;
    x: number;
    y: number;
  } | null>(null);

  const {
    activeRegion,
    basemapStyle,
    activeGeoJson,
    invertedMaskGeoJson,
    invertedMaskEnabled,
    targetFitBbox,
    clearTargetFitBbox,
    isLoadingBoundary,
    boundaryNotice,
    boundaryStrategy,
    camera,
    setCamera,
  } = useMapStore();

  const {
    selectedVariable,
    gridResult,
    showRasterLayer,
    showPointGrid,
    isLoadingClimate,
    activeLayerMode,
    geeTileUrl,
    isTileLoading,
  } = useClimateStore();

  const colormap = useMemo(() => getVariableColormap(selectedVariable), [selectedVariable]);
  const currentTileUrlRef = useRef<string | null>(null);

  // Bulletproof raster basemap style configurations with clean, watermark-free tile endpoints
  const getStyleObject = (style: 'light' | 'topo' | 'satellite' | 'dark'): maplibregl.StyleSpecification => {
    const glyphsUrl = 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';
    switch (style) {
      case 'satellite':
        return {
          version: 8,
          glyphs: glyphsUrl,
          sources: {
            satellite: {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite', minzoom: 0, maxzoom: 19 }],
        };
      case 'dark':
        return {
          version: 8,
          glyphs: glyphsUrl,
          sources: {
            'dark-base': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
            'dark-ref': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [
            { id: 'dark-base-layer', type: 'raster', source: 'dark-base', minzoom: 0, maxzoom: 19 },
            { id: 'dark-ref-layer', type: 'raster', source: 'dark-ref', minzoom: 0, maxzoom: 19 },
          ],
        };
      case 'topo':
        return {
          version: 8,
          glyphs: glyphsUrl,
          sources: {
            topo: {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [{ id: 'topo-layer', type: 'raster', source: 'topo', minzoom: 0, maxzoom: 19 }],
        };
      case 'light':
      default:
        return {
          version: 8,
          glyphs: glyphsUrl,
          sources: {
            'light-base': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
            'light-ref': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [
            { id: 'light-base-layer', type: 'raster', source: 'light-base', minzoom: 0, maxzoom: 19 },
            { id: 'light-ref-layer', type: 'raster', source: 'light-ref', minzoom: 0, maxzoom: 19 },
          ],
        };
    }
  };

  // Update Layers (Inverted Mask, GEE Raster Tiles, Canvas Fallback, Boundary Outlines)
  const updateMapLayers = useCallback(
    (map: maplibregl.Map) => {
      if (!map.isStyleLoaded()) return;

      try {
        // ── 1. Inverted Mask Source & Layer ─────────────────────────────────────
        if (map.getSource('inverted-mask-src')) {
          (map.getSource('inverted-mask-src') as maplibregl.GeoJSONSource).setData(
            invertedMaskGeoJson as any
          );
        } else {
          map.addSource('inverted-mask-src', {
            type: 'geojson',
            data: invertedMaskGeoJson as any,
          });

          map.addLayer({
            id: 'inverted-mask-layer',
            type: 'fill',
            source: 'inverted-mask-src',
            paint: {
              'fill-color': '#000000',
              'fill-opacity': invertedMaskEnabled ? 0.38 : 0,
            },
          });
        }

        if (map.getLayer('inverted-mask-layer')) {
          map.setPaintProperty(
            'inverted-mask-layer',
            'fill-opacity',
            invertedMaskEnabled ? 0.38 : 0
          );
        }

        // ── 2. Active Boundary Source & Outlines ────────────────────────────────
        if (map.getSource('region-boundary-src')) {
          (map.getSource('region-boundary-src') as maplibregl.GeoJSONSource).setData(
            activeGeoJson as any
          );
        } else {
          map.addSource('region-boundary-src', {
            type: 'geojson',
            data: activeGeoJson as any,
          });

          // Vibrant royal blue outer boundary glow
          map.addLayer({
            id: 'region-boundary-glow',
            type: 'line',
            source: 'region-boundary-src',
            paint: {
              'line-color': '#3b82f6',
              'line-width': 6,
              'line-opacity': 0.28,
              'line-blur': 3,
            },
          });

          // Sharp royal blue inner boundary outline
          map.addLayer({
            id: 'region-boundary-line',
            type: 'line',
            source: 'region-boundary-src',
            paint: {
              'line-color': '#1d4ed8',
              'line-width': 2.0,
              'line-opacity': 0.90,
            },
          });
        }

        // ── 3. Smart Dual-Mode Raster Rendering ────────────────────────────────
        // Place raster layers below inverted-mask-layer so the focus dimmer can shade out-of-boundary areas
        const beforeLayer = map.getLayer('inverted-mask-layer')
          ? 'inverted-mask-layer'
          : map.getLayer('region-boundary-glow')
          ? 'region-boundary-glow'
          : undefined;

        // Path A: GEE Dynamic Tiles Mode (Instant GPU Streaming <500ms)
        if (activeLayerMode === 'gee_tiles' && geeTileUrl) {
          // If tile URL changed or source doesn't exist, recreate cleanly
          if (currentTileUrlRef.current !== geeTileUrl || !map.getSource('gee-climate-tile-src')) {
            if (map.getLayer('gee-climate-tile-layer')) {
              map.removeLayer('gee-climate-tile-layer');
            }
            if (map.getSource('gee-climate-tile-src')) {
              map.removeSource('gee-climate-tile-src');
            }

            map.addSource('gee-climate-tile-src', {
              type: 'raster',
              tiles: [geeTileUrl],
              tileSize: 256,
              maxzoom: 10,
            });

            map.addLayer(
              {
                id: 'gee-climate-tile-layer',
                type: 'raster',
                source: 'gee-climate-tile-src',
                layout: {
                  visibility: showRasterLayer ? 'visible' : 'none',
                },
                paint: {
                  'raster-opacity': 0.85,
                  'raster-fade-duration': 300,
                },
              },
              beforeLayer
            );
            currentTileUrlRef.current = geeTileUrl;
          } else if (map.getLayer('gee-climate-tile-layer')) {
            map.setLayoutProperty(
              'gee-climate-tile-layer',
              'visibility',
              showRasterLayer ? 'visible' : 'none'
            );
          }

          // Clean up Canvas layer when GEE tile mode is active
          if (map.getLayer('climate-raster-layer')) {
            map.removeLayer('climate-raster-layer');
          }
          if (map.getSource('climate-raster-src')) {
            map.removeSource('climate-raster-src');
          }
          map.triggerRepaint();
        } else {
          // Clean up GEE tile layer when not in GEE tiles mode
          if (map.getLayer('gee-climate-tile-layer')) {
            map.removeLayer('gee-climate-tile-layer');
          }
          if (map.getSource('gee-climate-tile-src')) {
            map.removeSource('gee-climate-tile-src');
          }
          currentTileUrlRef.current = null;

          // Path B: Layer Sampling Canvas Fallback Mode (Open-Meteo IDW Interpolation)
          const hasPoints = gridResult.points && gridResult.points.length >= 2;
          const hasBoundary = activeGeoJson && activeGeoJson.features && activeGeoJson.features.length > 0;

          if (hasPoints && hasBoundary) {
            const raster = buildPolygonClippedRaster(
              gridResult.points,
              selectedVariable,
              activeGeoJson,
              720,
              0.85
            );

            if (raster) {
              const existingSrc = map.getSource('climate-raster-src') as maplibregl.ImageSource | undefined;
              if (existingSrc && typeof existingSrc.updateImage === 'function') {
                existingSrc.updateImage({
                  url: raster.dataUrl,
                  coordinates: raster.coordinates,
                });
                if (map.getLayer('climate-raster-layer')) {
                  map.setLayoutProperty(
                    'climate-raster-layer',
                    'visibility',
                    showRasterLayer ? 'visible' : 'none'
                  );
                }
                map.triggerRepaint();
              } else {
                if (map.getLayer('climate-raster-layer')) {
                  map.removeLayer('climate-raster-layer');
                }
                if (map.getSource('climate-raster-src')) {
                  map.removeSource('climate-raster-src');
                }

                map.addSource('climate-raster-src', {
                  type: 'image',
                  url: raster.dataUrl,
                  coordinates: raster.coordinates,
                });

                map.addLayer(
                  {
                    id: 'climate-raster-layer',
                    type: 'raster',
                    source: 'climate-raster-src',
                    layout: {
                      visibility: showRasterLayer ? 'visible' : 'none',
                    },
                    paint: {
                      'raster-opacity': 0.85,
                      'raster-fade-duration': 0,
                    },
                  },
                  beforeLayer
                );
                map.triggerRepaint();
              }
            }
          } else {
            if (map.getLayer('climate-raster-layer')) {
              map.removeLayer('climate-raster-layer');
            }
            if (map.getSource('climate-raster-src')) {
              map.removeSource('climate-raster-src');
            }
            map.triggerRepaint();
          }
        }
      } catch (err) {
        console.warn('[maplibre] Layer update warning:', err);
      }
    },
    [
      activeGeoJson,
      invertedMaskGeoJson,
      invertedMaskEnabled,
      activeLayerMode,
      geeTileUrl,
      gridResult,
      selectedVariable,
      showRasterLayer,
    ]
  );

  // Initialize MapLibre GL JS
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleObject(basemapStyle),
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.lngLat.lat, lon: e.lngLat.lng });
    });

    map.on('move', () => {
      const c = map.getCenter();
      setCamera({
        center: [c.lng, c.lat],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
      setMapTick((t) => (t + 1) % 10000);
    });

    map.on('render', () => {
      setMapTick((t) => (t + 1) % 10000);
    });

    map.on('load', () => {
      map.resize();
      updateMapLayers(map);
    });

    map.on('styledata', () => {
      updateMapLayers(map);
    });

    map.on('error', (err) => {
      console.warn('[maplibre] Map error:', err);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [basemapStyle]);

  // Trigger immediate layer updates when activeGeoJson, invertedMaskGeoJson, climate data or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      updateMapLayers(map);
    } else {
      map.once('styledata', () => updateMapLayers(map));
      map.once('load', () => updateMapLayers(map));
    }
  }, [
    activeGeoJson,
    invertedMaskGeoJson,
    gridResult,
    selectedVariable,
    showRasterLayer,
    showPointGrid,
    activeLayerMode,
    geeTileUrl,
    updateMapLayers,
  ]);

  // Fit camera bounds when targetFitBbox changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !targetFitBbox) return;

    try {
      const [minLon, minLat, maxLon, maxLat] = targetFitBbox;
      if (
        isFinite(minLon) &&
        isFinite(minLat) &&
        isFinite(maxLon) &&
        isFinite(maxLat) &&
        minLon < maxLon &&
        minLat < maxLat
      ) {
        map.fitBounds(
          [
            [minLon, minLat],
            [maxLon, maxLat],
          ],
          {
            padding: 50,
            duration: 1200,
            essential: true,
          }
        );
      }
    } catch (e) {
      console.warn('[map] fitBounds error:', e);
    } finally {
      clearTargetFitBbox();
    }
  }, [targetFitBbox, clearTargetFitBbox]);

  // Immediate toggle for Inverted Mask dimmer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && map.isStyleLoaded() && map.getLayer('inverted-mask-layer')) {
      map.setPaintProperty(
        'inverted-mask-layer',
        'fill-opacity',
        invertedMaskEnabled ? 0.38 : 0
      );
    }
  }, [invertedMaskEnabled]);

  // Immediate toggle for Color Heatmap Raster layer (both GEE Tiles and Canvas)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    let updated = false;
    if (map.getLayer('gee-climate-tile-layer')) {
      map.setLayoutProperty(
        'gee-climate-tile-layer',
        'visibility',
        showRasterLayer ? 'visible' : 'none'
      );
      updated = true;
    }
    if (map.getLayer('climate-raster-layer')) {
      map.setLayoutProperty(
        'climate-raster-layer',
        'visibility',
        showRasterLayer ? 'visible' : 'none'
      );
      updated = true;
    }

    if (updated) {
      map.triggerRepaint();
    } else if (showRasterLayer) {
      updateMapLayers(map);
    }
  }, [showRasterLayer, updateMapLayers]);

  return (
    <div className="relative w-full h-full bg-[#F5F6F2] overflow-hidden" id="webgis-viewport">
      {/* MapLibre GL Canvas Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Interactive Floating Pill Station Points Overlay */}
      {showPointGrid && gridResult.points && gridResult.points.length > 0 && mapInstanceRef.current && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {gridResult.points.map((pt) => {
            const map = mapInstanceRef.current;
            if (!map) return null;
            const screenPos = map.project([pt.lon, pt.lat]);
            const color = getColorForValue(pt.value, selectedVariable);

            const valStr = colormap.decimals === 0 ? `${Math.round(pt.value)}` : pt.value.toFixed(colormap.decimals);
            const unitStr = colormap.unit || pt.unit || '';
            const labelText = unitStr ? `${valStr} ${unitStr}` : valStr;

            // Approximate pill width based on text length
            const textWidth = Math.max(64, labelText.length * 7.5 + 20);

            return (
              <g
                key={pt.id}
                className="cursor-pointer pointer-events-auto group"
                transform={`translate(${screenPos.x}, ${screenPos.y})`}
                onMouseEnter={() => {
                  setHoveredPointInfo({ point: pt, x: screenPos.x, y: screenPos.y });
                }}
                onMouseLeave={() => setHoveredPointInfo(null)}
              >
                {/* Outer pulsing halo */}
                <circle
                  r={12}
                  fill={color}
                  fillOpacity={0.25}
                  className="transition-all duration-300 group-hover:scale-125"
                />
                {/* Core white dot with colored border */}
                <circle
                  r={3.5}
                  fill="#FFFFFF"
                  stroke={color}
                  strokeWidth={2}
                />
                {/* Floating pill badge displaying value and unit */}
                <g transform="translate(0, -18)" className="transition-transform group-hover:-translate-y-6">
                  {/* Drop shadow */}
                  <rect
                    x={-textWidth / 2}
                    y={-11}
                    width={textWidth}
                    height={22}
                    rx={11}
                    fill="#000000"
                    fillOpacity={0.15}
                    transform="translate(0, 2)"
                  />
                  {/* Pill background */}
                  <rect
                    x={-textWidth / 2}
                    y={-11}
                    width={textWidth}
                    height={22}
                    rx={11}
                    fill="#FFFFFF"
                    fillOpacity={0.94}
                    stroke="#2563eb"
                    strokeWidth={1.5}
                  />
                  {/* Badge Text */}
                  <text
                    x={0}
                    y={3.5}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="11"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="800"
                    letterSpacing="-0.2px"
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      )}

      {/* Loading Boundary or Climate Resolution Indicator */}
      {(isLoadingBoundary || isLoadingClimate) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#176B63]/30 shadow-md flex items-center gap-2 text-xs font-mono-data text-[#17211D] animate-in fade-in zoom-in-95 duration-150">
          <Loader2 className="w-3.5 h-3.5 text-[#176B63] animate-spin" />
          <span>
            {isLoadingBoundary ? 'Resolving boundary polygon...' : 'Sampling climate grid telemetry...'}
          </span>
        </div>
      )}

      {/* Active Boundary Strategy / Fallback Badge */}
      {!isLoadingBoundary && !isLoadingClimate && boundaryStrategy && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#DDE3DA] shadow-xs flex items-center gap-1.5 text-[10px] font-mono-data text-[#65716B]">
          <ShieldCheck className="w-3 h-3 text-[#176B63]" />
          <span>Resolved via {boundaryStrategy.replace(/_/g, ' ')}</span>
          {boundaryNotice && (
            <span className="text-amber-700 ml-1 font-semibold flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              Fallback
            </span>
          )}
        </div>
      )}

      {/* Hover Tooltip for Sampling Point */}
      {hoveredPointInfo && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-8 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#DDE3DA] shadow-xl text-xs font-sans space-y-1.5 animate-in fade-in zoom-in-95 duration-150 text-[#17211D] min-w-[210px]"
          style={{ left: hoveredPointInfo.x, top: hoveredPointInfo.y }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#DDE3DA]/60 pb-1.5">
            <span className="text-[#0f172a] font-bold text-xs">{hoveredPointInfo.point.place_name}</span>
            <span className="text-[10px] font-mono-data text-[#65716B]">
              {hoveredPointInfo.point.elevation_m}m elev
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-1 px-2 rounded-lg bg-blue-50/80 border border-blue-200/60">
            <span className="text-blue-800 font-semibold text-[11px]">{colormap.name}:</span>
            <span className="text-xs font-extrabold text-blue-900 font-mono-data">
              {hoveredPointInfo.point.value} {colormap.unit}
            </span>
          </div>
          {hoveredPointInfo.point.anomaly !== undefined && (
            <div className="flex items-center justify-between gap-4 text-[11px]">
              <span className="text-[#65716B]">Diff from Normal:</span>
              <span
                className={`font-semibold ${
                  hoveredPointInfo.point.anomaly >= 0 ? 'text-[#B9822B]' : 'text-[#4D8FA8]'
                }`}
              >
                {hoveredPointInfo.point.anomaly >= 0 ? '+' : ''}
                {hoveredPointInfo.point.anomaly} °C
              </span>
            </div>
          )}
          <div className="text-[10px] font-mono-data text-[#89938D] pt-0.5">
            {hoveredPointInfo.point.lat.toFixed(3)}°N, {hoveredPointInfo.point.lon.toFixed(3)}°E
          </div>
        </div>
      )}

      {/* Floating HUD controls */}
      <MapOverlayHUD cursorCoords={cursorCoords} />

      {/* Colormap Scale Legend */}
      <MapLegendCard />
    </div>
  );
};
