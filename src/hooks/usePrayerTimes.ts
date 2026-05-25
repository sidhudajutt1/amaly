import { useState, useEffect, useRef } from 'react';
import {
  calculatePrayerTimes,
  getNextPrayer,
  getCurrentPrayer,
  getTimeUntil,
} from '../services/prayerService';
import { useAppStore } from '../store/useAppStore';
import type { PrayerTimes, PrayerName } from '../types';

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

  // Track the date string prayer times were last calculated for (midnight recalculation)
  const calculatedForDate = useRef<string | null>(null);

  useEffect(() => {
    if (storeLoading) return;

    // No location confirmed yet — do not fall back to Makkah
    if (locationLat === undefined || locationLng === undefined) {
      setPrayerTimes(null);
      setNextPrayer(null);
      setCurrentPrayer(null);
      setCountdown(null);
      return;
    }

    const recalculate = (now: Date): PrayerTimes => {
      const times = calculatePrayerTimes(locationLat, locationLng, now, calculationMethod);
      setPrayerTimes(times);
      calculatedForDate.current = now.toDateString();
      return times;
    };

    const updatePrayerState = (times: PrayerTimes, now: Date) => {
      const next = getNextPrayer(times, now);
      const current = getCurrentPrayer(times, now);
      setNextPrayer(next);
      setCurrentPrayer(current);
      setCountdown(next ? getTimeUntil(next.time, now) : null);
    };

    const now = new Date();
    const times = recalculate(now);
    updatePrayerState(times, now);

    const intervalId = setInterval(() => {
      const tick = new Date();
      // Recalculate if the calendar date has changed (midnight rollover)
      const currentTimes = calculatedForDate.current !== tick.toDateString()
        ? recalculate(tick)
        : prayerTimes;
      if (currentTimes) updatePrayerState(currentTimes, tick);
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
