import { useFonts } from 'expo-font';
import { Platform } from 'react-native';
import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';

export function useFontsLoaded(): boolean {
  const [loaded] = useFonts({
    AmiriQuran: AmiriQuran_400Regular,
    Amiri: Amiri_400Regular,
    AmiriBold: Amiri_700Bold,
    PDMSSaleemQuran: require('../../assets/fonts/pdms-saleem-quranfont.ttf'),
    NotoNastaliqUrdu: NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrduBold: NotoNastaliqUrdu_700Bold,
  });
  // Web: don't block navigation on font load (avoids spinner flash on route changes in dev).
  if (Platform.OS === 'web') return true;
  return loaded;
}

export const FONT_QURAN_MUSHAF = 'AmiriQuran';
export const FONT_QURAN_INDOPAK = 'PDMSSaleemQuran';
export const FONT_ARABIC_NASKH = 'Amiri';
export const FONT_ARABIC_NASKH_BOLD = 'AmiriBold';
export const FONT_URDU_NASTALIQ = 'NotoNastaliqUrdu';
export const FONT_URDU_NASTALIQ_BOLD = 'NotoNastaliqUrduBold';
