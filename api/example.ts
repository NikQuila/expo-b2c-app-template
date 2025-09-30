import { supabase } from './supabase';
import { ApiResponse } from '@/utils/types';

// Example API call using Supabase
export async function fetchUserData(userId: string): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error: (error as Error).message };
  }
}