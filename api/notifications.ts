import { supabase } from './supabase';
import { User, ApiResponse } from '@/utils/types';

/**
 * Update user's expo push token
 */
export async function updatePushToken(
  userId: string,
  expoPushToken: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        expo_push_token: expoPushToken,
        notifications_enabled: true,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to update push token',
    };
  }
}

/**
 * Remove user's expo push token (disable notifications)
 */
export async function removePushToken(
  userId: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        expo_push_token: null,
        notifications_enabled: false,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to remove push token',
    };
  }
}

/**
 * Toggle notifications on/off
 */
export async function toggleNotifications(
  userId: string,
  enabled: boolean
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        notifications_enabled: enabled,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to toggle notifications',
    };
  }
}