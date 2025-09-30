import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { getSession } from '@/api/auth';
import { getUserByAuthId } from '@/api/users';
import { useStore } from '@/store';
import { saveUser, getUser as getStoredUser } from '@/lib/storage/auth-storage';

export function useSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUser, user } = useStore();

  /**
   * Check if user has an active session
   */
  const checkSession = async () => {
    try {
      setIsLoading(true);

      // 1. Check Supabase session
      const sessionResult = await getSession();

      if (sessionResult.error || !sessionResult.data) {
        // No session, redirect to welcome
        setIsAuthenticated(false);
        setUser(null);
        return { authenticated: false, redirectTo: '/(auth)/welcome' };
      }

      // 2. Always fetch fresh user data from DB
      const userResult = await getUserByAuthId(sessionResult.data.user.id);

      if (userResult.error || !userResult.data) {
        setIsAuthenticated(false);
        setUser(null);
        return { authenticated: false, redirectTo: '/(auth)/welcome' };
      }

      const dbUser = userResult.data;

      // 3. Update AsyncStorage with fresh data
      await saveUser(dbUser);

      // 4. Update store
      setUser(dbUser);
      setIsAuthenticated(true);

      // 5. Determine redirect based on onboarding status
      if (!dbUser.onboarding_completed) {
        return { authenticated: true, redirectTo: '/(onboarding)/step1' };
      }

      return { authenticated: true, redirectTo: '/(tabs)' };
    } catch (error) {
      console.error('Session check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return { authenticated: false, redirectTo: '/(auth)/welcome' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize session on mount
   */
  useEffect(() => {
    checkSession();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    checkSession,
    user,
  };
}