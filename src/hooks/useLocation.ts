import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import {
  requestLocationPermission,
  getCurrentLocation,
  getDefaultLocation,
} from '../services/locationService';

export function useLocation() {
  const locationLat = useAppStore((s) => s.settings.locationLat);
  const locationLng = useAppStore((s) => s.settings.locationLng);
  const locationName = useAppStore((s) => s.settings.locationName);
  const locationAutoDetect = useAppStore((s) => s.settings.locationAutoDetect);
  const setLocation = useAppStore((s) => s.setLocation);
  const setLocationAutoDetect = useAppStore((s) => s.setLocationAutoDetect);
  const storeLoading = useAppStore((s) => s.isLoading);

  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const detectLocation = useCallback(async () => {
    if (Platform.OS === 'web') {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude, 'Detected Location');
          setLocationAutoDetect?.(true);
          return true;
        } catch {
          setPermissionDenied(true);
          return false;
        }
      }
      return false;
    }

    setIsDetecting(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        setPermissionDenied(true);
        if (!locationLat) {
          const def = getDefaultLocation();
          setLocation(def.lat, def.lng, `${def.cityName}, ${def.countryName}`);
        }
        setIsDetecting(false);
        return false;
      }

      const result = await getCurrentLocation();
      if (result) {
        setLocation(result.lat, result.lng, `${result.cityName}, ${result.countryName}`);
        setLocationAutoDetect?.(true);
        setIsDetecting(false);
        return true;
      }
    } catch {
      // Silent fail
    }

    if (!locationLat) {
      const def = getDefaultLocation();
      setLocation(def.lat, def.lng, `${def.cityName}, ${def.countryName}`);
    }
    setIsDetecting(false);
    return false;
  }, [locationLat, setLocation, setLocationAutoDetect]);

  useEffect(() => {
    if (storeLoading) return;
    if (!locationLat && locationAutoDetect !== false) {
      detectLocation();
    }
  }, [storeLoading, locationLat, locationAutoDetect, detectLocation]);

  return useMemo(() => ({
    lat: locationLat ?? 21.4225,
    lng: locationLng ?? 39.8262,
    locationName: locationName ?? 'Makkah, Saudi Arabia',
    isDetecting,
    permissionDenied,
    detectLocation,
    locationAutoDetect: locationAutoDetect ?? true,
  }), [locationLat, locationLng, locationName, isDetecting, permissionDenied, detectLocation, locationAutoDetect]);
}
