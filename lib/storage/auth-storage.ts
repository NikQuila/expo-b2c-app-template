import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@app:user';
const SESSION_KEY = '@app:session';

/**
 * Save user data to AsyncStorage
 */
export async function saveUser(user: any): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

/**
 * Get user data from AsyncStorage
 */
export async function getUser(): Promise<any | null> {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Remove user data from AsyncStorage
 */
export async function removeUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

/**
 * Save session flag to AsyncStorage
 */
export async function saveSession(hasSession: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(hasSession));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Get session flag from AsyncStorage
 */
export async function getSession(): Promise<boolean> {
  try {
    const sessionData = await AsyncStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : false;
  } catch (error) {
    console.error('Error getting session:', error);
    return false;
  }
}

/**
 * Clear all auth data
 */
export async function clearAuthStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([USER_KEY, SESSION_KEY]);
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
}