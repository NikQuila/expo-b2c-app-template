import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/lib/sheets';
import '@/lib/i18n';
import { setupNotificationListeners } from '@/lib/notifications';
import { autoUpdateOnStart } from '@/lib/updates';

import { lightTheme, darkTheme, useColorScheme } from '@/lib/react-native-paper';

// Importaciones condicionales para Google Sign-In
const isDevelopment = process.env.NODE_ENV === 'development';
let GoogleSignin: any;

if (!isDevelopment) {
  // Solo importar en producción
  const GoogleSignInPackage = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSignInPackage.GoogleSignin;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Setup notification listeners on mount
  useEffect(() => {
    const cleanup = setupNotificationListeners();
    return cleanup;
  }, []);

  // Check for updates on mount (runs automatically and silently)
  useEffect(() => {
    autoUpdateOnStart();
  }, []);

  // Configure Google Sign-In
  useEffect(() => {
    if (GoogleSignin) {
      // TODO: Replace with your actual Google Cloud Client IDs
      // Get these from: https://console.cloud.google.com/apis/credentials
      GoogleSignin.configure({
        webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com', // REPLACE THIS with your Web Client ID
        iosClientId: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com', // REPLACE THIS with your iOS Client ID (optional, for iOS)
        offlineAccess: true,
      });
    }
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SheetProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </SheetProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
