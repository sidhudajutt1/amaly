import { Platform } from 'react-native';

export const fonts = {
  arabic: {
    regular: Platform.select({
      ios: 'Geeza Pro',
      android: 'noto-naskh-arabic',
      default: 'serif',
    }),
    bold: Platform.select({
      ios: 'Geeza Pro Bold',
      android: 'noto-naskh-arabic',
      default: 'serif',
    }),
  },
  urdu: {
    regular: Platform.select({
      ios: 'Noto Nastaliq Urdu',
      android: 'noto-nastaliq-urdu',
      default: 'serif',
    }),
  },
  latin: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
};

export const fontSizes = {
  quranArabic: 28,
  quranArabicLarge: 34,
  hadithArabic: 22,
  duaArabic: 24,
  translationDefault: 16,
  translationLarge: 18,
  heading1: 24,
  heading2: 20,
  heading3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tabLabel: 10,
  prayerBar: 13,
  streak: 32,
  bismillah: 26,
};

export const lineHeights = {
  arabic: 1.8,
  urdu: 2.0,
  latin: 1.6,
  tight: 1.3,
};
