import { supabase } from './supabase';
import { ApiResponse } from '@/utils/types';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string
): Promise<ApiResponse<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (!data.session) {
      return {
        error: 'Email confirmation required. Please check your inbox.',
      };
    }

    return {
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user!.id,
          email: data.user!.email!,
        },
      },
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to sign up',
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
        },
      },
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to sign in',
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { data: null };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to sign out',
    };
  }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<ApiResponse<AuthSession | null>> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!data.session) {
      return { data: null };
    }

    return {
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.session.user.id,
          email: data.session.user.email!,
        },
      },
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to get session',
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (session: AuthSession | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      callback({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: {
          id: session.user.id,
          email: session.user.email!,
        },
      });
    } else {
      callback(null);
    }
  });
}