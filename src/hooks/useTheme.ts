import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { colors, type ThemeColors } from '../theme';

export function useTheme(): { theme: ThemeColors; isDark: boolean } {
  const themeMode = useAppStore((s) => s.settings.theme);
  const systemScheme = useColorScheme();

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'auto'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  return {
    theme: colors[resolvedTheme],
    isDark: resolvedTheme === 'dark',
  };
}
