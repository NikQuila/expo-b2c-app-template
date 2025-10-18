# React Native Expo App Template

A production-ready React Native mobile application built with Expo, featuring authentication, push notifications, OTA updates, internationalization, and a customizable theme system.

## Features

- **Authentication** - Complete auth flow with Supabase (email/password, social login)
- **Onboarding** - Multi-step user onboarding with data collection
- **Push Notifications** - Expo Notifications with deep linking support
- **OTA Updates** - Automatic silent updates with Expo Updates
- **Internationalization** - Multi-language support (English/Spanish) with i18next
- **Theme System** - Light/Dark mode with Material Design 3
- **State Management** - Zustand with AsyncStorage persistence
- **File-based Routing** - Expo Router for intuitive navigation

## Tech Stack

- **[Expo](https://expo.dev/)** (v54) - React Native development platform
- **[Expo Router](https://expo.github.io/router/)** - File-based navigation
- **[React Native](https://reactnative.dev/)** (v0.81) - Cross-platform mobile framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Supabase](https://supabase.com/)** - Backend as a service (auth & database)
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Native Paper](https://reactnativepaper.com/)** - Material Design 3 UI components
- **[i18next](https://www.i18next.com/)** - Internationalization framework
- **[Moti](https://moti.fyi/)** - Declarative animations
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** - Push notifications
- **[Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)** - Over-the-air updates

## Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Expo CLI** - Install globally: `npm install -g expo-cli`
- **EAS CLI** - For builds and updates: `npm install -g eas-cli`
- **Supabase Account** - [Sign up here](https://supabase.com/)
- **iOS Simulator** (Mac only) or **Android Emulator**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd template1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**

   Create the `users` table in your Supabase project:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     auth_id UUID REFERENCES auth.users NOT NULL,
     email TEXT,
     name TEXT,
     last_name TEXT,
     birth_date TEXT,
     onboarding_completed BOOLEAN DEFAULT false,
     expo_push_token TEXT,
     notifications_enabled BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Configure social sign-in (optional)**

   Update the Google Sign-In client ID in `app.json` (line 53)

## Development

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

## Project Structure

```
.
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry point
│   ├── welcome.tsx              # Welcome screen
│   ├── login.tsx                # Login screen
│   ├── register.tsx             # Registration screen
│   ├── onboarding-step1.tsx     # Onboarding flow
│   ├── onboarding-step2.tsx
│   ├── onboarding-step3.tsx
│   └── (tabs)/                  # Tab navigation
│       ├── _layout.tsx
│       ├── index.tsx            # Home tab
│       └── two.tsx              # Settings tab
├── api/                         # API functions
│   ├── auth.ts                  # Authentication API
│   ├── users.ts                 # User CRUD
│   └── notifications.ts         # Push notification API
├── components/                  # Reusable components
├── lib/                         # Libraries and utilities
│   ├── hooks/                   # Custom hooks
│   ├── i18n/                    # Internationalization
│   ├── notifications/           # Notification setup
│   ├── react-native-paper/      # Theme configuration
│   ├── storage/                 # AsyncStorage utilities
│   └── updates/                 # OTA update logic
├── store/                       # Zustand store
│   └── index.ts
├── supabase/                    # Supabase configuration
│   └── functions/               # Edge functions
└── app.json                     # Expo configuration
```

## Authentication Flow

1. User registers or logs in via Supabase Auth
2. User data stored in `users` table (linked by `auth_id`)
3. Session saved to AsyncStorage
4. On app launch: session restored from storage
5. Redirect to onboarding if incomplete, otherwise to main tabs

## Theme System

The app features a custom black & white theme with Material Design 3:

- **Light mode**: White background, black primary color
- **Dark mode**: Black background, white primary color
- **System mode**: Follows device settings

Users can override the system preference in settings. Theme preference is persisted in AsyncStorage.

All screens use `useTheme()` from react-native-paper - **never hardcode colors**.

## Push Notifications

Push notifications are implemented with Expo Notifications:

- Tokens stored in `users.expo_push_token`
- Auto-registration on login/onboarding completion
- Deep linking support (navigate on notification tap)
- Can be toggled in settings

**Sending notifications:**
Use the Supabase Edge Function at `supabase/functions/send-notification/`

## OTA Updates

The app uses Expo Updates for automatic silent updates:

- Checks for updates on every app launch
- Three channels: `development`, `preview`, `production`
- Updates apply automatically without user prompt

**Publishing updates:**

```bash
# Development channel
eas update --branch development --message "Your update message"

# Production channel
eas update --branch production --message "Your update message"

# Rollback if needed
eas update:rollback --branch production
```

See `EXPO_UPDATES_COMMANDS.md` for full deployment reference.

## Internationalization

The app supports multiple languages using i18next:

- **English** (default)
- **Spanish**

Language preference is stored in Zustand and persisted to AsyncStorage. Users can change language in settings.

**Adding a new language:**

1. Create a new translation file in `lib/i18n/[lang]/index.ts`
2. Register it in `lib/i18n/index.ts`
3. Add language option to settings screen

## Building for Production

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both
eas build --platform all --profile production
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Key Conventions

- All screens use theme colors via `useTheme()` - never hardcode colors
- Animations use Moti for smooth transitions
- Action sheets use `react-native-actions-sheet`
- Date picker uses native `@react-native-community/datetimepicker`
- `SafeAreaView` used on all screens with appropriate edges
- Loading states managed with local state and disabled buttons
- Error handling shows `Alert.alert()` for user-facing errors

## Notes

- New Architecture is **enabled** (`newArchEnabled: true`)
- Push notifications require platform-specific setup (APNs for iOS, FCM for Android)
- OTA updates only work in production builds (not in Expo Go)
- Theme changes are instant (no app restart needed)
- All user data synced with Supabase on every update

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue in the repository.
