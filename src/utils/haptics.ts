import { Platform, Vibration } from 'react-native';

export function hapticLight() {
  if (Platform.OS === 'web') return;
  Vibration.vibrate(5);
}

export function hapticMedium() {
  if (Platform.OS === 'web') return;
  Vibration.vibrate(10);
}

export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  Vibration.vibrate([0, 8, 60, 12]);
}

export function hapticHeavy() {
  if (Platform.OS === 'web') return;
  Vibration.vibrate(20);
}
