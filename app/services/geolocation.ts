import type { GeoCoordinates } from '~/types/weather';

export class GeolocationError extends Error {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED';

  constructor(code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED', message: string) {
    super(message);
    this.name = 'GeolocationError';
    this.code = code;
  }
}

/**
 * Requests the current GPS coordinates from the browser Geolocation API.
 * High accuracy is enabled with a reasonable timeout.
 */
export async function getBrowserCoordinates(): Promise<GeoCoordinates> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    throw new GeolocationError('UNSUPPORTED', 'Geolocation is not supported by your browser');
  }

  return new Promise<GeoCoordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new GeolocationError('PERMISSION_DENIED', 'Izin akses lokasi ditolak oleh pengguna.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new GeolocationError('POSITION_UNAVAILABLE', 'Informasi lokasi GPS tidak tersedia.'));
            break;
          case error.TIMEOUT:
            reject(new GeolocationError('TIMEOUT', 'Waktu permintaan lokasi GPS habis.'));
            break;
          default:
            reject(new GeolocationError('POSITION_UNAVAILABLE', error.message || 'Gagal mendapatkan lokasi.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000, // 1 minute cache
      }
    );
  });
}
