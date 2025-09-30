import { useColorScheme as useRNColorScheme } from 'react-native';
import { useStore } from '@/store';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme() as 'light' | 'dark';
  const { themeMode } = useStore();

  // If user has set a preference, use it. Otherwise use system preference
  if (themeMode === 'light' || themeMode === 'dark') {
    return themeMode;
  }

  // Default to system preference
  return systemColorScheme ?? 'light';
}

export function useClientOnlyValue<T>(server: T, client: T): T {
  return client;
}