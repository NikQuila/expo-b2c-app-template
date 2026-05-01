# Expo Updates - Comandos Listos (SDK 55)

> ⚠️ **SDK 55**: `eas update` ahora requiere el flag `--environment`.
> Valores: `development` | `preview` | `production`.

## ⚙️ Cómo funciona

El proyecto está configurado con `updates.checkAutomatically: "ON_LOAD"` en `app.json`.
Eso significa que **expo-updates revisa, descarga y aplica updates solo** cada vez que se abre la app — no necesitas código adicional.

Solo publicas el update con `eas update ...` y los usuarios lo reciben en el siguiente launch.

## 🚀 Setup Inicial (una sola vez)

```bash
# 1. Login en EAS
eas login

# 2. Configurar el proyecto (ya hecho en este repo)
eas update:configure
```

## 📦 Publicar Updates

### Development (testing)
```bash
eas update --branch development --environment development --message "Testing new features"
```

### Preview (pre-production)
```bash
eas update --branch preview --environment preview --message "Ready for QA testing"
```

### Production (usuarios finales)
```bash
eas update --branch production --environment production --message "Bug fixes and improvements"
```

## 🔍 Ver Updates Publicados

```bash
# Todos los updates
eas update:list

# Por branch
eas update:list --branch production --limit 10
```

## ↩️ Rollback

```bash
# Listar updates para identificar al cual hacer rollback
eas update:list --branch production

# Rollback al update anterior
eas update:rollback --branch production

# Rollback a un update específico
eas update:rollback --branch production --group <update-group-id>
```

## 🏗️ Build (cuando cambias código nativo)

Solo necesitas hacer build cuando:
- Cambias dependencias nativas
- Cambias configuración en `app.json` que afecta nativo
- Cambias assets nativos (icons, splash)
- Primera vez que deployeas

```bash
# Development
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview
eas build --profile preview --platform all

# Production
eas build --profile production --platform all
```

## 📱 Workflow Típico

### 1. Desarrollo diario (solo updates OTA)
```bash
# Después de cambiar código JS/TS:
eas update --branch development --environment development --message "Added new button"
# La app se actualiza sola al reabrirse
```

### 2. Pre-producción
```bash
eas update --branch preview --environment preview --message "New feature: dark mode"
```

### 3. Production release
```bash
eas update --branch production --environment production --message "v1.1.0: New features"
```

### 4. Emergency rollback
```bash
eas update:rollback --branch production
```

## 🚀 Hermes Bytecode Diffing (SDK 55+)

SDK 55 introduce **bytecode diffing**: los updates descargan ~75% más rápido al enviar solo el diff binario en lugar del bytecode completo. Es opt-in en SDK 55 y será default en SDK 56.

Para activarlo:

```bash
# Activar en EAS para tu proyecto
eas update:configure --bytecode-diffing
```

## 🎯 Tips

```bash
# Ver info del proyecto
eas project:info

# Ver builds
eas build:list

# Ver updates
eas update:list
```

## 🔧 Troubleshooting

```bash
# Verificar que el update se publicó
eas update:list --branch development

# Verificar configuración del app.json
cat app.json | grep -A 5 "updates"

# Si algo sale mal en producción
eas update:rollback --branch production
```

## ⚡ Resumen rápido

```bash
# Publicar a development
eas update --branch development --environment development --message "Tu mensaje"

# Publicar a production
eas update --branch production --environment production --message "Tu mensaje"

# Rollback de emergencia
eas update:rollback --branch production
```
