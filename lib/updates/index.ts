import * as Updates from 'expo-updates';

export interface UpdateInfo {
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
  updateId?: string;
  createdAt?: Date;
  manifest?: any;
}

/**
 * Check if there's an update available
 */
export async function checkForUpdates(): Promise<UpdateInfo> {
  try {
    // Only check in production builds
    if (__DEV__) {
      console.log('Updates disabled in development');
      return {
        isUpdateAvailable: false,
        isUpdatePending: false,
      };
    }

    const update = await Updates.checkForUpdateAsync();

    return {
      isUpdateAvailable: update.isAvailable,
      isUpdatePending: false,
      manifest: update.manifest,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return {
      isUpdateAvailable: false,
      isUpdatePending: false,
    };
  }
}

/**
 * Download and install update automatically
 * Returns true if update was downloaded and app needs reload
 */
export async function downloadAndApplyUpdate(): Promise<{
  success: boolean;
  needsReload: boolean;
  error?: string;
}> {
  try {
    if (__DEV__) {
      return { success: false, needsReload: false, error: 'Updates disabled in dev' };
    }

    // Check for updates first
    const checkResult = await Updates.checkForUpdateAsync();

    if (!checkResult.isAvailable) {
      return { success: true, needsReload: false };
    }

    // Download the update
    const fetchResult = await Updates.fetchUpdateAsync();

    if (fetchResult.isNew) {
      // Update downloaded successfully, reload app
      await Updates.reloadAsync();
      return { success: true, needsReload: true };
    }

    return { success: true, needsReload: false };
  } catch (error: any) {
    console.error('Error downloading update:', error);
    return {
      success: false,
      needsReload: false,
      error: error.message || 'Failed to download update',
    };
  }
}

/**
 * Get current update information
 */
export function getCurrentUpdateInfo() {
  if (__DEV__) {
    return {
      updateId: 'dev',
      channel: 'development',
      runtimeVersion: 'dev',
      createdAt: new Date(),
      isEmbeddedLaunch: true,
    };
  }

  return {
    updateId: Updates.updateId,
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    createdAt: Updates.createdAt,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
  };
}

/**
 * Reload the app (use after downloading an update)
 */
export async function reloadApp(): Promise<void> {
  try {
    await Updates.reloadAsync();
  } catch (error) {
    console.error('Error reloading app:', error);
  }
}

/**
 * Check, download and apply update automatically on app start
 * This runs silently in the background
 */
export async function autoUpdateOnStart(): Promise<void> {
  try {
    if (__DEV__) {
      console.log('Auto-update disabled in development');
      return;
    }

    console.log('Checking for updates...');
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      console.log('Update available, downloading...');
      const fetchResult = await Updates.fetchUpdateAsync();

      if (fetchResult.isNew) {
        console.log('Update downloaded, reloading app...');
        await Updates.reloadAsync();
      }
    } else {
      console.log('App is up to date');
    }
  } catch (error) {
    console.error('Auto-update error:', error);
    // Fail silently, don't disrupt user experience
  }
}