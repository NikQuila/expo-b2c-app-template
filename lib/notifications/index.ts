import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { updatePushToken, removePushToken } from '@/api/notifications';
import { User } from '@/utils/types';

/**
 * Configure notification handler - how notifications are displayed when app is in foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Get the Expo push token for this device
 */
async function getExpoPushToken(): Promise<string | null> {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '00d47109-9be4-4afe-9af3-14d654cb7d22',
    });
    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Register for push notifications and save token to database
 */
export async function registerForPushNotifications(
  user: User
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // 1. Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return {
        success: false,
        error: 'Notification permissions denied',
      };
    }

    // 2. Setup Android notification channel (required for Android)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#000000',
      });
    }

    // 3. Get push token
    const token = await getExpoPushToken();
    if (!token) {
      return {
        success: false,
        error: 'Failed to get push token',
      };
    }

    // 4. Save token to database
    const result = await updatePushToken(user.id, token);
    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      token,
    };
  } catch (error: any) {
    console.error('Error registering for push notifications:', error);
    return {
      success: false,
      error: error.message || 'Failed to register for push notifications',
    };
  }
}

/**
 * Unregister from push notifications
 */
export async function unregisterFromPushNotifications(
  user: User
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await removePushToken(user.id);
    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error unregistering from push notifications:', error);
    return {
      success: false,
      error: error.message || 'Failed to unregister from push notifications',
    };
  }
}

/**
 * Setup notification listeners for handling taps and deep linking
 */
export function setupNotificationListeners() {
  // Handle notification received while app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received in foreground:', notification);
      // You can show a custom UI here if needed
    }
  );

  // Handle notification tap - this is where we do deep linking
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped, data:', data);

      // Navigate to the specified route
      if (data.route) {
        router.push(data.route as any);
      }
    });

  // Return cleanup function
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
}

/**
 * Check current notification permission status
 */
export async function getNotificationPermissionStatus(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}
