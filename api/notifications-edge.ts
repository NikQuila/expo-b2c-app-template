import { supabase } from './supabase';

interface SendNotificationParams {
  userId?: string;
  expoPushToken?: string;
  title: string;
  body: string;
  route?: string;
  data?: Record<string, any>;
}

interface NotificationResponse {
  success: boolean;
  error?: string;
  result?: any;
}

/**
 * Send push notification using Supabase Edge Function
 */
export async function sendPushNotification(
  params: SendNotificationParams
): Promise<NotificationResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: params,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to send notification',
      };
    }

    return {
      success: true,
      result: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send notification',
    };
  }
}

/**
 * Send notification to a specific user by userId
 */
export async function sendNotificationToUser(
  userId: string,
  title: string,
  body: string,
  route?: string,
  data?: Record<string, any>
): Promise<NotificationResponse> {
  return sendPushNotification({
    userId,
    title,
    body,
    route,
    data,
  });
}

/**
 * Send notification using expoPushToken directly
 */
export async function sendNotificationToToken(
  expoPushToken: string,
  title: string,
  body: string,
  route?: string,
  data?: Record<string, any>
): Promise<NotificationResponse> {
  return sendPushNotification({
    expoPushToken,
    title,
    body,
    route,
    data,
  });
}