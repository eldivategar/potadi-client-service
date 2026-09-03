import type { GeoCoordinates, LocationInfo } from '~/types/weather';

// In-memory cache keyed by rounded coordinates (approx ~1km resolution)
const locationCache = new Map<string, LocationInfo>();

/**
 * Generates a cache key based on coordinates rounded to 2 decimal places.
 */
function getCacheKey(coords: GeoCoordinates): string {
  return `${coords.latitude.toFixed(2)},${coords.longitude.toFixed(2)}`;
}

/**
 * Generates a fallback location label using formatted coordinates.
 */
export function formatCoordinatesFallback(coords: GeoCoordinates): LocationInfo {
  const latDir = coords.latitude >= 0 ? 'LU' : 'LS';
  const lngDir = coords.longitude >= 0 ? 'BT' : 'BB';
  const formattedLat = Math.abs(coords.latitude).toFixed(2);
  const formattedLng = Math.abs(coords.longitude).toFixed(2);

  return {
    displayName: `${formattedLat}° ${latDir}, ${formattedLng}° ${lngDir}`,
    isCoordinatesFallback: true,
  };
}

/**
 * Calls BigDataCloud Free Client-Side Reverse Geocoding API directly from the browser.
 * Non-blocking: If request fails or times out, gracefully falls back to coordinate string.
 */
export async function reverseGeocodeCoordinates(coords: GeoCoordinates): Promise<LocationInfo> {
  const cacheKey = getCacheKey(coords);
  const cached = locationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', coords.latitude.toString());
    url.searchParams.set('longitude', coords.longitude.toString());
    url.searchParams.set('localityLanguage', 'id');

    const res = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`BigDataCloud returned HTTP ${res.status}`);
    }

    const data = await res.json();

    const locality = data.locality || data.suburb || '';
    const city = data.city || data.district || '';
    const region = data.principalSubdivision || data.countryName || '';

    let displayName = '';
    if (locality && city && locality !== city) {
      displayName = `${locality}, ${city}`;
    } else if (locality || city) {
      displayName = locality || city;
      if (region && !displayName.includes(region)) {
        displayName += `, ${region}`;
      }
    } else if (region) {
      displayName = region;
    } else {
      displayName = `${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°`;
    }

    const locationInfo: LocationInfo = {
      displayName,
      suburbOrLocality: locality || undefined,
      city: city || undefined,
      stateOrRegion: region || undefined,
      isCoordinatesFallback: false,
    };

    locationCache.set(cacheKey, locationInfo);
    return locationInfo;
  } catch (error) {
    console.warn('[ReverseGeocoding] BigDataCloud call failed, falling back to coordinates:', error);
    const fallback = formatCoordinatesFallback(coords);
    return fallback;
  }
}
