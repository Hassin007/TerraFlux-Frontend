// ── TerraFlux TypeScript Domain Contracts ────────────────────────────────────

export type ActiveView = 'home' | 'app' | 'guide';

export type AdminLevel = 0 | 1 | 2 | 3;

export interface RegionCandidate {
  display_name: string;
  short_name: string;
  lat: number;
  lon: number;
  osm_type: string;
  osm_id: string;
  type: string;
  category: string;
  country: string;
  country_code_2: string;
  country_code_3: string;
  admin_level_hint: AdminLevel;
  importance: number;
  parent_chain: string[];
  bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    name?: string;
    admin_level?: number;
    country_code?: string;
    area_sqkm?: number;
    mean_elevation_m?: number;
    [key: string]: any;
  };
  geometry: GeoJsonGeometry;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface BoundaryRequest {
  region_name: string;
  country_code?: string;
  admin_level?: number;
  clip?: boolean;
  osm_id?: string;
  osm_type?: string;
  parent_chain?: string[];
}

export interface BoundaryResponse {
  status: 'ok' | 'error';
  region_name: string;
  admin_level: number;
  country_code?: string;
  centroid?: { lat: number; lon: number };
  bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  notice?: string | null;
  strategy?: string | null;
  geojson: GeoJsonFeatureCollection;
}

export interface ClimateSamplePoint {
  id: string;
  lat: number;
  lon: number;
  value: number;
  unit: string;
  anomaly?: number;
  place_name?: string;
  elevation_m?: number;
}

export type LayerMode = 'gee_tiles' | 'canvas_sampling' | 'none';

export type RainfallScaleMode = 'auto' | 'standard' | 'custom';

export interface GEETileRequest {
  region_name: string;
  country_code?: string;
  admin_level?: number;
  osm_id?: string;
  osm_type?: string;
  parent_chain?: string[];
  variable: string;
  start_date: string;
  end_date: string;
  aggregation_mode?: 'mean' | 'max' | 'min';
  vis_min?: number;
  vis_max?: number;
}

export interface GEETileResponse {
  status: 'ok' | 'error';
  region_name: string;
  variable: string;
  tile_url: string;
  vis_min?: number;
  vis_max?: number;
  message?: string;
}

export interface ClimateRequest {
  region_name: string;
  country_code?: string;
  admin_level?: number;
  osm_id?: string;
  osm_type?: string;
  parent_chain?: string[];
  clip?: boolean;
  variable: string;
  start_date: string;
  end_date: string;
  grid_size?: number;
  aggregation_mode?: 'mean' | 'max' | 'min';
}

export interface ClimateGridResult {
  status: 'ok' | 'error';
  region_name?: string;
  variable: string;
  variable_name: string;
  aggregation_mode?: 'mean' | 'max' | 'min';
  start_date: string;
  end_date: string;
  points: ClimateSamplePoint[];
  stats: {
    mean: number;
    min: number;
    max: number;
    std: number;
    p10: number;
    p90: number;
    decadal_trend: number; // e.g. +0.31 °C / decade
    baseline_diff: number;
  };
  notice?: string | null;
}

export interface ClimateGridResponse {
  status: 'ok' | 'error';
  region_name: string;
  variable: string;
  aggregation_mode?: 'mean' | 'max' | 'min';
  start_date: string;
  end_date: string;
  grid_size: number;
  points_sampled: number;
  points: ClimateSamplePoint[];
  stats: {
    mean: number;
    min: number;
    max: number;
    std: number;
    p10: number;
    p90: number;
    decadal_trend: number;
    baseline_diff: number;
  };
  notice?: string | null;
}

// ── Scientific Figure Studio Contracts ─────────────────────────────────────

export type FigureTypeKey =
  | 'anomaly'
  | 'trend'
  | 'climatology'
  | 'precipitation'
  | 'distribution'
  | 'heatmap'
  | 'spatial_map'
  | 'copernicus_anomaly'
  | 'walter_lieth_climograph'
  | 'ols_decadal_trend'
  | 'year_month_heatmap'
  | 'seasonal_cycle_bands'
  | 'precipitation_distribution'
  | 'polar_wind_rose'
  | 'drought_spei_index'
  | 'diurnal_temp_range'
  | 'solar_irradiance_curve'
  | string;

export type AspectRatioPresetKey =
  | 'presentation_16_9'
  | 'presentation_4_3'
  | 'report_a4_landscape'
  | 'report_a4_portrait'
  | 'publication_double_col'
  | 'publication_single_col'
  | 'square_1_1'
  | '16:9'
  | 'A4'
  | '1:1'
  | 'journal_1col'
  | 'journal_2col'
  | string;

export type VisualThemeKey =
  | 'publication_light'
  | 'presentation_light'
  | 'dark_modern'
  | 'research_linen'
  | 'cloud_white'
  | 'nature_moss'
  | 'monochrome_print'
  | string;

export interface FigurePreset {
  key: AspectRatioPresetKey;
  name: string;
  aspect_ratio: string;
  width?: number;
  height?: number;
  description: string;
}

export interface FigureTypeInfo {
  key: FigureTypeKey;
  name: string;
  category: string;
  description: string;
  supported_formats: ('png' | 'svg' | 'pdf')[];
  default_variable: string;
  supports_baseline?: boolean;
}

export interface FigureCatalog {
  figure_types: any;
  presets: any;
  themes?: any;
  variables: any;
  baselines?: any;
  baseline_options?: any;
}

export interface FigureRequest {
  figure_type: FigureTypeKey | string;
  region_name: string;
  country_code?: string;
  admin_level?: number;
  osm_id?: string | number | null;
  osm_type?: string | null;
  parent_chain?: string[];
  latitude?: number;
  longitude?: number;
  variable: string;
  start_year: number;
  end_year: number;
  start_date?: string | null;
  end_date?: string | null;
  grid_size?: number | null;
  baseline_period?: string;
  preset: AspectRatioPresetKey | string;
  theme: VisualThemeKey | string;
  format?: 'png' | 'svg' | 'pdf' | string;
  dpi?: number;
  vis_min?: number;
  vis_max?: number;
  climate_grid?: any[];
  rainfall_scale_mode?: RainfallScaleMode;
}

export interface FigureItem {
  id?: string;
  figure_type: FigureTypeKey | string;
  title: string;
  region_name: string;
  url: string;
  format: string;
  created_at?: string;
  metadata?: {
    trend?: string;
    baseline?: string;
    peak_anomaly?: string;
  };
}

// ── AI Climate Assistant Contracts ───────────────────────────────────────────

export type UILockState = 'idle' | 'streaming' | 'cooldown' | 'session_expired' | 'daily_quota';
export type MessageRole = 'user' | 'assistant' | 'system';
export type GuardrailType = 'blocked' | 'token_limit' | 'inactivity_expired' | 'daily_quota_exceeded' | 'error';
export type EndReason = 'token_limit' | 'inactivity_expired' | 'daily_quota_exceeded';

export interface ToolExecutionStep {
  id: string;
  tool: string;
  message: string;
  status: 'running' | 'completed';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  thoughts?: string[];
  figures?: FigureItem[];
  warnings?: string[];
  isGuardrail?: boolean;
  guardrailType?: GuardrailType;
  timestamp: string;
  toolSteps?: ToolExecutionStep[];
}

export interface ConversationThread {
  conversationId: string | null;
  messages: ChatMessage[];
  tokensUsed: number;
  tokenLimit: number;
  lastActivityTimestamp?: string;
  endedReason?: EndReason;
  endedAt?: string;
}

// ── SSE Event Stream Contracts ─────────────────────────────────────────────

export interface StatusSSEEvent {
  type: 'status';
  message: string;
  tool: string;
}

export interface ThoughtSSEEvent {
  type: 'thought';
  thought: string;
  iteration?: number;
}

export interface MapActionPayload {
  action: 'render_interactive_map';
  region_name: string;
  variable: string;
  aggregation_mode: 'mean' | 'max' | 'min';
  start_date: string;
  end_date: string;
  rainfall_scale_mode?: 'standard' | 'auto' | 'custom';
  rainfall_custom_min?: number;
  rainfall_custom_max?: number;
  bbox?: [number, number, number, number];
  lat?: number;
  lon?: number;
  country_code?: string;
  admin_level?: number;
  osm_id?: string | number | null;
  osm_type?: string | null;
  display_name?: string;
}

export interface ResultSSEEvent {
  type: 'result';
  answer: string;
  map_action?: MapActionPayload | null;
  thoughts?: string[];
  figures: FigureItem[];
  warnings: string[];
  tokens_used: number;
  token_limit: number;
  daily_tokens_used?: number;
  daily_token_limit?: number;
  conversation_id: string;
  conversation_expired?: boolean;
}

export interface BlockedSSEEvent {
  type: 'blocked';
  message: string;
}

export interface SessionExpiredSSEEvent {
  type: 'session_expired_notice';
  message: string;
  conversation_id?: string;
}

export interface ConversationEndedSSEEvent {
  type: 'conversation_ended';
  reason: 'token_limit' | 'inactivity_expired' | 'daily_quota_exceeded';
  message: string;
  tokens_used: number;
  token_limit: number;
}

export interface DailyQuotaExceededSSEEvent {
  type: 'daily_quota_exceeded';
  message: string;
  retry_after?: string;
  tokens_used?: number;
  token_limit?: number;
}

export interface ThoughtDeltaSSEEvent {
  type: 'thought_delta';
  delta: string;
}

export interface ContentDeltaSSEEvent {
  type: 'content_delta';
  delta: string;
}

export interface ErrorSSEEvent {
  type: 'error';
  message: string;
}

export type AgentSSEEvent =
  | StatusSSEEvent
  | ThoughtSSEEvent
  | ThoughtDeltaSSEEvent
  | ContentDeltaSSEEvent
  | ResultSSEEvent
  | BlockedSSEEvent
  | SessionExpiredSSEEvent
  | ConversationEndedSSEEvent
  | DailyQuotaExceededSSEEvent
  | ErrorSSEEvent;

export interface RateLimit429Response {
  error: 'rate_limited' | 'daily_quota_exceeded' | string;
  message?: string;
  retry_after: string; // ISO 8601 UTC timestamp
  tokens_used?: number;
  token_limit?: number;
}
