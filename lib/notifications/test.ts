import * as Notifications from 'expo-notifications';

/**
 * Send a test local notification
 * Useful for testing notification UI and deep linking
 */
export async function sendTestNotification(route?: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification 🔔',
        body: route
          ? `Tap to navigate to: ${route}`
          : 'This is a test notification',
        data: route ? { route } : {},
        sound: true,
      },
      trigger: {
        seconds: 1,
      },
    });

    console.log('Test notification scheduled');
    return { success: true };
  } catch (error: any) {
    console.error('Error sending test notification:', error);
    return {
      success: false,
      error: error.message || 'Failed to send test notification',
    };
  }
}

/**
 * Send a test notification that navigates to the home tab
 */
export async function testNotificationToHome() {
  return sendTestNotification('/(tabs)/index');
}

/**
 * Send a test notification that navigates to the settings tab
 */
export async function testNotificationToSettings() {
  return sendTestNotification('/(tabs)/two');
}

/**
 * Send a test notification that opens a modal
 */
export async function testNotificationToModal() {
  return sendTestNotification('/modal');
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling notifications:', error);
    return {
      success: false,
      error: error.message || 'Failed to cancel notifications',
    };
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications);
    return { success: true, notifications };
  } catch (error: any) {
    console.error('Error getting scheduled notifications:', error);
    return {
      success: false,
      error: error.message || 'Failed to get scheduled notifications',
    };
  }
}