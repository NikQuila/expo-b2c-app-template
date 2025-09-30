import { useState } from 'react';
import { router } from 'expo-router';
import { signUp as apiSignUp, signIn as apiSignIn, signOut as apiSignOut } from '@/api/auth';
import { createUser, getUserByAuthId } from '@/api/users';
import { useStore } from '@/store';
import { saveUser, clearAuthStorage } from '@/lib/storage/auth-storage';
import { registerForPushNotifications } from '@/lib/notifications';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useStore();

  /**
   * Register a new user
   */
  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Create auth user
      const authResult = await apiSignUp(email, password);

      if (authResult.error) {
        setError(authResult.error);
        return { success: false, error: authResult.error };
      }

      if (!authResult.data) {
        setError('Registration failed');
        return { success: false, error: 'Registration failed' };
      }

      // 2. Create user in users table (name, last_name, birth_date will be filled in onboarding)
      const userResult = await createUser(
        authResult.data.user.id,
        email
      );

      if (userResult.error) {
        setError(userResult.error);
        return { success: false, error: userResult.error };
      }

      // 3. Save user to store and storage
      if (userResult.data) {
        setUser(userResult.data);
        await saveUser(userResult.data);

        // 4. Navigate to onboarding
        router.replace('/(onboarding)/step1');
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login existing user
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Sign in with Supabase
      const authResult = await apiSignIn(email, password);

      if (authResult.error) {
        setError(authResult.error);
        return { success: false, error: authResult.error };
      }

      if (!authResult.data) {
        setError('Login failed');
        return { success: false, error: 'Login failed' };
      }

      // 2. Get user from users table
      const userResult = await getUserByAuthId(authResult.data.user.id);

      if (userResult.error) {
        setError(userResult.error);
        return { success: false, error: userResult.error };
      }

      // 3. Save user to store and storage
      if (userResult.data) {
        setUser(userResult.data);
        await saveUser(userResult.data);

        // 4. Register for push notifications (async, don't wait)
        if (userResult.data.onboarding_completed) {
          registerForPushNotifications(userResult.data).catch((err) => {
            console.error('Failed to register for push notifications:', err);
          });
        }

        // 5. Navigate based on onboarding status
        if (userResult.data.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/step1');
        }
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Sign out from Supabase
      await apiSignOut();

      // 2. Clear user from store and storage
      setUser(null);
      await clearAuthStorage();

      // 3. Navigate to welcome
      router.replace('/(auth)/welcome');

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    isLoading,
    error,
    setError,
  };
}