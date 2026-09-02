// ── TerraFlux Geospatial Engine & Boundary Geometries ──────────────────────

import { RegionCandidate, GeoJsonFeatureCollection, ClimateSamplePoint, ClimateGridResult } from '../types';
import * as turf from '@turf/turf';

export const WORLD_REGIONS: RegionCandidate[] = [
  {
    display_name: 'Punjab, Pakistan',
    short_name: 'Punjab',
    lat: 31.1704,
    lon: 72.7097,
    osm_type: 'relation',
    osm_id: 'R398701',
    type: 'administrative',
    category: 'boundary',
    country: 'Pakistan',
    country_code_2: 'PK',
    country_code_3: 'PAK',
    admin_level_hint: 1,
    importance: 0.92,
    parent_chain: ['Pakistan', 'Punjab'],
    bbox: [69.3, 27.7, 75.4, 34.0],
  },
  {
    display_name: 'Sindh, Pakistan',
    short_name: 'Sindh',
    lat: 25.8943,
    lon: 68.5247,
    osm_type: 'relation',
    osm_id: 'R398702',
    type: 'administrative',
    category: 'boundary',
    country: 'Pakistan',
    country_code_2: 'PK',
    country_code_3: 'PAK',
    admin_level_hint: 1,
    importance: 0.88,
    parent_chain: ['Pakistan', 'Sindh'],
    bbox: [66.6, 23.6, 71.1, 28.5],
  },
  {
    display_name: 'Indus River Basin, South Asia',
    short_name: 'Indus Basin',
    lat: 29.5,
    lon: 71.5,
    osm_type: 'relation',
    osm_id: 'R991001',
    type: 'drainage_basin',
    category: 'natural',
    country: 'Pakistan / India',
    country_code_2: 'PK',
    country_code_3: 'PAK',
    admin_level_hint: 0,
    importance: 0.95,
    parent_chain: ['South Asia', 'Indus Basin'],
    bbox: [66.0, 23.5, 78.5, 37.2],
  },
  {
    display_name: 'Pakistan (National Boundary)',
    short_name: 'Pakistan',
    lat: 30.3753,
    lon: 69.3451,
    osm_type: 'relation',
    osm_id: 'R398700',
    type: 'administrative',
    category: 'boundary',
    country: 'Pakistan',
    country_code_2: 'PK',
    country_code_3: 'PAK',
    admin_level_hint: 0,
    importance: 0.98,
    parent_chain: ['Pakistan'],
    bbox: [60.8, 23.6, 77.8, 37.1],
  },
  {
    display_name: 'European Alps Range, Europe',
    short_name: 'Alps Range',
    lat: 46.5,
    lon: 10.5,
    osm_type: 'relation',
    osm_id: 'R881200',
    type: 'mountain_range',
    category: 'natural',
    country: 'Switzerland / France / Italy / Austria',
    country_code_2: 'CH',
    country_code_3: 'CHE',
    admin_level_hint: 0,
    importance: 0.89,
    parent_chain: ['Europe', 'Alps'],
    bbox: [5.5, 43.8, 16.2, 48.2],
  },
  {
    display_name: 'Amazon Rainforest Basin, Brazil',
    short_name: 'Amazon Basin',
    lat: -3.4653,
    lon: -62.2159,
    osm_type: 'relation',
    osm_id: 'R772010',
    type: 'drainage_basin',
    category: 'natural',
    country: 'Brazil',
    country_code_2: 'BR',
    country_code_3: 'BRA',
    admin_level_hint: 0,
    importance: 0.96,
    parent_chain: ['South America', 'Amazon Basin'],
    bbox: [-74.0, -15.0, -48.0, 5.0],
  },
  {
    display_name: 'California Central Valley, United States',
    short_name: 'California Valley',
    lat: 36.7783,
    lon: -119.4179,
    osm_type: 'relation',
    osm_id: 'R165475',
    type: 'administrative',
    category: 'boundary',
    country: 'United States',
    country_code_2: 'US',
    country_code_3: 'USA',
    admin_level_hint: 1,
    importance: 0.91,
    parent_chain: ['United States', 'California'],
    bbox: [-124.5, 32.5, -114.1, 42.0],
  },
  {
    display_name: 'Nile River Delta & Basin, Egypt',
    short_name: 'Nile Basin',
    lat: 30.5,
    lon: 31.0,
    osm_type: 'relation',
    osm_id: 'R443210',
    type: 'drainage_basin',
    category: 'natural',
    country: 'Egypt',
    country_code_2: 'EG',
    country_code_3: 'EGY',
    admin_level_hint: 0,
    importance: 0.9,
    parent_chain: ['Africa', 'Nile Basin'],
    bbox: [28.0, 22.0, 35.0, 31.8],
  },
  {
    display_name: 'Rhine River Valley, Germany / France / Netherlands',
    short_name: 'Rhine Valley',
    lat: 50.1,
    lon: 7.6,
    osm_type: 'relation',
    osm_id: 'R554321',
    type: 'river_basin',
    category: 'natural',
    country: 'Germany',
    country_code_2: 'DE',
    country_code_3: 'DEU',
    admin_level_hint: 0,
    importance: 0.85,
    parent_chain: ['Europe', 'Rhine Valley'],
    bbox: [5.0, 46.5, 9.5, 52.5],
  },
  {
    display_name: 'Tokyo Bay Region, Japan',
    short_name: 'Tokyo Bay',
    lat: 35.5,
    lon: 139.9,
    osm_type: 'relation',
    osm_id: 'R382313',
    type: 'administrative',
    category: 'boundary',
    country: 'Japan',
    country_code_2: 'JP',
    country_code_3: 'JPN',
    admin_level_hint: 1,
    importance: 0.9,
    parent_chain: ['Japan', 'Kanto', 'Tokyo'],
    bbox: [138.8, 34.8, 140.9, 36.2],
  },
];

export const REGION_GEOMETRIES: Record<string, number[][][]> = {
  Punjab: [
    [
      [73.9, 34.0], [75.0, 32.5], [75.4, 31.5], [74.5, 30.5], [73.5, 29.0],
      [71.5, 27.8], [70.0, 28.5], [69.4, 29.8], [70.5, 31.5], [71.5, 32.8],
      [72.8, 33.8], [73.9, 34.0]
    ]
  ],
  Sindh: [
    [
      [68.5, 28.5], [71.0, 28.0], [71.1, 26.5], [70.5, 24.5], [69.0, 23.6],
      [67.8, 24.2], [66.7, 24.9], [67.0, 26.5], [68.0, 27.8], [68.5, 28.5]
    ]
  ],
  'Indus Basin': [
    [
      [77.0, 36.8], [78.2, 34.5], [76.5, 32.0], [74.8, 30.0], [72.5, 27.5],
      [70.5, 24.5], [67.5, 23.8], [66.2, 25.2], [67.0, 28.0], [68.5, 30.5],
      [70.0, 33.5], [73.0, 36.5], [77.0, 36.8]
    ]
  ],
  Pakistan: [
    [
      [75.0, 37.1], [77.8, 35.5], [75.0, 32.5], [74.5, 30.5], [71.0, 28.0],
      [70.5, 24.5], [68.0, 23.6], [66.5, 24.8], [61.5, 25.2], [60.8, 29.5],
      [64.0, 30.5], [69.5, 32.0], [71.5, 35.5], [75.0, 37.1]
    ]
  ],
  'Alps Range': [
    [
      [6.0, 45.0], [7.5, 46.2], [10.5, 47.5], [14.0, 47.8], [16.0, 46.8],
      [14.5, 45.8], [11.5, 45.5], [8.0, 44.5], [6.8, 43.9], [6.0, 45.0]
    ]
  ],
  'Amazon Basin': [
    [
      [-73.0, 2.0], [-62.0, 4.5], [-50.0, 0.0], [-48.5, -6.0], [-55.0, -14.0],
      [-65.0, -15.0], [-72.0, -11.0], [-74.0, -3.0], [-73.0, 2.0]
    ]
  ],
  'California Valley': [
    [
      [-122.5, 41.5], [-120.0, 42.0], [-119.5, 38.5], [-117.0, 35.0], [-114.5, 32.8],
      [-117.5, 32.5], [-120.5, 34.5], [-122.5, 37.5], [-124.2, 40.2], [-122.5, 41.5]
    ]
  ],
  'Nile Basin': [
    [
      [31.5, 31.8], [33.5, 30.0], [34.5, 25.0], [33.0, 22.0], [30.5, 24.0],
      [28.5, 28.0], [29.5, 31.2], [31.5, 31.8]
    ]
  ],
  'Rhine Valley': [
    [
      [5.5, 52.0], [7.5, 51.8], [8.8, 50.0], [9.2, 47.5], [7.8, 47.0],
      [6.8, 48.5], [5.8, 50.5], [5.5, 52.0]
    ]
  ],
  'Tokyo Bay': [
    [
      [139.5, 36.0], [140.5, 35.8], [140.8, 35.2], [139.8, 34.9], [139.2, 35.3],
      [139.5, 36.0]
    ]
  ],
};

export function getRegionFeatureCollection(regionName: string): GeoJsonFeatureCollection {
  const matchKey = Object.keys(REGION_GEOMETRIES).find(
    k => regionName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(regionName.toLowerCase())
  ) || 'Punjab';

  const coords = REGION_GEOMETRIES[matchKey] || REGION_GEOMETRIES['Punjab'];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: matchKey,
          admin_level: 1,
          country_code: 'PK',
          area_sqkm: 205344,
          mean_elevation_m: 240,
        },
        geometry: {
          type: 'Polygon',
          coordinates: coords,
        },
      },
    ],
  };
}



export function computeFeatureBbox(
  featureCollection: GeoJsonFeatureCollection
): [number, number, number, number] | null {
  try {
    const bbox = turf.bbox(featureCollection as any);
    return [bbox[0], bbox[1], bbox[2], bbox[3]];
  } catch (e) {
    console.warn('[geodesy] turf.bbox error:', e);
    return null;
  }
}

export function buildInvertedWorldMask(featureCollection: GeoJsonFeatureCollection): GeoJsonFeatureCollection {
  const outerWorldRing = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];

  if (!featureCollection || !featureCollection.features || featureCollection.features.length === 0) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'WorldMask' },
          geometry: {
            type: 'Polygon',
            coordinates: [outerWorldRing],
          },
        },
      ],
    };
  }

  try {
    // turf.mask creates a topologically valid inverted world mask with correct winding
    const masked = turf.mask(featureCollection as any);
    return {
      type: 'FeatureCollection',
      features: [masked as any],
    };
  } catch (err) {
    console.warn('[geoData] turf.mask failed, attempting fallback:', err);
    try {
      const validFeatures = featureCollection.features.filter(
        (f) => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
      );
      if (validFeatures.length > 0) {
        const masked = turf.mask(validFeatures[0] as any);
        return {
          type: 'FeatureCollection',
          features: [masked as any],
        };
      }
    } catch (e) {
      console.error('[geoData] Inverted mask generation error:', e);
    }

    return {
      type: 'FeatureCollection',
      features: [],
    };
  }
}

export function getInvertedWorldFeatureCollection(regionName: string): GeoJsonFeatureCollection {
  const geojson = getRegionFeatureCollection(regionName);
  return buildInvertedWorldMask(geojson);
}

export function isPointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function generateClimateGrid(
  regionName: string,
  variable: string,
  gridSize: number = 8,
  startDate?: string,
  endDate?: string
): ClimateGridResult {
  const candidate = WORLD_REGIONS.find(
    r => regionName.toLowerCase().includes(r.short_name.toLowerCase()) ||
         r.display_name.toLowerCase().includes(regionName.toLowerCase())
  ) || WORLD_REGIONS[0];

  const matchKey = Object.keys(REGION_GEOMETRIES).find(
    k => candidate.short_name.toLowerCase().includes(k.toLowerCase())
  ) || 'Punjab';

  const boundary = REGION_GEOMETRIES[matchKey][0];
  const [minLon, minLat, maxLon, maxLat] = candidate.bbox;

  const points: ClimateSamplePoint[] = [];
  const latStep = (maxLat - minLat) / gridSize;
  const lonStep = (maxLon - minLon) / gridSize;

  let baseMean = 28.4;
  let baseUnit = '°C';
  let varLabel = 'Temperature Map';

  if (variable === 'temperature_2m_mean') {
    baseMean = matchKey === 'Alps Range' ? 4.2 : matchKey === 'Amazon Basin' ? 26.8 : 28.5;
    baseUnit = '°C';
    varLabel = 'Temperature Map';
  } else if (variable === 'precipitation_sum') {
    baseMean = matchKey === 'Amazon Basin' ? 180 : matchKey === 'Sindh' ? 14 : 52;
    baseUnit = 'mm';
    varLabel = 'Rainfall (Total Rain)';
  } else if (variable === 'wind_speed_10m_max') {
    baseMean = 22.4;
    baseUnit = 'km/h';
    varLabel = 'Wind Speed';
  } else if (variable === 'soil_moisture_0_to_7cm') {
    baseMean = matchKey === 'Sindh' ? 0.12 : 0.28;
    baseUnit = 'm³/m³';
    varLabel = 'Soil Moisture (Topsoil Dampness)';
  } else if (variable === 'surface_solar_radiation') {
    baseMean = 21.5;
    baseUnit = 'MJ/m²';
    varLabel = 'Sunlight & Solar Energy';
  }

  let count = 0;
  for (let lat = minLat + latStep / 2; lat <= maxLat; lat += latStep) {
    for (let lon = minLon + lonStep / 2; lon <= maxLon; lon += lonStep) {
      if (isPointInPolygon([lon, lat], boundary)) {
        count++;
        const latNorm = (lat - minLat) / (maxLat - minLat);
        const lonNorm = (lon - minLon) / (maxLon - minLon);
        const elevationSim = Math.sin(latNorm * Math.PI) * 450 + Math.cos(lonNorm * Math.PI) * 150;
        
        let value = baseMean;
        if (variable.includes('temp')) {
          value = baseMean - (latNorm * 4.5) + (Math.sin(lonNorm * 5) * 1.8) - (elevationSim / 300);
        } else if (variable.includes('precip')) {
          value = Math.max(0, baseMean + (Math.sin(latNorm * 4) * 35) + (Math.cos(lonNorm * 4) * 20));
        } else {
          value = baseMean + (Math.sin(latNorm * 6 + lonNorm * 3) * (baseMean * 0.25));
        }

        const anomaly = Number(((value - baseMean) * 0.45).toFixed(2));

        points.push({
          id: `pt_${count}`,
          lat: Number(lat.toFixed(4)),
          lon: Number(lon.toFixed(4)),
          value: Number(value.toFixed(1)),
          unit: baseUnit,
          anomaly,
          elevation_m: Math.round(Math.max(12, elevationSim + 50)),
          place_name: `${candidate.short_name} Station #${count}`,
        });
      }
    }
  }

  const values = points.map(p => p.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = values.length ? Number((sum / values.length).toFixed(2)) : baseMean;
  const min = values.length ? Math.min(...values) : baseMean - 5;
  const max = values.length ? Math.max(...values) : baseMean + 5;
  const sorted = [...values].sort((a, b) => a - b);
  const p10 = sorted[Math.floor(sorted.length * 0.1)] || min;
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || max;

  return {
    status: 'ok',
    variable,
    variable_name: varLabel,
    start_date: startDate || '1980-01-01',
    end_date: endDate || '2026-12-31',
    points,
    stats: {
      mean,
      min,
      max,
      std: Number((((max - min) / 4)).toFixed(2)),
      p10,
      p90,
      decadal_trend: 0.31,
      baseline_diff: 1.14,
    },
  };
}
