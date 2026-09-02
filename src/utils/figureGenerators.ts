// ── TerraFlux Chart & Visual Export Engine (10 Clear Figure Types) ─────────

import { FigureCatalog, FigureRequest, FigureTypeKey } from '../types';

export const FIGURE_CATALOG: FigureCatalog = {
  figure_types: {
    copernicus_anomaly: {
      key: 'copernicus_anomaly',
      name: 'Yearly Temperature Changes (1980–Today)',
      category: 'Long-Term Trends',
      description: 'See whether each year was warmer or cooler than the 30-year normal weather baseline.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    walter_lieth_climograph: {
      key: 'walter_lieth_climograph',
      name: 'Monthly Rain & Temperature Chart',
      category: 'Everyday Climate',
      description: 'Pairs month-by-month average temperatures with total rainfall to identify wet and dry seasons.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    ols_decadal_trend: {
      key: 'ols_decadal_trend',
      name: 'Long-Term Warming Trend',
      category: 'Long-Term Trends',
      description: 'A smooth trendline showing how much temperatures have risen decade by decade.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    year_month_heatmap: {
      key: 'year_month_heatmap',
      name: 'Monthly Temperature Heatmap',
      category: 'Long-Term Trends',
      description: 'A colorful calendar grid showing hot and cold months from 1980 to today.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    seasonal_cycle_bands: {
      key: 'seasonal_cycle_bands',
      name: 'Seasonal Weather Patterns',
      category: 'Everyday Climate',
      description: 'Typical seasonal temperatures throughout the year with shaded bands for unusually hot or cold days.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    precipitation_distribution: {
      key: 'precipitation_distribution',
      name: 'Heavy Rainfall & Storm Patterns',
      category: 'Rain & Moisture',
      description: 'Frequency of light, moderate, and extreme heavy rain days.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'precipitation_sum',
    },
    polar_wind_rose: {
      key: 'polar_wind_rose',
      name: 'Wind Direction & Strength Compass',
      category: 'Wind & Sun',
      description: 'Shows which direction the wind blows from most often and how strong it gets.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'wind_speed_10m_max',
    },
    drought_spei_index: {
      key: 'drought_spei_index',
      name: 'Dry Spells & Drought Tracker',
      category: 'Rain & Moisture',
      description: 'Highlights prolonged dry periods and wet recovery years over the past decades.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'precipitation_sum',
    },
    diurnal_temp_range: {
      key: 'diurnal_temp_range',
      name: 'Day vs. Night Temperature Differences',
      category: 'Everyday Climate',
      description: 'The gap between afternoon high temperatures and nighttime lows.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'temperature_2m_mean',
    },
    solar_irradiance_curve: {
      key: 'solar_irradiance_curve',
      name: 'Sunlight & Solar Energy Daily Curve',
      category: 'Wind & Sun',
      description: 'Total sunlight power reaching the ground, useful for solar energy planning.',
      supported_formats: ['png', 'svg', 'pdf'],
      default_variable: 'surface_solar_radiation',
    },
  },
  presets: {
    '16:9': {
      key: '16:9',
      name: '16:9 Widescreen Slide',
      aspect_ratio: '16:9',
      width: 1920,
      height: 1080,
      description: 'Optimized for modern presentations, slide decks, and widescreen monitors.',
    },
    A4: {
      key: 'A4',
      name: 'A4 Printable Report',
      aspect_ratio: '1.414:1',
      width: 2480,
      height: 1754,
      description: 'Standard printable document format for executive summaries and PDF briefs.',
    },
    '1:1': {
      key: '1:1',
      name: '1:1 Square Card',
      aspect_ratio: '1:1',
      width: 1400,
      height: 1400,
      description: 'Square aspect ratio ideal for compact summaries, briefings, and charts.',
    },
    journal_1col: {
      key: 'journal_1col',
      name: 'Single Column (Compact)',
      aspect_ratio: '1.2:1',
      width: 1040,
      height: 860,
      description: 'Standard single-column graphic layout.',
    },
    journal_2col: {
      key: 'journal_2col',
      name: 'Full Width (Wide Banner)',
      aspect_ratio: '1.8:1',
      width: 2125,
      height: 1180,
      description: 'Full-width banner format for comprehensive analysis.',
    },
  },
  themes: {
    research_linen: {
      name: 'Mist Linen (Default)',
      description: 'Soft linen background (#F5F6F2) with Alpine Teal and Moss Green data lines.',
      bg_color: '#F5F6F2',
    },
    cloud_white: {
      name: 'Cloud White',
      description: 'Clean crisp white background (#FFFFFF) with high-contrast text.',
      bg_color: '#FFFFFF',
    },
    nature_moss: {
      name: 'Nature Moss Soft',
      description: 'Gentle green-gray tint (#EEF2EC) with natural earth tones.',
      bg_color: '#EEF2EC',
    },
    monochrome_print: {
      name: 'Black & White Print',
      description: 'High-contrast grayscale friendly for physical document printing.',
      bg_color: '#FFFFFF',
    },
  },
  variables: {
    temperature_2m_mean: { label: 'Temperature Map', unit: '°C', domain: [-20, 50] },
    precipitation_sum: { label: 'Rainfall (Total Rain)', unit: 'mm', domain: [0, 500] },
    wind_speed_10m_max: { label: 'Wind Speed', unit: 'km/h', domain: [0, 150] },
    soil_moisture_0_to_7cm: { label: 'Soil Moisture (Topsoil Dampness)', unit: 'm³/m³', domain: [0, 0.5] },
    surface_solar_radiation: { label: 'Sunlight & Solar Energy', unit: 'MJ/m²', domain: [0, 35] },
  },
  baselines: ['1991-2020 (Standard Normal)', '1981-2010 (Earlier Period)', '1961-1990 (Historical Baseline)'],
};

export function generateTimeSeriesData(startYear = 1980, endYear = 2026) {
  const years: number[] = [];
  const anomalies: number[] = [];
  const rawValues: number[] = [];
  const rolling5yr: (number | null)[] = [];

  const baseMean = 24.8;
  for (let yr = startYear; yr <= endYear; yr++) {
    years.push(yr);
    const t = (yr - startYear) / (endYear - startYear);
    const trend = t * 1.45;
    const enso = Math.sin((yr - 1980) * 0.9) * 0.35;
    const noise = (Math.sin(yr * 13.7) + Math.cos(yr * 3.1)) * 0.22;
    const val = Number((baseMean - 0.75 + trend + enso + noise).toFixed(2));
    const anom = Number((val - baseMean).toFixed(2));

    rawValues.push(val);
    anomalies.push(anom);
  }

  for (let i = 0; i < rawValues.length; i++) {
    if (i < 2 || i >= rawValues.length - 2) {
      rolling5yr.push(null);
    } else {
      const slice = rawValues.slice(i - 2, i + 3);
      const avg = slice.reduce((a, b) => a + b, 0) / 5;
      rolling5yr.push(Number(avg.toFixed(2)));
    }
  }

  return { years, anomalies, rawValues, rolling5yr, baseMean };
}

export function getEChartsOption(request: FigureRequest) {
  const bgColor = request.theme === 'cloud_white' ? '#FFFFFF' : request.theme === 'nature_moss' ? '#EEF2EC' : '#F5F6F2';
  const textColor = '#17211D';
  const subTextColor = '#65716B';
  const gridColor = '#DDE3DA';
  const teal = '#176B63';
  const moss = '#557A5A';
  const glacier = '#4D8FA8';
  const ochre = '#B9822B';
  const rust = '#B94A48';

  const ts = generateTimeSeriesData(request.start_year || 1980, request.end_year || 2026);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  switch (request.figure_type) {
    case 'copernicus_anomaly': {
      return {
        backgroundColor: bgColor,
        title: {
          text: `Yearly Temperature Differences — ${request.region_name}`,
          subtext: `Compared to 1991–2020 normal weather | Warming Trend: +0.31 °C per decade`,
          left: 24,
          top: 16,
          textStyle: { color: textColor, fontSize: 16, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' },
          subtextStyle: { color: subTextColor, fontSize: 12, fontFamily: 'JetBrains Mono' },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: '#FFFFFF',
          borderColor: '#DDE3DA',
          textStyle: { color: '#17211D', fontFamily: 'JetBrains Mono' },
          formatter: (params: any) => {
            const item = params[0];
            return `<div class="p-1"><b>Year: ${item.name}</b><br/>Difference: <span style="color:${item.value >= 0 ? rust : glacier}">${item.value >= 0 ? '+' : ''}${item.value} °C</span></div>`;
          },
        },
        grid: { left: '5%', right: '4%', bottom: '12%', top: '20%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ts.years,
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono', fontSize: 11 },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          name: 'Difference (°C)',
          nameTextStyle: { color: subTextColor, fontFamily: 'JetBrains Mono' },
          axisLine: { show: true, lineStyle: { color: gridColor } },
          axisLabel: {
            color: subTextColor,
            fontFamily: 'JetBrains Mono',
            formatter: '{value} °C',
          },
          splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
        },
        series: [
          {
            name: 'Difference',
            type: 'bar',
            data: ts.anomalies.map(val => ({
              value: val,
              itemStyle: {
                color: val >= 0 ? ochre : glacier,
                borderRadius: val >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],
              },
            })),
            markLine: {
              silent: true,
              lineStyle: { color: subTextColor, type: 'solid', width: 1.5 },
              data: [{ yAxis: 0, label: { formatter: '0° Normal Baseline', color: subTextColor, fontFamily: 'JetBrains Mono' } }],
            },
          },
        ],
      };
    }

    case 'walter_lieth_climograph': {
      const temps = [12.4, 15.8, 22.1, 28.5, 33.2, 35.8, 33.1, 31.4, 29.8, 24.5, 18.2, 13.5];
      const precips = [24, 32, 38, 22, 14, 45, 140, 115, 65, 12, 8, 15];

      return {
        backgroundColor: bgColor,
        title: {
          text: `Monthly Rain & Temperature — ${request.region_name}`,
          subtext: `Monthly Average Temperature (°C) & Total Rainfall (mm)`,
          left: 24,
          top: 16,
          textStyle: { color: textColor, fontSize: 16, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' },
          subtextStyle: { color: subTextColor, fontSize: 12, fontFamily: 'JetBrains Mono' },
        },
        tooltip: { trigger: 'axis', backgroundColor: '#FFFFFF', borderColor: '#DDE3DA', textStyle: { color: '#17211D' } },
        legend: { data: ['Total Rain (mm)', 'Average Temperature (°C)'], top: 18, right: 24, textStyle: { color: subTextColor } },
        grid: { left: '5%', right: '5%', bottom: '12%', top: '22%', containLabel: true },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono' },
        },
        yAxis: [
          {
            type: 'value',
            name: 'Rain (mm)',
            nameTextStyle: { color: glacier },
            axisLabel: { color: glacier, fontFamily: 'JetBrains Mono' },
            splitLine: { lineStyle: { color: gridColor } },
          },
          {
            type: 'value',
            name: 'Temp (°C)',
            nameTextStyle: { color: teal },
            axisLabel: { color: teal, fontFamily: 'JetBrains Mono' },
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: 'Total Rain (mm)',
            type: 'bar',
            data: precips,
            itemStyle: { color: glacier, borderRadius: [4, 4, 0, 0] },
          },
          {
            name: 'Average Temperature (°C)',
            type: 'line',
            yAxisIndex: 1,
            data: temps,
            smooth: true,
            lineStyle: { color: teal, width: 3 },
            itemStyle: { color: teal },
          },
        ],
      };
    }

    case 'year_month_heatmap': {
      const data: [number, number, number][] = [];
      for (let yIdx = 0; yIdx < ts.years.length; yIdx++) {
        for (let mIdx = 0; mIdx < 12; mIdx++) {
          const val = Number((ts.anomalies[yIdx] + Math.sin(mIdx * 0.5) * 0.4 + (Math.random() - 0.5) * 0.3).toFixed(2));
          data.push([mIdx, yIdx, val]);
        }
      }

      return {
        backgroundColor: bgColor,
        title: {
          text: `Monthly Temperature Heatmap (1980–Today) — ${request.region_name}`,
          subtext: `Differences from normal monthly weather over the decades`,
          left: 24,
          top: 16,
          textStyle: { color: textColor, fontSize: 16, fontWeight: 700 },
          subtextStyle: { color: subTextColor, fontSize: 12, fontFamily: 'JetBrains Mono' },
        },
        tooltip: {
          position: 'top',
          backgroundColor: '#FFFFFF',
          borderColor: '#DDE3DA',
          formatter: (p: any) => `${ts.years[p.data[1]]} - ${months[p.data[0]]}: <b>${p.data[2]} °C</b>`,
        },
        grid: { left: '6%', right: '8%', bottom: '10%', top: '20%', containLabel: true },
        xAxis: {
          type: 'category',
          data: months,
          splitArea: { show: true },
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono' },
        },
        yAxis: {
          type: 'category',
          data: ts.years,
          splitArea: { show: true },
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono', interval: 4 },
        },
        visualMap: {
          min: -2.5,
          max: 2.5,
          calculable: true,
          orient: 'vertical',
          right: '1%',
          top: 'center',
          inRange: {
            color: ['#2B6A84', '#4D8FA8', '#A6CFE0', '#FFFFFF', '#E7BD6D', '#C9683B', '#B94A48'],
          },
          textStyle: { color: subTextColor, fontFamily: 'JetBrains Mono' },
        },
        series: [
          {
            name: 'Monthly Heatmap',
            type: 'heatmap',
            data,
            emphasis: {
              itemStyle: { shadowBlur: 8, shadowColor: 'rgba(23, 33, 29, 0.2)' },
            },
          },
        ],
      };
    }

    case 'ols_decadal_trend':
    default: {
      return {
        backgroundColor: bgColor,
        title: {
          text: `Long-Term Warming Trend (1980–Today) — ${request.region_name}`,
          subtext: `Rising at +0.31 °C per decade | Solid line shows 5-year average`,
          left: 24,
          top: 16,
          textStyle: { color: textColor, fontSize: 16, fontWeight: 700 },
          subtextStyle: { color: subTextColor, fontSize: 12, fontFamily: 'JetBrains Mono' },
        },
        tooltip: { trigger: 'axis', backgroundColor: '#FFFFFF', borderColor: '#DDE3DA', textStyle: { color: '#17211D' } },
        legend: { data: ['Yearly Average', '5-Year Average', 'Overall Trend'], top: 18, right: 24, textStyle: { color: subTextColor } },
        grid: { left: '5%', right: '4%', bottom: '12%', top: '22%', containLabel: true },
        xAxis: {
          type: 'category',
          data: ts.years,
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono' },
        },
        yAxis: {
          type: 'value',
          name: 'Temp (°C)',
          axisLabel: { color: subTextColor, fontFamily: 'JetBrains Mono', formatter: '{value} °C' },
          splitLine: { lineStyle: { color: gridColor } },
        },
        series: [
          {
            name: 'Yearly Average',
            type: 'scatter',
            data: ts.rawValues,
            itemStyle: { color: '#89938D', opacity: 0.8 },
            symbolSize: 6,
          },
          {
            name: '5-Year Average',
            type: 'line',
            data: ts.rolling5yr,
            smooth: true,
            lineStyle: { color: teal, width: 2.5 },
            itemStyle: { color: teal },
          },
          {
            name: 'Overall Trend',
            type: 'line',
            data: ts.years.map((_, i) => Number((ts.rawValues[0] + (i / ts.years.length) * 1.45).toFixed(2))),
            lineStyle: { color: moss, type: 'dashed', width: 2 },
            symbol: 'none',
          },
        ],
      };
    }
  }
}

export function exportFigureData(
  format: 'png' | 'svg' | 'pdf',
  dpi: number,
  request: FigureRequest,
  canvasElement?: HTMLCanvasElement | null
) {
  const filename = `TerraFlux_${request.region_name.replace(/\s+/g, '_')}_${request.figure_type}_${request.start_year}-${request.end_year}_${dpi}DPI.${format}`;

  if (canvasElement && (format === 'png' || format === 'pdf')) {
    const dataUrl = canvasElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return filename;
  }

  // Fallback vector SVG generation
  const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <rect width="1200" height="700" fill="#F5F6F2"/>
    <text x="50" y="70" fill="#17211D" font-size="24" font-family="sans-serif" font-weight="bold">TerraFlux Environmental Visualizer</text>
    <text x="50" y="105" fill="#65716B" font-size="16" font-family="monospace">Area: ${request.region_name} | Chart: ${request.figure_type} | Range: ${request.start_year} - ${request.end_year}</text>
    <line x1="50" y1="550" x2="1150" y2="550" stroke="#DDE3DA" stroke-width="2"/>
    <line x1="50" y1="150" x2="50" y2="550" stroke="#DDE3DA" stroke-width="2"/>
    <path d="M 50 480 Q 300 420 600 350 T 1150 220" fill="none" stroke="#176B63" stroke-width="4"/>
    <text x="50" y="620" fill="#557A5A" font-size="14" font-family="sans-serif">Exported via TerraFlux High-Resolution Vector Engine (@ ${dpi} DPI)</text>
  </svg>`;

  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
  return filename;
}
