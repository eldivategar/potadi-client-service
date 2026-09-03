import { ref, onMounted, onUnmounted } from 'vue';
import type {
  DiseaseRiskLevel,
  DiseaseRiskResult,
  GeoCoordinates,
  LocationInfo,
  NormalizedWeatherData,
  WeatherStateStatus,
} from '~/types/weather';
import { getBrowserCoordinates, GeolocationError } from '~/services/geolocation';
import { reverseGeocodeCoordinates, formatCoordinatesFallback } from '~/services/reverseGeocoding';
import { fetchOpenMeteoWeather, OpenMeteoError } from '~/services/openMeteo';
import { calculateOverallRisk } from '~/utils/diseaseRisk';

// Shared singleton state so navigation across /app preserves loaded telemetry
const status = ref<WeatherStateStatus>('IDLE');
const coordinates = ref<GeoCoordinates | null>(null);
const location = ref<LocationInfo | null>(null);
const currentWeather = ref<NormalizedWeatherData['current'] | null>(null);
const elevation = ref<number | null>(null);
const lateBlight = ref<DiseaseRiskResult | null>(null);
const earlyBlight = ref<DiseaseRiskResult | null>(null);
const overallScore = ref<number>(0);
const overallLevel = ref<DiseaseRiskLevel>('LOW');
const dominantDisease = ref<'lateBlight' | 'earlyBlight' | null>(null);
const currentRiskLevel = ref<DiseaseRiskLevel>('LOW');
const forecastRiskLevel24h = ref<DiseaseRiskLevel>('LOW');
const lastUpdated = ref<Date | null>(null);
const isRefreshing = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;
let isListeningLifecycle = false;

export function useWeather() {
  /**
   * Main function to request GPS coordinates and fetch weather + disease risk data.
   */
  async function requestLocationAndFetch(forceRefreshCoordinates = false) {
    if (isRefreshing.value && status.value === 'LOADING') return;

    errorMessage.value = null;
    isRefreshing.value = true;

    // 1. Acquire GPS coordinates if missing or forced
    if (!coordinates.value || forceRefreshCoordinates) {
      status.value = 'REQUESTING_LOCATION';
      try {
        const coords = await getBrowserCoordinates();
        coordinates.value = coords;
      } catch (err: any) {
        isRefreshing.value = false;
        if (err instanceof GeolocationError && err.code === 'PERMISSION_DENIED') {
          status.value = 'PERMISSION_DENIED';
          errorMessage.value = 'Izin lokasi peramban belum diaktifkan. Mohon izinkan akses GPS untuk menampilkan telemetri mikroiklim lahan Anda.';
        } else {
          status.value = 'PERMISSION_DENIED';
          errorMessage.value = err.message || 'Gagal memperoleh koordinat GPS dari perangkat Anda.';
        }
        return;
      }
    }

    const currentCoords = coordinates.value;
    if (!currentCoords) {
      isRefreshing.value = false;
      status.value = 'PERMISSION_DENIED';
      return;
    }

    status.value = 'LOADING';

    // 2. Fetch Reverse Geocoding in parallel without blocking Weather API
    reverseGeocodeCoordinates(currentCoords)
      .then((loc) => {
        location.value = loc;
      })
      .catch(() => {
        location.value = formatCoordinatesFallback(currentCoords);
      });

    // 3. Fetch Open-Meteo Weather Data
    try {
      const weatherData = await fetchOpenMeteoWeather(currentCoords);

      currentWeather.value = weatherData.current;
      elevation.value = weatherData.elevation ?? null;

      // 4. Evaluate Disease Risk Engine
      const riskEvaluation = calculateOverallRisk(
        weatherData.current,
        weatherData.hourlyNext24h
      );

      lateBlight.value = riskEvaluation.lateBlight;
      earlyBlight.value = riskEvaluation.earlyBlight;
      overallScore.value = riskEvaluation.overallScore;
      overallLevel.value = riskEvaluation.overallLevel;
      dominantDisease.value = riskEvaluation.dominantDisease;
      currentRiskLevel.value = riskEvaluation.currentRiskLevel;
      forecastRiskLevel24h.value = riskEvaluation.forecastRiskLevel24h;

      lastUpdated.value = new Date();
      status.value = 'SUCCESS';
    } catch (err: any) {
      console.error('[useWeather] Error fetching Open-Meteo weather:', err);
      status.value = 'UNAVAILABLE';
      currentWeather.value = null;
      lateBlight.value = null;
      earlyBlight.value = null;
      errorMessage.value =
        err instanceof OpenMeteoError
          ? err.message
          : 'Data cuaca dan risiko mikroiklim sementara tidak dapat diakses.';
    } finally {
      isRefreshing.value = false;
    }
  }

  /**
   * Manual refresh trigger.
   */
  async function refreshWeather() {
    await requestLocationAndFetch(false);
  }

  /**
   * Visibility change handler: auto-refresh if tab becomes active and last update is > 10 min old.
   */
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && coordinates.value) {
      const tenMinutesMs = 10 * 60 * 1000;
      const shouldRefresh =
        !lastUpdated.value || Date.now() - lastUpdated.value.getTime() > tenMinutesMs;
      if (shouldRefresh) {
        refreshWeather();
      }
    }
  }

  /**
   * Attaches auto-refresh interval (12 mins) and visibility listener.
   */
  function initLifecycle() {
    if (typeof window === 'undefined') return;

    if (!isListeningLifecycle) {
      isListeningLifecycle = true;
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Auto-refresh every 12 minutes
      refreshIntervalId = setInterval(() => {
        if (coordinates.value && document.visibilityState === 'visible') {
          refreshWeather();
        }
      }, 12 * 60 * 1000);
    }
  }

  return {
    // State
    status,
    coordinates,
    location,
    currentWeather,
    elevation,
    lateBlight,
    earlyBlight,
    overallScore,
    overallLevel,
    dominantDisease,
    currentRiskLevel,
    forecastRiskLevel24h,
    lastUpdated,
    isRefreshing,
    errorMessage,

    // Actions
    requestLocationAndFetch,
    refreshWeather,
    initLifecycle,
  };
}
