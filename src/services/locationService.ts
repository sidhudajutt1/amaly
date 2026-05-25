import * as Location from 'expo-location';

export interface LocationResult {
  lat: number;
  lng: number;
  cityName: string;
  countryName: string;
  countryCode: string;
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function checkLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  try {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;
    const geocode = await reverseGeocode(latitude, longitude);

    return {
      lat: latitude,
      lng: longitude,
      cityName: geocode.city,
      countryName: geocode.country,
      countryCode: geocode.countryCode,
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; country: string; countryCode: string }> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results.length > 0) {
      const place = results[0];
      return {
        city: place.city || place.subregion || place.region || 'Unknown',
        country: place.country || 'Unknown',
        countryCode: place.isoCountryCode || '',
      };
    }
  } catch {
    // Geocoding failed — return defaults
  }
  return { city: 'Unknown', country: 'Unknown', countryCode: '' };
}

const DEFAULT_LOCATIONS: Record<string, LocationResult> = {
  makkah: { lat: 21.4225, lng: 39.8262, cityName: 'Makkah', countryName: 'Saudi Arabia', countryCode: 'SA' },
  madinah: { lat: 24.4672, lng: 39.6024, cityName: 'Madinah', countryName: 'Saudi Arabia', countryCode: 'SA' },
  riyadh: { lat: 24.7136, lng: 46.6753, cityName: 'Riyadh', countryName: 'Saudi Arabia', countryCode: 'SA' },
  cairo: { lat: 30.0444, lng: 31.2357, cityName: 'Cairo', countryName: 'Egypt', countryCode: 'EG' },
  istanbul: { lat: 41.0082, lng: 28.9784, cityName: 'Istanbul', countryName: 'Turkey', countryCode: 'TR' },
  karachi: { lat: 24.8607, lng: 67.0011, cityName: 'Karachi', countryName: 'Pakistan', countryCode: 'PK' },
  lahore: { lat: 31.5204, lng: 74.3587, cityName: 'Lahore', countryName: 'Pakistan', countryCode: 'PK' },
  jakarta: { lat: -6.2088, lng: 106.8456, cityName: 'Jakarta', countryName: 'Indonesia', countryCode: 'ID' },
  dhaka: { lat: 23.8103, lng: 90.4125, cityName: 'Dhaka', countryName: 'Bangladesh', countryCode: 'BD' },
  london: { lat: 51.5074, lng: -0.1278, cityName: 'London', countryName: 'United Kingdom', countryCode: 'GB' },
};

export function getDefaultLocations(): LocationResult[] {
  return Object.values(DEFAULT_LOCATIONS);
}

export function getDefaultLocation(): LocationResult {
  return DEFAULT_LOCATIONS.makkah;
}
