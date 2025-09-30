import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithGoogle, signInWithApple } from '@/api/auth';
import { getUserByAuthId, createUser } from '@/api/users';
import { useStore } from '@/store';
import { saveUser } from '@/lib/storage/auth-storage';
import { registerForPushNotifications } from '@/lib/notifications';
import { useTranslation } from 'react-i18next';

// Importaciones condicionales para Google Sign-In
const isDevelopment = process.env.NODE_ENV === 'development';
let GoogleSignin: any;
let statusCodes: any;

if (!isDevelopment) {
  // Solo importar en producción
  const GoogleSignInPackage = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSignInPackage.GoogleSignin;
  statusCodes = GoogleSignInPackage.statusCodes;
}

export function useOAuthAuth() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useStore();

  /**
   * Handle Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    // Check if Google Sign-In is available
    if (!GoogleSignin) {
      Alert.alert(
        'Not Available',
        'Google Sign-In is only available in production builds. Please use email/password for development.'
      );
      return;
    }

    try {
      setIsLoading(true);

      // 1. Check if Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices();

      // 2. Sign in with Google and get the ID token
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert('Error', t('auth.errors.googleSignInFailed'));
        return;
      }

      // 3. Sign in to Supabase with the Google ID token
      const authResult = await signInWithGoogle(idToken);

      if (authResult.error || !authResult.data) {
        Alert.alert('Error', authResult.error || t('auth.errors.googleSignInFailed'));
        return;
      }

      // 4. Get or create user in database
      let userResult = await getUserByAuthId(authResult.data.user.id);

      if (userResult.error || !userResult.data) {
        // User doesn't exist, create new user
        const email = userInfo.data?.user?.email || authResult.data.user.email;
        const name = userInfo.data?.user?.givenName || undefined;
        const lastName = userInfo.data?.user?.familyName || undefined;

        const createResult = await createUser(authResult.data.user.id, email, name, lastName);

        if (createResult.error || !createResult.data) {
          Alert.alert('Error', createResult.error || t('auth.errors.googleSignInFailed'));
          return;
        }

        userResult = { data: createResult.data };
      }

      // 5. Save user to store and storage
      if (userResult.data) {
        setUser(userResult.data);
        await saveUser(userResult.data);

        // 6. Register for push notifications if onboarding completed
        if (userResult.data.onboarding_completed) {
          registerForPushNotifications(userResult.data).catch((err) => {
            console.error('Failed to register for push notifications:', err);
          });
        }

        // 7. Navigate based on onboarding status
        if (userResult.data.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/step1');
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in
        Alert.alert('Info', t('auth.errors.googleSignInCancelled'));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in is already in progress
        Alert.alert('Info', 'Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Google Play Services not available
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        Alert.alert('Error', t('auth.errors.googleSignInFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Apple Sign-In (iOS only)
   */
  const handleAppleSignIn = async () => {
    try {
      // 1. Check if Apple Authentication is available (iOS 13+)
      if (Platform.OS !== 'ios') {
        Alert.alert('Error', t('auth.errors.appleNotAvailable'));
        return;
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', t('auth.errors.appleNotAvailable'));
        return;
      }

      setIsLoading(true);

      // 2. Sign in with Apple and get credentials
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        Alert.alert('Error', t('auth.errors.appleSignInFailed'));
        return;
      }

      // 3. Sign in to Supabase with the Apple ID token
      const authResult = await signInWithApple(credential.identityToken);

      if (authResult.error || !authResult.data) {
        Alert.alert('Error', authResult.error || t('auth.errors.appleSignInFailed'));
        return;
      }

      // 4. Get or create user in database
      let userResult = await getUserByAuthId(authResult.data.user.id);

      if (userResult.error || !userResult.data) {
        // User doesn't exist, create new user
        const email = credential.email || authResult.data.user.email;
        const name = credential.fullName?.givenName || undefined;
        const lastName = credential.fullName?.familyName || undefined;

        const createResult = await createUser(authResult.data.user.id, email, name, lastName);

        if (createResult.error || !createResult.data) {
          Alert.alert('Error', createResult.error || t('auth.errors.appleSignInFailed'));
          return;
        }

        userResult = { data: createResult.data };
      }

      // 5. Save user to store and storage
      if (userResult.data) {
        setUser(userResult.data);
        await saveUser(userResult.data);

        // 6. Register for push notifications if onboarding completed
        if (userResult.data.onboarding_completed) {
          registerForPushNotifications(userResult.data).catch((err) => {
            console.error('Failed to register for push notifications:', err);
          });
        }

        // 7. Navigate based on onboarding status
        if (userResult.data.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/step1');
        }
      }
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);

      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User cancelled the sign-in
        Alert.alert('Info', t('auth.errors.appleSignInCancelled'));
      } else {
        Alert.alert('Error', t('auth.errors.appleSignInFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    handleAppleSignIn,
    isLoading,
  };
}
