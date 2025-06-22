// firebaseMessagingBackground.js
// This file handles FCM background messages
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM] Background message handled:', remoteMessage);
  
  // You can perform background processing here
  // The notification will be automatically displayed by the system
});
