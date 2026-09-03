import type { GeoCoordinates, HourlyPoint, NormalizedWeatherData } from '~/types/weather';

export class OpenMeteoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenMeteoError';
  }
}

/**
 * Normalizes raw Open-Meteo API response into clean, typed structures.
 * Filters the hourly dataset to the next 24 hours starting from the current hour.
 */
function normalizeOpenMeteoResponse(data: any): NormalizedWeatherData {
  if (!data || !data.current || !data.hourly || !Array.isArray(data.hourly.time)) {
    throw new OpenMeteoError('Format data Open-Meteo tidak valid.');
  }

  const current = {
    temperature: typeof data.current.temperature_2m === 'number' ? data.current.temperature_2m : 0,
    humidity: typeof data.current.relative_humidity_2m === 'number' ? data.current.relative_humidity_2m : 0,
    precipitation: typeof data.current.precipitation === 'number' ? data.current.precipitation : 0,
    rain: typeof data.current.rain === 'number' ? data.current.rain : (data.current.precipitation || 0),
    dewPoint: typeof data.current.dew_point_2m === 'number' ? data.current.dew_point_2m : 0,
    weatherCode: typeof data.current.weather_code === 'number' ? data.current.weather_code : 0,
    windSpeed: typeof data.current.wind_speed_10m === 'number' ? data.current.wind_speed_10m : 0,
  };

  const times: string[] = data.hourly.time;
  const temps: number[] = data.hourly.temperature_2m || [];
  const hums: number[] = data.hourly.relative_humidity_2m || [];
  const precips: number[] = data.hourly.precipitation || [];
  const rains: number[] = data.hourly.rain || precips;
  const dewPoints: number[] = data.hourly.dew_point_2m || [];
  const weatherCodes: number[] = data.hourly.weather_code || [];

  // Locate current time index or first future hour
  const currentTimeStr = data.current.time || '';
  let startIndex = times.findIndex((t) => t >= currentTimeStr);
  if (startIndex === -1) {
    startIndex = 0;
  }

  const hourlyNext24h: HourlyPoint[] = [];
  const maxPoints = Math.min(24, times.length - startIndex);

  for (let i = 0; i < maxPoints; i++) {
    const idx = startIndex + i;
    hourlyNext24h.push({
      time: times[idx] || '',
      temperature: temps[idx] ?? current.temperature,
      humidity: hums[idx] ?? current.humidity,
      precipitation: precips[idx] ?? 0,
      rain: rains[idx] ?? 0,
      dewPoint: dewPoints[idx] ?? current.dewPoint,
      weatherCode: weatherCodes[idx] ?? 0,
    });
  }

  return {
    current,
    hourlyNext24h,
    elevation: typeof data.elevation === 'number' ? Math.round(data.elevation) : undefined,
  };
}

/**
 * Fetches real-time weather and 24-hour forecast from Open-Meteo Forecast API.
 */
export async function fetchOpenMeteoWeather(coords: GeoCoordinates): Promise<NormalizedWeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', coords.latitude.toString());
  url.searchParams.set('longitude', coords.longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m'
  );
  url.searchParams.set(
    'hourly',
    'temperature_2m,relative_humidity_2m,precipitation,rain,dew_point_2m,weather_code'
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '2');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new OpenMeteoError(`Open-Meteo mengembalikan respons HTTP ${res.status}`);
    }

    const data = await res.json();
    return normalizeOpenMeteoResponse(data);
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new OpenMeteoError('Permintaan data cuaca Open-Meteo memakan waktu terlalu lama (timeout).');
    }
    if (error instanceof OpenMeteoError) {
      throw error;
    }
    throw new OpenMeteoError(error.message || 'Gagal menghubungi server Open-Meteo.');
  }
}
