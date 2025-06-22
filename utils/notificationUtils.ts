import { getApp, getApps } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission
} from '@react-native-firebase/messaging';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

/**
 * Register for push notifications and retrieve the device token
 * @returns Promise that resolves to the device token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // First, get the FCM device token
  const fcmToken = await getFCMDeviceToken();
  if (!fcmToken) {
    console.log('No FCM device token available');
    return null;
  }
  return fcmToken;
}

/**
 * Get the device push token
 * @returns Promise that resolves to the device push token
 */
export async function getDevicePushToken(): Promise<string> {
  try {
    // For standalone/production apps, use getDevicePushTokenAsync
    if (Constants.appOwnership !== 'expo') {
      const { data: token } = await Notifications.getDevicePushTokenAsync();
      return token;
    } 
    // For Expo Go, use getExpoPushTokenAsync
    else {
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      return token;
    }
  } catch (error) {
    console.error('Error getting push token:', error);
    throw error;
  }
}

/**
 * Get the FCM device token using Firebase Messaging
 * @returns Promise that resolves to the FCM device token
 */
export async function getFCMDeviceToken(): Promise<string | null> {
  try {
    // Ensure the default app is initialized (should be automatic in a built app with correct native config)
    if (getApps().length === 0) {
      console.error('[FCM] No Firebase app initialized. Make sure you are running a built app (not Expo Go) and your native config is correct.');
      return null;
    }
    const app = getApp();
    const messaging = getMessaging(app);
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      console.log('FCM permission not granted');
      return null;
    }
    const fcmToken = await getToken(messaging);
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM device token:', error);
    return null;
  }
}

/**
 * Configure notification handling
 */
export function configureNotifications() {
  // Set notification handler for when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
