import { Alert, Platform, Share } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { t } from '../i18n';
import type { Language } from '../types';
import { useAppStore } from '../store/useAppStore';

const MIN_DAYS_BEFORE_PROMPT = 3;
const STREAK_FAST_TRACK = 7;
const COOLDOWN_DAYS = 90;

function daysBetween(iso: string, now = Date.now()): number {
  return (now - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function getShareAmalyMessage(language: Language): string {
  return t(language, 'support.shareMessage');
}

export async function shareAmaly(language: Language): Promise<void> {
  await Share.share({
    message: getShareAmalyMessage(language),
    title: t(language, 'common.appName'),
  });
}

/** User-initiated (Settings / Support screen) — always allowed. */
export async function requestAppReview(language: Language): Promise<void> {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    await StoreReview.requestReview();
    return;
  }
  Alert.alert(t(language, 'support.rateApp'), t(language, 'support.rateUnavailable'));
}

export function shouldPromptReview(): boolean {
  if (Platform.OS === 'web') return false;
  const { firstOpenAt, lastReviewPromptAt, reviewDeclinedUntil, streakData, todayProgress } = useAppStore.getState();
  if (!todayProgress.niyyahCompleted) return false;

  const now = Date.now();
  if (reviewDeclinedUntil && now < new Date(reviewDeclinedUntil).getTime()) return false;
  if (lastReviewPromptAt && daysBetween(lastReviewPromptAt, now) < COOLDOWN_DAYS) return false;

  const daysUsed = firstOpenAt ? daysBetween(firstOpenAt, now) : 0;
  const streakOk = streakData.currentStreak >= STREAK_FAST_TRACK;
  const tenureOk = daysUsed >= MIN_DAYS_BEFORE_PROMPT;
  return tenureOk || streakOk;
}

export function maybeAskForReview(language: Language): void {
  if (!shouldPromptReview()) return;

  const mark = useAppStore.getState().markReviewPrompted;
  Alert.alert(t(language, 'support.ratePromptTitle'), t(language, 'support.ratePromptMessage'), [
    {
      text: t(language, 'support.notNow'),
      style: 'cancel',
      onPress: () => mark(true),
    },
    {
      text: t(language, 'support.rateApp'),
      onPress: () => {
        mark(false);
        void requestAppReview(language);
      },
    },
  ]);
}
