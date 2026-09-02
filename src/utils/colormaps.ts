// ── TerraFlux Environmental Colormaps & Spatial Raster Generator ────────────

export interface ColorStop {
  value: number;
  color: string;
  label?: string;
}

export interface ColormapDefinition {
  name: string;
  variable: string;
  unit: string;
  decimals: number;
  stops: ColorStop[];
}

export const SCIENTIFIC_COLORMAPS: Record<string, ColormapDefinition> = {
  temperature_2m_mean: {
    name: 'Mean Temperature',
    variable: 'temperature_2m_mean',
    unit: '°C',
    decimals: 0,
    stops: [
      { value: -10, color: '#312e81', label: '-10°' },
      { value: -2, color: '#3b82f6', label: '-2°' },
      { value: 5, color: '#06b6d4', label: '5°' },
      { value: 12, color: '#10b981', label: '12°' },
      { value: 18, color: '#84cc16', label: '18°' },
      { value: 24, color: '#eab308', label: '24°' },
      { value: 29, color: '#f97316', label: '29°' },
      { value: 34, color: '#ef4444', label: '34°' },
      { value: 39, color: '#b91c1c', label: '39°' },
      { value: 45, color: '#6b0000', label: '45°+' },
    ],
  },
  temperature_2m_max: {
    name: 'Max Temperature',
    variable: 'temperature_2m_max',
    unit: '°C',
    decimals: 0,
    stops: [
      { value: 0, color: '#3b82f6', label: '0°' },
      { value: 6, color: '#06b6d4', label: '6°' },
      { value: 12, color: '#10b981', label: '12°' },
      { value: 18, color: '#84cc16', label: '18°' },
      { value: 24, color: '#eab308', label: '24°' },
      { value: 30, color: '#f97316', label: '30°' },
      { value: 35, color: '#ef4444', label: '35°' },
      { value: 40, color: '#b91c1c', label: '40°' },
      { value: 48, color: '#6b0000', label: '48°+' },
    ],
  },
  temperature_2m_min: {
    name: 'Min Temperature',
    variable: 'temperature_2m_min',
    unit: '°C',
    decimals: 0,
    stops: [
      { value: -15, color: '#312e81', label: '-15°' },
      { value: -8, color: '#3b82f6', label: '-8°' },
      { value: -2, color: '#06b6d4', label: '-2°' },
      { value: 4, color: '#10b981', label: '4°' },
      { value: 10, color: '#84cc16', label: '10°' },
      { value: 16, color: '#eab308', label: '16°' },
      { value: 21, color: '#f97316', label: '21°' },
      { value: 27, color: '#ef4444', label: '27°' },
      { value: 35, color: '#6b0000', label: '35°+' },
    ],
  },
  precipitation_sum: {
    name: 'Total Rainfall',
    variable: 'precipitation_sum',
    unit: 'mm',
    decimals: 1,
    stops: [
      { value: 0, color: '#f7fbff', label: '0' },
      { value: 15, color: '#c6dbef', label: '15' },
      { value: 40, color: '#6baed6', label: '40' },
      { value: 80, color: '#3182bd', label: '80' },
      { value: 140, color: '#08519c', label: '140' },
      { value: 220, color: '#238b45', label: '220' },
      { value: 320, color: '#e6550d', label: '320' },
      { value: 420, color: '#a50f15', label: '420' },
      { value: 500, color: '#542788', label: '500+' },
    ],
  },
  wind_speed_10m_max: {
    name: 'Wind Speed',
    variable: 'wind_speed_10m_max',
    unit: 'km/h',
    decimals: 1,
    stops: [
      { value: 0, color: '#f0fdfa', label: '0' },
      { value: 8, color: '#a7f3d0', label: '8' },
      { value: 15, color: '#38bdf8', label: '15' },
      { value: 22, color: '#3b82f6', label: '22' },
      { value: 30, color: '#facc15', label: '30' },
      { value: 38, color: '#fb923c', label: '38' },
      { value: 45, color: '#f97316', label: '45' },
      { value: 52, color: '#ef4444', label: '52' },
      { value: 60, color: '#a855f7', label: '60+' },
    ],
  },
  relative_humidity_2m_mean: {
    name: 'Relative Humidity',
    variable: 'relative_humidity_2m_mean',
    unit: '%',
    decimals: 0,
    stops: [
      { value: 0, color: '#d97706', label: '0%' },
      { value: 15, color: '#f59e0b', label: '15%' },
      { value: 30, color: '#fde047', label: '30%' },
      { value: 45, color: '#a3e635', label: '45%' },
      { value: 60, color: '#34d399', label: '60%' },
      { value: 75, color: '#22d3ee', label: '75%' },
      { value: 85, color: '#38bdf8', label: '85%' },
      { value: 95, color: '#2563eb', label: '95%' },
      { value: 100, color: '#1e40af', label: '100%' },
    ],
  },
  soil_moisture_0_to_7cm: {
    name: 'Soil Moisture',
    variable: 'soil_moisture_0_to_7cm',
    unit: 'm³/m³',
    decimals: 2,
    stops: [
      { value: 0.0, color: '#fef3c7', label: '0.00' },
      { value: 0.06, color: '#fde68a', label: '0.06' },
      { value: 0.12, color: '#f59e0b', label: '0.12' },
      { value: 0.2, color: '#d97706', label: '0.20' },
      { value: 0.28, color: '#b45309', label: '0.28' },
      { value: 0.36, color: '#92400e', label: '0.36' },
      { value: 0.45, color: '#451a03', label: '0.45+' },
    ],
  },
  soil_moisture_0_to_7cm_mean: {
    name: 'Soil Moisture',
    variable: 'soil_moisture_0_to_7cm_mean',
    unit: 'm³/m³',
    decimals: 2,
    stops: [
      { value: 0.0, color: '#fef3c7', label: '0.00' },
      { value: 0.06, color: '#fde68a', label: '0.06' },
      { value: 0.12, color: '#f59e0b', label: '0.12' },
      { value: 0.2, color: '#d97706', label: '0.20' },
      { value: 0.28, color: '#b45309', label: '0.28' },
      { value: 0.36, color: '#92400e', label: '0.36' },
      { value: 0.45, color: '#451a03', label: '0.45+' },
    ],
  },
  surface_solar_radiation: {
    name: 'Solar Sunshine',
    variable: 'surface_solar_radiation',
    unit: 'MJ/m²',
    decimals: 1,
    stops: [
      { value: 0, color: '#fef9c3', label: '0' },
      { value: 5, color: '#fef08a', label: '5' },
      { value: 10, color: '#fde047', label: '10' },
      { value: 15, color: '#facc15', label: '15' },
      { value: 20, color: '#fb923c', label: '20' },
      { value: 25, color: '#ef4444', label: '25' },
      { value: 30, color: '#7f1d1d', label: '30+' },
    ],
  },
  shortwave_radiation_sum: {
    name: 'Solar Sunshine',
    variable: 'shortwave_radiation_sum',
    unit: 'MJ/m²',
    decimals: 1,
    stops: [
      { value: 0, color: '#fef9c3', label: '0' },
      { value: 5, color: '#fef08a', label: '5' },
      { value: 10, color: '#fde047', label: '10' },
      { value: 15, color: '#facc15', label: '15' },
      { value: 20, color: '#fb923c', label: '20' },
      { value: 25, color: '#ef4444', label: '25' },
      { value: 30, color: '#7f1d1d', label: '30+' },
    ],
  },
  wind_gusts_10m_max: {
    name: 'Wind Gusts',
    variable: 'wind_gusts_10m_max',
    unit: 'km/h',
    decimals: 1,
    stops: [
      { value: 0, color: '#f0fdfa', label: '0' },
      { value: 15, color: '#a7f3d0', label: '15' },
      { value: 30, color: '#38bdf8', label: '30' },
      { value: 45, color: '#3b82f6', label: '45' },
      { value: 60, color: '#facc15', label: '60' },
      { value: 75, color: '#fb923c', label: '75' },
      { value: 90, color: '#ef4444', label: '90' },
      { value: 100, color: '#a855f7', label: '100+' },
    ],
  },
  cloud_cover_mean: {
    name: 'Cloud Cover',
    variable: 'cloud_cover_mean',
    unit: '%',
    decimals: 0,
    stops: [
      { value: 0, color: '#f8fafc', label: '0%' },
      { value: 20, color: '#e2e8f0', label: '20%' },
      { value: 40, color: '#cbd5e1', label: '40%' },
      { value: 60, color: '#94a3b8', label: '60%' },
      { value: 80, color: '#64748b', label: '80%' },
      { value: 100, color: '#1e293b', label: '100%' },
    ],
  },
  snow_depth_max: {
    name: 'Snow Depth',
    variable: 'snow_depth_max',
    unit: 'm',
    decimals: 2,
    stops: [
      { value: 0.0, color: '#f8fafc', label: '0m' },
      { value: 0.05, color: '#e2e8f0', label: '0.05m' },
      { value: 0.15, color: '#bae6fd', label: '0.15m' },
      { value: 0.35, color: '#7dd3fc', label: '0.35m' },
      { value: 0.65, color: '#38bdf8', label: '0.65m' },
      { value: 1.0, color: '#0284c7', label: '1.0m' },
      { value: 1.5, color: '#1e3a8a', label: '1.5m+' },
    ],
  },
  snowfall_sum: {
    name: 'Total Snowfall',
    variable: 'snowfall_sum',
    unit: 'cm',
    decimals: 1,
    stops: [
      { value: 0, color: '#f8fafc', label: '0' },
      { value: 5, color: '#bae6fd', label: '5' },
      { value: 15, color: '#7dd3fc', label: '15' },
      { value: 30, color: '#38bdf8', label: '30' },
      { value: 60, color: '#0284c7', label: '60' },
      { value: 100, color: '#1e3a8a', label: '100+' },
    ],
  },
  et0_fao_evapotranspiration: {
    name: 'Evapotranspiration',
    variable: 'et0_fao_evapotranspiration',
    unit: 'mm',
    decimals: 1,
    stops: [
      { value: 0, color: '#ffffe5', label: '0' },
      { value: 2, color: '#d9f0a3', label: '2' },
      { value: 4, color: '#addd8e', label: '4' },
      { value: 6, color: '#78c679', label: '6' },
      { value: 8, color: '#238443', label: '8' },
      { value: 12, color: '#005a32', label: '12+' },
    ],
  },
  pressure_msl_mean: {
    name: 'Sea-Level Pressure',
    variable: 'pressure_msl_mean',
    unit: 'hPa',
    decimals: 1,
    stops: [
      { value: 980, color: '#7c3aed', label: '980' },
      { value: 995, color: '#2563eb', label: '995' },
      { value: 1005, color: '#0284c7', label: '1005' },
      { value: 1013, color: '#10b981', label: '1013' },
      { value: 1020, color: '#84cc16', label: '1020' },
      { value: 1028, color: '#eab308', label: '1028' },
      { value: 1035, color: '#ea580c', label: '1035' },
      { value: 1040, color: '#dc2626', label: '1040+' },
    ],
  },
  anomaly: {
    name: 'Temperature Anomaly',
    variable: 'anomaly',
    unit: '°C',
    decimals: 1,
    stops: [
      { value: -3.0, color: '#2b6a84', label: '-3.0°' },
      { value: -1.5, color: '#4d8fa8', label: '-1.5°' },
      { value: -0.5, color: '#a6cfe0', label: '-0.5°' },
      { value: 0.0, color: '#ffffff', label: '0.0°' },
      { value: 0.5, color: '#e7bd6d', label: '+0.5°' },
      { value: 1.5, color: '#c9683b', label: '+1.5°' },
      { value: 3.0, color: '#b94a48', label: '+3.0°' },
    ],
  },
};

export function normalizeVariableKey(variableKey: string): string {
  if (variableKey === 'soil_moisture_0_to_7cm_mean') return 'soil_moisture_0_to_7cm';
  if (variableKey === 'shortwave_radiation_sum') return 'surface_solar_radiation';
  return variableKey;
}

export function getVariableColormap(
  variableKey: string,
  customMin?: number,
  customMax?: number
): ColormapDefinition {
  const base =
    SCIENTIFIC_COLORMAPS[variableKey] ||
    SCIENTIFIC_COLORMAPS[normalizeVariableKey(variableKey)] ||
    SCIENTIFIC_COLORMAPS.temperature_2m_mean;

  if (
    variableKey === 'precipitation_sum' &&
    typeof customMin === 'number' &&
    typeof customMax === 'number' &&
    customMax > customMin
  ) {
    const numStops = base.stops.length;
    const dynamicStops = base.stops.map((s, idx) => {
      const frac = idx / (numStops - 1);
      const val = Math.round(customMin + frac * (customMax - customMin));
      return {
        value: val,
        color: s.color,
        label: idx === numStops - 1 ? `${val}+` : `${val}`,
      };
    });
    return {
      ...base,
      stops: dynamicStops,
    };
  }

  return base;
}

export function getColorForValue(val: number, variableKey: string): string {
  const colormap = getVariableColormap(variableKey);
  const stops = colormap.stops;

  if (val <= stops[0].value) return stops[0].color;
  if (val >= stops[stops.length - 1].value) return stops[stops.length - 1].color;

  for (let i = 0; i < stops.length - 1; i++) {
    const s1 = stops[i];
    const s2 = stops[i + 1];
    if (val >= s1.value && val <= s2.value) {
      const t = (val - s1.value) / (s2.value - s1.value);
      return interpolateHex(s1.color, s2.color, t);
    }
  }
  return stops[0].color;
}

export function getNormalizedValue(val: number, variableKey: string): number {
  const colormap = getVariableColormap(variableKey);
  const stops = colormap.stops;
  const minVal = stops[0].value;
  const maxVal = stops[stops.length - 1].value;
  if (maxVal === minVal) return 0.5;
  const clamped = Math.max(minVal, Math.min(maxVal, val));
  return (clamped - minVal) / (maxVal - minVal);
}

export function getRgbForValue(val: number, variableKey: string): [number, number, number] {
  const hex = getColorForValue(val, variableKey);
  return hexToRgb(hex);
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    return [
      parseInt(cleaned[0] + cleaned[0], 16),
      parseInt(cleaned[1] + cleaned[1], 16),
      parseInt(cleaned[2] + cleaned[2], 16),
    ];
  }
  return [
    parseInt(cleaned.slice(0, 2), 16),
    parseInt(cleaned.slice(2, 4), 16),
    parseInt(cleaned.slice(4, 6), 16),
  ];
}

function interpolateHex(hex1: string, hex2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── Web Mercator Coordinate Transformations (EPSG:3857) ──────────────────────

function latToMercatorY(latDeg: number): number {
  const latRad = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + latRad / 2));
}

function mercatorYToLat(y: number): number {
  return ((2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180) / Math.PI;
}

// ── High-Resolution Web Mercator-Aligned Spatial Raster Overlay Generator ────

export interface RasterOverlayResult {
  dataUrl: string;
  coordinates: [[number, number], [number, number], [number, number], [number, number]]; // TL, TR, BR, BL
  bounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export function buildPolygonClippedRaster(
  points: Array<{ lat: number; lon: number; value: number }>,
  variableKey: string,
  boundaryGeoJson: any,
  resolution: number = 720,
  opacity: number = 0.85
): RasterOverlayResult | null {
  if (!points || points.length < 2 || !boundaryGeoJson) return null;

  // Extract bounding box from boundary GeoJSON or points
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  const updateBboxWithCoords = (coords: any) => {
    if (!coords || !Array.isArray(coords)) return;
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const lon = coords[0];
      const lat = coords[1];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      for (const item of coords) {
        updateBboxWithCoords(item);
      }
    }
  };

  const features = boundaryGeoJson.type === 'FeatureCollection' ? boundaryGeoJson.features : [boundaryGeoJson];
  for (const f of features) {
    if (f && f.geometry) updateBboxWithCoords(f.geometry.coordinates);
  }

  if (!isFinite(minLon) || !isFinite(maxLon) || minLon >= maxLon) {
    for (const p of points) {
      if (p.lon < minLon) minLon = p.lon;
      if (p.lon > maxLon) maxLon = p.lon;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    }
  }

  if (!isFinite(minLon) || minLon >= maxLon || minLat >= maxLat) return null;

  // Add 1.5% safety padding
  const padLon = Math.max(0.01, (maxLon - minLon) * 0.015);
  const padLat = Math.max(0.01, (maxLat - minLat) * 0.015);

  const minLonPad = minLon - padLon;
  const maxLonPad = maxLon + padLon;
  const minLatPad = Math.max(-85, minLat - padLat);
  const maxLatPad = Math.min(85, maxLat + padLat);

  // Compute bounding box in Web Mercator Y space to prevent Y-shift
  const minMercY = latToMercatorY(minLatPad);
  const maxMercY = latToMercatorY(maxLatPad);

  const width = resolution;
  const height = resolution;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // ── Step 1: Create Smooth High-Res Radar Surface in Web Mercator Y Space ───
  const gridW = 200;
  const gridH = 200;
  const rawCanvas = document.createElement('canvas');
  rawCanvas.width = gridW;
  rawCanvas.height = gridH;
  const rawCtx = rawCanvas.getContext('2d');
  if (!rawCtx) return null;

  const imgData = rawCtx.createImageData(gridW, gridH);
  const data = imgData.data;

  // Pre-calculate sample points in degrees & Mercator Y space
  const mercPoints = points.map((p) => ({
    lon: p.lon,
    lat: p.lat,
    val: p.value,
  }));

  for (let py = 0; py < gridH; py++) {
    // py=0 is North (maxMercY), py=gridH-1 is South (minMercY)
    const curMercY = maxMercY - (py / (gridH - 1)) * (maxMercY - minMercY);
    const curLat = mercYToLat(curMercY);

    for (let px = 0; px < gridW; px++) {
      const curLon = minLonPad + (px / (gridW - 1)) * (maxLonPad - minLonPad);

      let num = 0;
      let den = 0;
      let exactVal: number | null = null;

      for (let i = 0; i < mercPoints.length; i++) {
        const pt = mercPoints[i];
        const midLatRad = (((curLat + pt.lat) / 2) * Math.PI) / 180;
        const cosLat = Math.cos(midLatRad);

        const dLon = (curLon - pt.lon) * cosLat;
        const dLat = curLat - pt.lat;
        const d2 = dLon * dLon + dLat * dLat;

        if (d2 < 1e-7) {
          exactVal = pt.val;
          break;
        }

        // Softened inverse-distance weight with smoothing parameter
        const w = 1 / Math.pow(d2 + 0.015, 1.05);
        num += w * pt.val;
        den += w;
      }

      const val = exactVal !== null ? exactVal : den > 0 ? num / den : mercPoints[0].val;
      const [r, g, b] = getRgbForValue(val, variableKey);

      const idx = (py * gridW + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = Math.round(opacity * 255);
    }
  }

  rawCtx.putImageData(imgData, 0, 0);

  // ── Step 2: Draw High-Resolution Web Mercator-Projected Polygon Mask ────────
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return null;

  const toCanvasX = (lon: number) => ((lon - minLonPad) / (maxLonPad - minLonPad)) * (width - 1);
  const toCanvasY = (lat: number) => {
    const yMerc = latToMercatorY(lat);
    return ((maxMercY - yMerc) / (maxMercY - minMercY)) * (height - 1);
  };

  maskCtx.fillStyle = '#000000';

  const drawPolygonGeometry = (coords: number[][][]) => {
    if (!coords || coords.length === 0) return;
    maskCtx.beginPath();
    for (const ring of coords) {
      if (!ring || ring.length < 3) continue;
      maskCtx.moveTo(toCanvasX(ring[0][0]), toCanvasY(ring[0][1]));
      for (let i = 1; i < ring.length; i++) {
        maskCtx.lineTo(toCanvasX(ring[i][0]), toCanvasY(ring[i][1]));
      }
      maskCtx.closePath();
    }
    maskCtx.fill('evenodd'); // Handles holes (lakes) cleanly inside each polygon
  };

  for (const feat of features) {
    if (!feat || !feat.geometry) continue;
    const geom = feat.geometry;
    if (geom.type === 'Polygon') {
      drawPolygonGeometry(geom.coordinates as number[][][]);
    } else if (geom.type === 'MultiPolygon') {
      for (const polyCoords of geom.coordinates as number[][][][]) {
        drawPolygonGeometry(polyCoords);
      }
    }
  }

  // ── Step 3: Upscale Smoothed Field & Clip with Antialiased Mask ─────────────
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(rawCanvas, 0, 0, width, height);

  // Apply polygon mask with destination-in for perfectly smooth antialiased coastline edges
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');

  return {
    dataUrl,
    coordinates: [
      [minLonPad, maxLatPad], // top-left
      [maxLonPad, maxLatPad], // top-right
      [maxLonPad, minLatPad], // bottom-right
      [minLonPad, minLatPad], // bottom-left
    ],
    bounds: [minLonPad, minLatPad, maxLonPad, maxLatPad],
  };
}

export function mercYToLat(y: number): number {
  return mercatorYToLat(y);
}
