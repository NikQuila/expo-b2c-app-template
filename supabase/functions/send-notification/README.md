# Send Notification Edge Function

Edge function para enviar notificaciones push usando Expo Push Notifications.

## Características

- ✅ Enviar notificaciones con `expoPushToken` directamente
- ✅ Enviar notificaciones con `userId` (busca el token automáticamente)
- ✅ Deep linking automático con `route` parameter
- ✅ Verifica si el usuario tiene notificaciones habilitadas
- ✅ CORS habilitado
- ✅ Manejo de errores completo

## Deployment

```bash
# Deploy la función
supabase functions deploy send-notification

# Deploy con environment variables (si es necesario)
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_ANON_KEY=your-key
```

## Uso

### Opción 1: Con Token Directo

```typescript
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: {
    expoPushToken: 'ExponentPushToken[xxx]',
    title: 'Nueva tarea',
    body: 'Tienes una tarea pendiente',
    route: '/(tabs)/index',
    data: {
      taskId: '123',
      priority: 'high'
    }
  }
})
```

### Opción 2: Con User ID

```typescript
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: {
    userId: 'user-uuid-here',
    title: 'Bienvenido!',
    body: 'Gracias por registrarte',
    route: '/(tabs)/index'
  }
})
```

## Request Body

```typescript
interface NotificationRequest {
  expoPushToken?: string;  // Token directo (opcional si provees userId)
  userId?: string;         // User ID para buscar token (opcional si provees expoPushToken)
  title: string;           // Título de la notificación (requerido)
  body: string;            // Mensaje de la notificación (requerido)
  route?: string;          // Ruta para deep linking (opcional, default: '/(tabs)/index')
  data?: object;           // Data adicional (opcional)
}
```

## Response

### Success:
```json
{
  "success": true,
  "result": {
    "data": [
      {
        "status": "ok",
        "id": "notification-id"
      }
    ]
  },
  "message": "Notification sent successfully"
}
```

### Error:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Ejemplos de Uso

### Desde un Database Webhook

```sql
-- Crear webhook cuando se inserta una tarea
CREATE OR REPLACE FUNCTION notify_new_task()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/send-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := json_build_object(
        'userId', NEW.user_id,
        'title', 'Nueva tarea',
        'body', NEW.title,
        'route', '/(tabs)/index',
        'data', json_build_object('taskId', NEW.id)
      )::jsonb
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_task_created
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_task();
```

### Desde tu aplicación

```typescript
import { supabase } from '@/api/supabase';

// Enviar notificación a un usuario específico
async function notifyUser(userId: string, message: string) {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      userId,
      title: 'Notificación',
      body: message,
      route: '/(tabs)/index'
    }
  });

  if (error) {
    console.error('Error sending notification:', error);
  }

  return data;
}
```

## Testing Localmente

```bash
# Correr la función localmente
supabase functions serve send-notification

# Test con curl
curl -X POST http://localhost:54321/functions/v1/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "userId": "user-uuid",
    "title": "Test",
    "body": "This is a test",
    "route": "/(tabs)/index"
  }'
```

## Notas

- La función verifica automáticamente si el usuario tiene `notifications_enabled: true`
- Si provees `userId`, no necesitas el `expoPushToken`
- El `route` por defecto es `/(tabs)/index` si no lo especificas
- Puedes agregar data adicional en el campo `data` para tu app