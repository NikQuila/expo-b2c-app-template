import * as Updates from 'expo-updates';

/**
 * Updates are applied automatically by expo-updates on app start
 * (configured via `updates.checkAutomatically: "ON_LOAD"` in app.json).
 *
 * The helpers below are only needed if you want to expose a manual
 * "Check for updates" button in the UI.
 */

/**
 * Manually check, download and apply an update.
 * Returns whether an update was found and applied.
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

    const checkResult = await Updates.checkForUpdateAsync();

    if (!checkResult.isAvailable) {
      return { success: true, needsReload: false };
    }

    const fetchResult = await Updates.fetchUpdateAsync();

    if (fetchResult.isNew) {
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
 * Check if there's an update available without downloading it.
 */
export async function checkForUpdates(): Promise<{
  isUpdateAvailable: boolean;
  manifest?: any;
}> {
  try {
    if (__DEV__) {
      return { isUpdateAvailable: false };
    }

    const update = await Updates.checkForUpdateAsync();
    return {
      isUpdateAvailable: update.isAvailable,
      manifest: update.manifest,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { isUpdateAvailable: false };
  }
}

/**
 * Get current update info (channel, updateId, etc.) for display in Settings.
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
