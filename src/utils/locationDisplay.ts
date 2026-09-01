import { t } from '../i18n';
import type { Language } from '../types';

/** Legacy label stored by web geolocation before i18n polish. */
export const LEGACY_DETECTED_LOCATION = 'Detected Location';

export function formatLocationName(
  name: string | null | undefined,
  language: Language,
): string {
  if (!name || name === LEGACY_DETECTED_LOCATION) {
    return t(language, 'location.detected');
  }
  return name;
}

export function formatDistanceKm(km: number, language: Language): string {
  const unit = t(language, 'common.km');
  return `${km} ${unit}`;
}
