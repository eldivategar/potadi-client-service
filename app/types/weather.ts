/**
 * Type definitions for Weather Telemetry & Potato Disease Risk Engine
 * Scientific limitation: Weather-based disease risk estimation, not plant disease diagnosis.
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  displayName: string;
  suburbOrLocality?: string;
  city?: string;
  stateOrRegion?: string;
  isCoordinatesFallback: boolean;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  dewPoint: number;
  weatherCode: number;
}

export interface NormalizedWeatherData {
  current: {
    temperature: number;
    humidity: number;
    precipitation: number;
    rain: number;
    dewPoint: number;
    weatherCode: number;
    windSpeed: number;
  };
  hourlyNext24h: HourlyPoint[];
  elevation?: number;
}

export type DiseaseRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface DiseaseRiskResult {
  diseaseName: 'lateBlight' | 'earlyBlight';
  score: number; // 0–100
  level: DiseaseRiskLevel;
  favorableHours: number;
  factors: {
    temperatureScore: number;
    humidityScore: number;
    precipitationScore: number;
    durationScore: number;
  };
  recommendation: string;
  recommendationKey?: string;
}

export type WeatherStateStatus =
  | 'IDLE'
  | 'REQUESTING_LOCATION'
  | 'LOADING'
  | 'SUCCESS'
  | 'PERMISSION_DENIED'
  | 'UNAVAILABLE';

export interface WeatherDiseaseRiskPayload {
  status: WeatherStateStatus;
  coordinates: GeoCoordinates | null;
  location: LocationInfo | null;
  currentWeather: NormalizedWeatherData['current'] | null;
  elevation: number | null;
  lateBlight: DiseaseRiskResult | null;
  earlyBlight: DiseaseRiskResult | null;
  overallScore: number;
  overallLevel: DiseaseRiskLevel;
  dominantDisease: 'lateBlight' | 'earlyBlight' | null;
  currentRiskLevel: DiseaseRiskLevel;
  forecastRiskLevel24h: DiseaseRiskLevel;
  lastUpdated: Date | null;
  errorMessage: string | null;
}
