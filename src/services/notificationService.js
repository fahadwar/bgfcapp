import { getMessagingInstance, getToken, onMessage, hasFirebaseConfig } from './firebase.js';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, message: 'Notifications are not supported in this environment.' };
  }

  if (!hasFirebaseConfig) {
    return { granted: true, message: 'Running with mock notifications.' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { granted: false, message: 'Notification permission denied by the user.' };
  }

  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      return { granted: false, message: 'Firebase messaging is not supported on this device.' };
    }
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return { granted: true, token };
  } catch (error) {
    console.error('Unable to retrieve FCM token', error);
    return { granted: false, message: error.message };
  }
}

export function listenForForegroundMessages(callback) {
  if (!hasFirebaseConfig) {
    return () => undefined;
  }
  getMessagingInstance().then((messaging) => {
    if (!messaging) return;
    onMessage(messaging, callback);
  });
  return () => undefined;
}
