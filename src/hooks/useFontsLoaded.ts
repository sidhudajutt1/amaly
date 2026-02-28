import { useFonts } from 'expo-font';
import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';

export function useFontsLoaded(): boolean {
  const [loaded] = useFonts({
    AmiriQuran: AmiriQuran_400Regular,
    NotoNastaliqUrdu: NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrduBold: NotoNastaliqUrdu_700Bold,
  });
  return loaded;
}

export const FONT_QURAN_MUSHAF = 'AmiriQuran';
export const FONT_URDU_NASTALIQ = 'NotoNastaliqUrdu';
export const FONT_URDU_NASTALIQ_BOLD = 'NotoNastaliqUrduBold';
