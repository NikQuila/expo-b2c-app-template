# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile app built with **Expo** and **Expo Router** for navigation. The app uses **Supabase** for authentication and backend, with features including push notifications, OTA updates, internationalization, and a dark/light theme system.

**Tech Stack:**
- **Expo** (v54) with Expo Router for file-based routing
- **React Native** (v0.81)
- **TypeScript**
- **Supabase** for auth and database
- **Zustand** for state management (with AsyncStorage persistence)
- **React Native Paper** for UI components (Material Design 3)
- **i18next** for internationalization (English/Spanish)
- **Moti** for animations
- **Expo Notifications** for push notifications
- **Expo Updates** for OTA updates

## Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Architecture

### Navigation Structure

The app uses **Expo Router** (file-based routing):

```
app/
├── index.tsx                 # Root redirect (checks auth state)
├── _layout.tsx              # Root layout (theme provider, notification listeners)
├── welcome.tsx              # Initial welcome screen
├── login.tsx                # Login screen
├── register.tsx             # Registration screen
├── onboarding-step1.tsx     # Onboarding: name input
├── onboarding-step2.tsx     # Onboarding: gender selection
├── onboarding-step3.tsx     # Onboarding: goals selection
└── (tabs)/
    ├── _layout.tsx          # Tab navigation layout
    ├── index.tsx            # Home tab
    └── two.tsx              # Settings tab
```

### State Management

**Zustand store** (`store/index.ts`) with AsyncStorage persistence:
- User data (from Supabase)
- Language preference (`en` | `es`)
- Theme mode (`light` | `dark` | `system`)
- Auth state

### Authentication Flow

1. User registers/logs in → Supabase Auth
2. User data stored in `users` table (linked by `auth_id`)
3. Session saved to AsyncStorage
4. On app launch: check AsyncStorage → restore session → fetch user data
5. Redirect to onboarding if incomplete, else to tabs

**Key files:**
- `api/auth.ts` - Auth API calls
- `api/users.ts` - User CRUD
- `lib/hooks/useAuth.ts` - Auth hook
- `lib/storage/auth-storage.ts` - Session persistence

### Theming System

**Custom black & white theme** with Material Design 3:
- Light theme: white background, black primary
- Dark theme: black background, white primary
- User can override system preference (stored in Zustand)

**Key files:**
- `lib/react-native-paper/theme.ts` - Theme definitions
- `lib/react-native-paper/hooks.ts` - `useColorScheme()` hook (reads from store)
- All screens use `useTheme()` from react-native-paper for dynamic colors

### Push Notifications

**Expo Notifications** integrated with Supabase:
- Tokens stored in `users.expo_push_token`
- Auto-register on login/onboarding completion
- Deep linking support (navigate on tap)
- Edge function for sending: `supabase/functions/send-notification/`

**Key files:**
- `lib/notifications/index.ts` - Permission handling, registration
- `api/notifications.ts` - Token management API
- Settings screen has toggle to enable/disable

### OTA Updates

**Expo Updates** configured for automatic silent updates:
- Checks on every app launch (`ON_LOAD`)
- Three channels: `development`, `preview`, `production`
- Updates apply automatically without user prompt
- EAS project ID: `00d47109-9be4-4afe-9af3-14d654cb7d22`

**Key files:**
- `lib/updates/index.ts` - Update logic
- `app.json` - Updates configuration
- `eas.json` - Build profiles and channels
- `EXPO_UPDATES_COMMANDS.md` - Deployment commands reference

### Internationalization

**i18next** with two languages: English (default) and Spanish
- Language stored in Zustand and AsyncStorage
- All user-facing strings use `t()` from `useTranslation()`
- Language toggle in settings screen

**Key files:**
- `lib/i18n/en/index.ts` - English translations
- `lib/i18n/es/index.ts` - Spanish translations
- `lib/i18n/index.ts` - i18n setup

### Database Schema (Supabase)

**`users` table:**
```sql
- id: uuid (primary key)
- auth_id: uuid (references auth.users)
- email: text
- name: text
- last_name: text
- birth_date: text
- onboarding_completed: boolean
- expo_push_token: text
- notifications_enabled: boolean
- created_at: timestamp
```

## Publishing Updates

To publish OTA updates, use EAS CLI (see `EXPO_UPDATES_COMMANDS.md` for full reference):

```bash
# Development
eas update --branch development --message "Your message"

# Production
eas update --branch production --message "Your message"

# Rollback if needed
eas update:rollback --branch production
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add Supabase credentials:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Configure Google Sign-In client ID in `app.json` (line 53)

## Key Conventions

- **All screens use theme colors** via `useTheme()` - never hardcode colors
- **Animations** use Moti for smooth transitions
- **Action sheets** use `react-native-actions-sheet` (registered in `lib/sheets.ts`)
- **Date picker** uses native `@react-native-community/datetimepicker`
- **SafeAreaView** used on all screens with appropriate edges
- **Loading states** managed with local state and disabled buttons
- **Error handling** shows `Alert.alert()` for user-facing errors

## Important Notes

- New Architecture is **enabled** (`newArchEnabled: true` in app.json)
- Push notifications require platform-specific setup (APNs for iOS, FCM for Android)
- Updates only work in production builds (not in development/Expo Go)
- Theme changes are instant (no app restart needed)
- All user data synced with Supabase on every update