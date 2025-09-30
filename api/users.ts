import { supabase } from './supabase';
import { User, ApiResponse } from '@/utils/types';

/**
 * Create a new user in the users table
 */
export async function createUser(
  authId: string,
  email: string,
  name?: string,
  lastName?: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_id: authId,
        email,
        name: name || null,
        last_name: lastName || null,
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to create user',
    };
  }
}

/**
 * Get user by auth_id
 */
export async function getUserByAuthId(
  authId: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to get user',
    };
  }
}

/**
 * Get user by id
 */
export async function getUserById(userId: string): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to get user',
    };
  }
}

/**
 * Update user data
 */
export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'auth_id' | 'email'>>
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to update user',
    };
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(
  userId: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to complete onboarding',
    };
  }
}

/**
 * Delete user (soft delete or hard delete depending on your needs)
 */
export async function deleteUser(userId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) throw error;

    return { data: null };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to delete user',
    };
  }
}