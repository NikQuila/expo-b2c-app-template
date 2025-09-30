import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  return useRNColorScheme() as 'light' | 'dark';
}

export function useClientOnlyValue<T>(server: T, client: T): T {
  return client;
}