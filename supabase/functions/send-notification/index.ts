import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface NotificationRequest {
  expoPushToken?: string;
  userId?: string;
  title: string;
  body: string;
  route?: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData: NotificationRequest = await req.json();
    const { expoPushToken, userId, title, body, route, data } = requestData;

    // Get token from user if userId is provided instead of token
    let finalToken = expoPushToken;
    if (!finalToken && userId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: req.headers.get('Authorization')! },
          },
        }
      );

      const { data: userData, error } = await supabaseClient
        .from('users')
        .select('expo_push_token, notifications_enabled')
        .eq('id', userId)
        .single();

      if (error || !userData) {
        return new Response(
          JSON.stringify({ error: 'User not found or no token available' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!userData.notifications_enabled) {
        return new Response(
          JSON.stringify({ error: 'Notifications are disabled for this user' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      finalToken = userData.expo_push_token;
    }

    // Validate token
    if (!finalToken) {
      return new Response(
        JSON.stringify({ error: 'expoPushToken or userId is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build notification message
    const message = {
      to: finalToken,
      sound: 'default',
      title: title || 'Notification',
      body: body || '',
      data: {
        route: route || '/(tabs)/index',
        ...data,
      },
      priority: 'high',
      channelId: 'default',
    };

    // Send to Expo Push API
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    // Check for errors from Expo
    if (result.data && result.data[0]?.status === 'error') {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.data[0].message,
          details: result.data[0].details,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        result,
        message: 'Notification sent successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
