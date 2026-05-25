import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { resolveThemeColors, type ThemeColors, type ColorThemeName } from '../theme';

export function useTheme(): { theme: ThemeColors; isDark: boolean; colorTheme: ColorThemeName } {
  const themeMode = useAppStore((s) => s.settings.theme);
  const colorTheme = useAppStore((s) => s.settings.colorTheme) as ColorThemeName;
  const systemScheme = useColorScheme();

  const brightness: 'light' | 'dark' =
    themeMode === 'auto'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const resolved = colorTheme || 'emerald';

  return useMemo(() => ({
    theme: resolveThemeColors(resolved, brightness),
    isDark: brightness === 'dark',
    colorTheme: resolved,
  }), [resolved, brightness]);
}
