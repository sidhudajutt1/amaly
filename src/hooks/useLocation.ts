import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import {
  requestLocationPermission,
  getCurrentLocation,
  getDefaultLocation,
} from '../services/locationService';
import { LEGACY_DETECTED_LOCATION } from '../utils/locationDisplay';
import type { CalculationMethod } from '../types';

// Map ISO country codes to the most-used calculation method in that country.
const COUNTRY_METHOD_MAP: Record<string, CalculationMethod> = {
  SA: 'UmmAlQura',   // Saudi Arabia
  AE: 'Dubai',       // UAE
  KW: 'Kuwait',      // Kuwait
  QA: 'Qatar',       // Qatar
  EG: 'Egyptian',    // Egypt
  PK: 'Karachi',     // Pakistan
  IN: 'Karachi',     // India (same standard)
  BD: 'Karachi',     // Bangladesh
  TR: 'Turkey',      // Turkey
  IR: 'Tehran',      // Iran
  SG: 'Singapore',   // Singapore
  MY: 'Singapore',   // Malaysia (uses same angle)
  ID: 'Singapore',   // Indonesia
  US: 'NorthAmerica',// USA
  CA: 'NorthAmerica',// Canada
  AU: 'MuslimWorldLeague',
  GB: 'MuslimWorldLeague',
};

export function useLocation() {
  const locationLat = useAppStore((s) => s.settings.locationLat);
  const locationLng = useAppStore((s) => s.settings.locationLng);
  const locationName = useAppStore((s) => s.settings.locationName);
  const locationAutoDetect = useAppStore((s) => s.settings.locationAutoDetect);
  const setLocation = useAppStore((s) => s.setLocation);
  const setLocationAutoDetect = useAppStore((s) => s.setLocationAutoDetect);
  const setCalculationMethod = useAppStore((s) => s.setCalculationMethod);
  const currentMethod = useAppStore((s) => s.settings.calculationMethod);
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
          setLocation(latitude, longitude, LEGACY_DETECTED_LOCATION);
          setLocationAutoDetect?.(true);
          return true;
        } catch {
          setPermissionDenied(true);
          setLocationAutoDetect?.(false);
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
        setLocationAutoDetect?.(false);
        setIsDetecting(false);
        return false;
      }

      const result = await getCurrentLocation();
      if (result) {
        setLocation(result.lat, result.lng, `${result.cityName}, ${result.countryName}`);
        setLocationAutoDetect?.(true);
        // Auto-set calculation method if still on default and we know the country
        if (currentMethod === 'MuslimWorldLeague' && result.countryCode) {
          const suggestedMethod = COUNTRY_METHOD_MAP[result.countryCode.toUpperCase()];
          if (suggestedMethod) setCalculationMethod(suggestedMethod);
        }
        setIsDetecting(false);
        return true;
      }
    } catch {
      // Detection failed — do not silently assign Makkah
    }

    setIsDetecting(false);
    return false;
  }, [locationLat, setLocation, setLocationAutoDetect]);

  useEffect(() => {
    if (storeLoading) return;
    if (locationLat !== undefined) return;

    const applyDefault = () => {
      const def = getDefaultLocation();
      setLocation(def.lat, def.lng, `${def.cityName}, ${def.countryName}`);
    };

    if (locationAutoDetect === false) {
      applyDefault();
      return;
    }

    detectLocation().then((ok) => {
      if (!ok && useAppStore.getState().settings.locationLat === undefined) {
        applyDefault();
      }
    });
  }, [storeLoading, locationLat, locationAutoDetect, detectLocation, setLocation]);

  return useMemo(() => ({
    lat: locationLat ?? 21.4225,
    lng: locationLng ?? 39.8262,
    locationName: locationName ?? null,
    locationDetected: locationLat !== undefined,
    isDetecting,
    permissionDenied,
    detectLocation,
    locationAutoDetect: locationAutoDetect ?? true,
  }), [locationLat, locationLng, locationName, isDetecting, permissionDenied, detectLocation, locationAutoDetect]);
}
