# Expo Updates - Comandos Listos

## 🚀 Setup Inicial (una sola vez)

```bash
# 1. Login en EAS (si no lo has hecho)
eas login

# 2. Configurar el proyecto (si no está configurado)
eas build:configure
```

## 📦 Publicar Updates

### Development (testing)
```bash
# Publicar update al canal development
eas update --branch development --message "Testing new features"

# Con changelog más detallado
eas update --branch development --message "Fixed login bug, improved performance"
```

### Preview (pre-production)
```bash
# Publicar update al canal preview
eas update --branch preview --message "Ready for QA testing"
```

### Production (usuarios finales)
```bash
# Publicar update al canal production
eas update --branch production --message "Bug fixes and improvements"

# Con mensaje más descriptivo
eas update --branch production --message "v1.0.1: Fixed notifications, improved UX"
```

## 🔍 Ver Updates Publicados

```bash
# Ver todos los updates
eas update:list

# Ver updates de un branch específico
eas update:list --branch production

# Ver con más detalle
eas update:list --branch production --limit 10
```

## ↩️ Rollback (volver a versión anterior)

```bash
# Ver updates para saber a cuál hacer rollback
eas update:list --branch production

# Hacer rollback
eas update:rollback --branch production

# Hacer rollback a un update específico
eas update:rollback --branch production --group <update-group-id>
```

## 🏗️ Build (cuando cambias código nativo)

Solo necesitas hacer build cuando:
- Cambias dependencias nativas
- Cambias configuración en app.json/app.config.js
- Cambias assets nativos
- Primera vez que deployeas

```bash
# Build development
eas build --profile development --platform android
eas build --profile development --platform ios

# Build preview
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Build production
eas build --profile production --platform android
eas build --profile production --platform ios

# Build ambas plataformas
eas build --profile production --platform all
```

## 📱 Workflow Típico

### 1. Primera vez (setup completo)
```bash
# Build inicial
eas build --profile development --platform android

# Instalar en tu dispositivo
# El QR code o link te lo da EAS después del build
```

### 2. Desarrollo diario (solo updates OTA)
```bash
# Haces cambios en tu código
# No cambias nada nativo

# Publicas el update
eas update --branch development --message "Added new button"

# La app se actualiza sola al abrirse!
```

### 3. Pre-producción
```bash
# Cuando terminas features
eas update --branch preview --message "New feature: dark mode"

# QA team prueba
# Si todo OK, pasas a production
```

### 4. Production release
```bash
# Publicar a usuarios finales
eas update --branch production --message "v1.1.0: New features and bug fixes"

# Usuarios reciben el update automáticamente!
```

### 5. Emergency rollback
```bash
# Si algo sale mal en production
eas update:rollback --branch production

# Usuarios vuelven a la versión anterior automáticamente
```

## 🎯 Tips

### Ver información del proyecto
```bash
# Ver configuración actual
eas project:info

# Ver builds
eas build:list

# Ver updates
eas update:list
```

### Testing local
```bash
# Probar en desarrollo (Expo Go)
npx expo start

# Probar con build de desarrollo
# Instala el .apk o .ipa del build development
# Los updates funcionarán automáticamente
```

### Configurar variables de entorno
```bash
# Si necesitas env vars en tus updates
eas update --branch production --message "Update" \
  --env MY_VAR=value
```

## ⚡ Flujo Rápido (día a día)

```bash
# 1. Haces cambios en tu código
# 2. Publicas:
eas update --branch development --message "Quick fix"

# 3. La app se actualiza sola en ~5 segundos al abrirse
# ¡Listo! No más App Store/Play Store reviews
```

## 🔧 Troubleshooting

### Si el update no aparece:
```bash
# Verificar que se publicó
eas update:list --branch development

# Verificar la configuración
cat app.json | grep -A 5 "updates"

# Force reload en la app
# Cierra y abre la app de nuevo
```

### Si algo no funciona:
```bash
# Rollback inmediato
eas update:rollback --branch development

# Ver logs
eas build:list
eas update:list
```

## 📊 Monitoreo

```bash
# Ver cuántos usuarios tienen cada versión
eas update:list --branch production

# Ver estadísticas
eas project:info
```

## 🎉 Resumen

**Para desarrollo:**
```bash
eas update --branch development --message "Tu mensaje"
```

**Para production:**
```bash
eas update --branch production --message "Tu mensaje"
```

**Si algo sale mal:**
```bash
eas update:rollback --branch production
```

¡Eso es todo! Con estos comandos tienes todo lo que necesitas para manejar updates en tu app.