import messaging from '@react-native-firebase/messaging';
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
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      console.log('FCM permission not granted');
      return null;
    }
    const fcmToken = await messaging().getToken();
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
