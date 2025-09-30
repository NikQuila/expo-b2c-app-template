import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, List, Switch, Card, Avatar, Divider, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { MotiView } from 'moti';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import LanguageToggle from '@/components/ui/language-toggle';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStore } from '@/store';
import {
  registerForPushNotifications,
  unregisterFromPushNotifications,
  getNotificationPermissionStatus,
} from '@/lib/notifications';
import { toggleNotifications as apiToggleNotifications } from '@/api/notifications';
import { checkForUpdates, downloadAndApplyUpdate, getCurrentUpdateInfo } from '@/lib/updates';
import * as StoreReview from 'expo-store-review';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(getCurrentUpdateInfo());
  const { t } = useTranslation();
  const { logout, isLoading } = useAuth();
  const { user, updateUser, themeMode, setThemeMode } = useStore();
  const theme = useTheme();

  const notificationsEnabled = user?.notifications_enabled ?? true;

  // Check notification permission status on mount
  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await getNotificationPermissionStatus();
    console.log('Notification permission status:', status);
  };

  const handleCheckForUpdates = async () => {
    setUpdateLoading(true);
    try {
      const result = await checkForUpdates();

      if (result.isUpdateAvailable) {
        Alert.alert(
          'Update Available',
          'A new version is available. Downloading...',
          [{ text: 'OK' }]
        );

        const downloadResult = await downloadAndApplyUpdate();

        if (downloadResult.success && downloadResult.needsReload) {
          // App will reload automatically
        } else if (!downloadResult.success) {
          Alert.alert('Error', downloadResult.error || 'Failed to download update');
        }
      } else {
        Alert.alert('Up to Date', 'You are already on the latest version!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRateApp = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();

      if (isAvailable) {
        await StoreReview.requestReview();
      } else {
        // Fallback: open store page
        const storeUrl = Platform.select({
          ios: 'https://apps.apple.com/app/idYOUR_APP_ID',
          android: 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME',
        });

        Alert.alert(
          t('settings.rateUs'),
          'Would you like to rate us on the store?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Rate Now',
              onPress: () => {
                if (storeUrl) {
                  // You would use Linking.openURL(storeUrl) here
                  console.log('Open store:', storeUrl);
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting review:', error);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (!user) return;

    setNotificationsLoading(true);
    try {
      if (value) {
        // Enable notifications - register for push
        const result = await registerForPushNotifications(user);
        if (result.success) {
          updateUser({ notifications_enabled: true, expo_push_token: result.token });
          Alert.alert('Success', 'Notifications enabled successfully!');
        } else {
          Alert.alert('Error', result.error || 'Failed to enable notifications');
        }
      } else {
        // Disable notifications - unregister
        const result = await unregisterFromPushNotifications(user);
        if (result.success) {
          updateUser({ notifications_enabled: false, expo_push_token: undefined });
          Alert.alert('Success', 'Notifications disabled successfully!');
        } else {
          Alert.alert('Error', result.error || 'Failed to disable notifications');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logOut'),
      t('settings.logOutConfirm'),
      [
        {
          text: t('settings.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logOut'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        {/* Profile Section */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Card style={styles.profileCard} mode="outlined">
            <Card.Content>
              <View style={styles.profileHeader}>
                <Avatar.Text
                  size={64}
                  label={user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                />
                <View style={styles.profileInfo}>
                  <Text variant="headlineSmall" style={styles.profileName}>
                    {user?.name && user?.last_name
                      ? `${user.name} ${user.last_name}`
                      : user?.name || user?.email || 'User'}
                  </Text>
                  <Text variant="bodyMedium" style={styles.profileEmail}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>
              <Button mode="outlined" style={styles.editButton}>
                {t('settings.editProfile')}
              </Button>
            </Card.Content>
          </Card>
        </MotiView>

        {/* Preferences */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
        >
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('settings.preferences')}
            </Text>
            <Card style={styles.settingsCard} mode="outlined">
              <View style={styles.languageSection}>
                <Text variant="bodyMedium" style={styles.languageLabel}>
                  {t('settings.language')}
                </Text>
                <LanguageToggle />
              </View>
              <Divider />
              <List.Item
                title={t('settings.notifications')}
                description={t('settings.notificationsDesc')}
                left={(props) => <List.Icon {...props} icon="bell-outline" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleToggleNotifications}
                    disabled={notificationsLoading}
                  />
                )}
              />
              <Divider />
              <List.Item
                title={t('settings.darkMode')}
                description={
                  themeMode === 'system'
                    ? 'Using system preference'
                    : themeMode === 'dark'
                    ? 'Dark mode enabled'
                    : 'Light mode enabled'
                }
                left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {
                  // Cycle through: system -> light -> dark -> system
                  if (themeMode === 'system') {
                    setThemeMode('light');
                  } else if (themeMode === 'light') {
                    setThemeMode('dark');
                  } else {
                    setThemeMode('system');
                  }
                }}
              />
              <Divider />
              <List.Item
                title={t('settings.soundEffects')}
                description={t('settings.soundEffectsDesc')}
                left={(props) => <List.Icon {...props} icon="volume-high" />}
                right={() => (
                  <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
                )}
              />
            </Card>
          </View>
        </MotiView>

        {/* Productivity */}
        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
        >
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('settings.productivity')}
            </Text>
            <Card style={styles.settingsCard} mode="outlined">
              <List.Item
                title={t('settings.focusMode')}
                description={t('settings.focusModeDesc')}
                left={(props) => <List.Icon {...props} icon="timer-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
              <List.Item
                title={t('settings.taskCategories')}
                description={t('settings.taskCategoriesDesc')}
                left={(props) => <List.Icon {...props} icon="folder-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
              <List.Item
                title={t('settings.dailyGoals')}
                description={t('settings.dailyGoalsDesc')}
                left={(props) => <List.Icon {...props} icon="flag-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </Card>
          </View>
        </MotiView>

        {/* Data & Privacy */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
        >
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('settings.dataPrivacy')}
            </Text>
            <Card style={styles.settingsCard} mode="outlined">
              <List.Item
                title={t('settings.backupData')}
                description={t('settings.backupDataDesc')}
                left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
              <List.Item
                title={t('settings.exportData')}
                description={t('settings.exportDataDesc')}
                left={(props) => <List.Icon {...props} icon="download-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
              <List.Item
                title={t('settings.privacyPolicy')}
                description={t('settings.privacyPolicyDesc')}
                left={(props) => <List.Icon {...props} icon="shield-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </Card>
          </View>
        </MotiView>

        {/* About */}
        <MotiView
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
        >
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('settings.about')}
            </Text>
            <Card style={styles.settingsCard} mode="outlined">
              <List.Item
                title={t('settings.version')}
                description={`1.0.0 ${!updateInfo.isEmbeddedLaunch ? `(${updateInfo.channel})` : '(Embedded)'}`}
                left={(props) => <List.Icon {...props} icon="information-outline" />}
              />
              <Divider />
              <List.Item
                title="Check for Updates"
                description="Check if a new version is available"
                left={(props) => <List.Icon {...props} icon="download-outline" />}
                right={() =>
                  updateLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <List.Icon icon="chevron-right" />
                  )
                }
                onPress={handleCheckForUpdates}
                disabled={updateLoading}
              />
              <Divider />
              <List.Item
                title={t('settings.rateUs')}
                description={t('settings.rateUsDesc')}
                left={(props) => <List.Icon {...props} icon="star-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleRateApp}
              />
              <Divider />
              <List.Item
                title={t('settings.helpSupport')}
                description={t('settings.helpSupportDesc')}
                left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </Card>
          </View>
        </MotiView>

        {/* Logout Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 500 }}
        >
          <Button
            mode="outlined"
            style={styles.logoutButton}
            textColor="#FF0000"
            onPress={handleLogout}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('settings.logOut')}
          </Button>

          <View style={styles.bottomSpacer} />
        </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    opacity: 0.6,
  },
  editButton: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  languageSection: {
    padding: 16,
    gap: 12,
  },
  languageLabel: {
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 8,
    borderColor: '#FF0000',
  },
  bottomSpacer: {
    height: 40,
  },
});