import { Redirect } from 'expo-router';

/** Legacy route — all settings live on the tab screen. */
export default function SettingsRedirect() {
  return <Redirect href="/(tabs)/settings" />;
}
