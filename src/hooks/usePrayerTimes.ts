import { useState, useEffect } from 'react';
import {
  calculatePrayerTimes,
  getNextPrayer,
  getCurrentPrayer,
  getTimeUntil,
} from '../services/prayerService';
import { useAppStore } from '../store/useAppStore';
import type { PrayerTimes, PrayerName, CalculationMethod } from '../types';

const DEFAULT_LAT = 21.4225;
const DEFAULT_LNG = 39.8262;

export function usePrayerTimes(): {
  prayerTimes: PrayerTimes | null;
  nextPrayer: { name: PrayerName | 'sunrise'; time: Date } | null;
  currentPrayer: PrayerName | 'sunrise' | null;
  countdown: { hours: number; minutes: number } | null;
  isLoading: boolean;
} {
  const calculationMethod = useAppStore((s) => s.settings.calculationMethod);
  const locationLat = useAppStore((s) => s.settings.locationLat);
  const locationLng = useAppStore((s) => s.settings.locationLng);
  const storeLoading = useAppStore((s) => s.isLoading);

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{
    name: PrayerName | 'sunrise';
    time: Date;
  } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | 'sunrise' | null>(null);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    if (storeLoading) return;

    const lat = locationLat ?? DEFAULT_LAT;
    const lng = locationLng ?? DEFAULT_LNG;
    const today = new Date();

    const times = calculatePrayerTimes(lat, lng, today, calculationMethod);
    setPrayerTimes(times);

    const updatePrayerState = (now: Date) => {
      const next = getNextPrayer(times, now);
      const current = getCurrentPrayer(times, now);
      setNextPrayer(next);
      setCurrentPrayer(current);
      setCountdown(next ? getTimeUntil(next.time, now) : null);
    };

    updatePrayerState(new Date());

    const intervalId = setInterval(() => {
      const now = new Date();
      updatePrayerState(now);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [storeLoading, locationLat, locationLng, calculationMethod]);

  return {
    prayerTimes,
    nextPrayer,
    currentPrayer,
    countdown,
    isLoading: storeLoading,
  };
}
