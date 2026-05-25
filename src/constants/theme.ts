import { I18nManager, Platform } from 'react-native';

export const Colors = {
  primary: '#1B6B4A',
  primaryLight: '#2D9B6A',
  primaryDark: '#0F4A33',

  secondary: '#C8A951',
  secondaryLight: '#E5D08A',
  secondaryDark: '#8A7535',

  background: '#FAFAF7',
  backgroundDark: '#121518',
  surface: '#FFFFFF',
  surfaceDark: '#1E2228',
  card: '#F5F5F0',
  cardDark: '#262B33',

  text: '#1A1A1A',
  textDark: '#F0F0E8',
  textSecondary: '#6B6B6B',
  textSecondaryDark: '#9A9A9A',
  textArabic: '#2C2C2C',
  textArabicDark: '#E8E8E0',

  accent: '#D4A853',
  success: '#2D9B6A',
  warning: '#E5A100',
  error: '#C0392B',

  border: '#E8E8E0',
  borderDark: '#333840',
  divider: '#F0EDE5',
  dividerDark: '#2A2F37',

  streak: '#FF8C42',
  bookmark: '#C8A951',
  completed: '#2D9B6A',
} as const;

export const Typography = {
  arabicPrimary: 'Amiri',
  arabicSecondary: 'ScheherazadeNew',
  urduPrimary: 'NotoNastaliqUrdu',
  latinPrimary: 'Inter',
  latinSecondary: 'System',

  sizes: {
    arabicAyah: 28,
    arabicHadith: 22,
    arabicDua: 24,
    arabicSmall: 18,
    heading: 24,
    subheading: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    streakNumber: 36,
    tabLabel: 11,
  },

  lineHeights: {
    arabic: 2.0,
    urdu: 2.0,
    latin: 1.6,
    tight: 1.3,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 20,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Shadows = Platform.select({
  web: {
    sm: { boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' },
    md: { boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    lg: { boxShadow: '0px 4px 16px rgba(0,0,0,0.12)' },
  },
  default: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
})!;

export const isRTL = () => I18nManager.isRTL;

export type ThemeMode = 'light' | 'dark';

export const getColors = (mode: ThemeMode) => ({
  primary: Colors.primary,
  primaryLight: Colors.primaryLight,
  primaryDark: Colors.primaryDark,
  secondary: Colors.secondary,
  secondaryLight: Colors.secondaryLight,
  background: mode === 'light' ? Colors.background : Colors.backgroundDark,
  surface: mode === 'light' ? Colors.surface : Colors.surfaceDark,
  card: mode === 'light' ? Colors.card : Colors.cardDark,
  text: mode === 'light' ? Colors.text : Colors.textDark,
  textSecondary: mode === 'light' ? Colors.textSecondary : Colors.textSecondaryDark,
  textArabic: mode === 'light' ? Colors.textArabic : Colors.textArabicDark,
  accent: Colors.accent,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  border: mode === 'light' ? Colors.border : Colors.borderDark,
  divider: mode === 'light' ? Colors.divider : Colors.dividerDark,
  streak: Colors.streak,
  bookmark: Colors.bookmark,
  completed: Colors.completed,
});
