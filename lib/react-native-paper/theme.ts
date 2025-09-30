import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Minimal Black & White Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000000',
    onPrimary: '#FFFFFF',
    primaryContainer: '#000000',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#4A4A4A',
    secondaryContainer: '#000000',
    onSecondaryContainer: '#FFFFFF',
    onSecondary: '#FFFFFF',
    tertiary: '#757575',
    error: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#FFFFFF',
    elevation: {
      level0: '#FFFFFF',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
    outline: '#E0E0E0',
    onBackground: '#000000',
    onSurface: '#000000',
    onSurfaceVariant: '#4A4A4A',
  },
  roundness: 12,
};

// Minimal Black & White Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFFFFF',
    onPrimary: '#000000',
    primaryContainer: '#FFFFFF',
    onPrimaryContainer: '#000000',
    secondary: '#B8B8B8',
    secondaryContainer: '#FFFFFF',
    onSecondaryContainer: '#000000',
    onSecondary: '#000000',
    tertiary: '#8E8E8E',
    error: '#FFFFFF',
    background: '#000000',
    surface: '#000000',
    surfaceVariant: '#0A0A0A',
    elevation: {
      level0: '#000000',
      level1: '#0A0A0A',
      level2: '#121212',
      level3: '#1A1A1A',
      level4: '#1F1F1F',
      level5: '#242424',
    },
    outline: '#2A2A2A',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B8B8B8',
  },
  roundness: 12,
};

export type AppTheme = typeof lightTheme;
