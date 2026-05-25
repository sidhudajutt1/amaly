import {
  PrayerTimes,
  CalculationMethod,
  Coordinates,
  Madhab,
} from 'adhan';
import type {
  PrayerTimes as AppPrayerTimes,
  PrayerName,
  CalculationMethod as AppCalcMethod,
} from '../types';

type AdhanParams = ReturnType<typeof CalculationMethod.MuslimWorldLeague>;

function getAdhanMethod(method: AppCalcMethod): AdhanParams {
  const methods: Record<AppCalcMethod, () => AdhanParams> = {
    MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
    Egyptian: () => CalculationMethod.Egyptian(),
    Karachi: () => CalculationMethod.Karachi(),
    UmmAlQura: () => CalculationMethod.UmmAlQura(),
    Dubai: () => CalculationMethod.Dubai(),
    MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
    NorthAmerica: () => CalculationMethod.NorthAmerica(),
    Kuwait: () => CalculationMethod.Kuwait(),
    Qatar: () => CalculationMethod.Qatar(),
    Singapore: () => CalculationMethod.Singapore(),
    Turkey: () => CalculationMethod.Turkey(),
    Tehran: () => CalculationMethod.Tehran(),
  };
  return methods[method]();
}

function getMadhabForMethod(method: AppCalcMethod): typeof Madhab.Hanafi | typeof Madhab.Shafi {
  const hanafiMethods: AppCalcMethod[] = ['Karachi', 'Turkey', 'MoonsightingCommittee'];
  return hanafiMethods.includes(method) ? Madhab.Hanafi : Madhab.Shafi;
}

export function calculatePrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  method: AppCalcMethod
): AppPrayerTimes {
  const coordinates = new Coordinates(lat, lng);
  const params = getAdhanMethod(method);
  params.madhab = getMadhabForMethod(method);
  const prayers = new PrayerTimes(coordinates, date, params);

  return {
    fajr: prayers.fajr,
    sunrise: prayers.sunrise,
    dhuhr: prayers.dhuhr,
    asr: prayers.asr,
    maghrib: prayers.maghrib,
    isha: prayers.isha,
  };
}

export function getNextPrayer(
  prayerTimes: AppPrayerTimes,
  now: Date
): { name: PrayerName | 'sunrise'; time: Date } | null {
  const ordered: { name: PrayerName | 'sunrise'; time: Date }[] = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of ordered) {
    if (prayer.time > now) {
      return prayer;
    }
  }
  return null;
}

export function getCurrentPrayer(
  prayerTimes: AppPrayerTimes,
  now: Date
): PrayerName | 'sunrise' | null {
  const ordered: { name: PrayerName | 'sunrise'; time: Date }[] = [
    { name: 'isha', time: prayerTimes.isha },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'fajr', time: prayerTimes.fajr },
  ];

  for (const prayer of ordered) {
    if (now >= prayer.time) {
      return prayer.name;
    }
  }
  return null;
}

export function formatTime(date: Date, is24Hour: boolean = false): string {
  if (is24Hour) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getTimeUntil(target: Date, now: Date): { hours: number; minutes: number } {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return { hours: 0, minutes: 0 };
  const totalMinutes = Math.floor(diffMs / 60000);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

export function getQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const phiK = (kaabaLat * Math.PI) / 180.0;
  const lambdaK = (kaabaLng * Math.PI) / 180.0;
  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lng * Math.PI) / 180.0;

  const bearing =
    (Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    ) *
      180.0) /
    Math.PI;

  return (bearing + 360) % 360;
}

export function getDistanceToMakkah(lat: number, lng: number): number {
  const R = 6371;
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const dLat = ((kaabaLat - lat) * Math.PI) / 180;
  const dLon = ((kaabaLng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((kaabaLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function calculateQiyamTime(maghrib: Date, fajr: Date): Date {
  let fajrMs = fajr.getTime();
  const maghribMs = maghrib.getTime();
  if (fajrMs < maghribMs) {
    fajrMs += 24 * 60 * 60 * 1000;
  }
  const nightDuration = fajrMs - maghribMs;
  const lastThirdStart = maghribMs + (nightDuration * 2 / 3);
  return new Date(lastThirdStart);
}

export function getRamadanTimes(prayerTimes: AppPrayerTimes): {
  suhoorEnd: Date;
  iftarTime: Date;
} {
  return {
    suhoorEnd: prayerTimes.fajr,
    iftarTime: prayerTimes.maghrib,
  };
}
