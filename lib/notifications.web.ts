import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoticeItem, EventItem } from './api';

const WEB_PERMISSION_KEY = 'web_notification_permission';
const PUSH_SUBSCRIBED_KEY = 'push_subscribed';

export const WEB_NOTIFICATION_EVENT = 'eboard-web-notification';

export type WebNotificationPayload = {
  title: string;
  body: string;
  data?: any;
};

export function dispatchWebNotification(payload: WebNotificationPayload) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(WEB_NOTIFICATION_EVENT, { detail: payload })
  );
}

async function ensureWebNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return false;

  try {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

export async function registerForNotificationsAsync() {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return false;

  try {
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    await AsyncStorage.setItem(WEB_PERMISSION_KEY, String(granted));
    return granted;
  } catch (error) {
    console.error('Error requesting web notification permission:', error);
    return false;
  }
}

export async function triggerLocalNotification(title: string, body: string, data?: any) {
  dispatchWebNotification({ title, body, data });

  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    if (typeof window !== 'undefined') {
      window.alert(`${title}\n\n${body}`);
    }
    return;
  }

  const granted = await ensureWebNotificationPermission();
  if (granted) {
    try {
      new Notification(title, { body, data });
      return;
    } catch {
      // fall through to alert
    }
  }

  window.alert(`${title}\n\n${body}`);
}

const SEEN_NOTICES_KEY = 'seen_notice_ids';
const SEEN_EVENTS_KEY = 'seen_event_ids';

export async function checkForNewNotices(notices: NoticeItem[]) {
  if (!notices || notices.length === 0) return;

  try {
    const storedIdsJson = await AsyncStorage.getItem(SEEN_NOTICES_KEY);
    const currentIds = notices.map((n) => String(n.id));

    if (storedIdsJson === null) {
      await AsyncStorage.setItem(SEEN_NOTICES_KEY, JSON.stringify(currentIds));
      return;
    }

    const seenIds: string[] = JSON.parse(storedIdsJson);
    const newNotices = notices.filter((n) => !seenIds.includes(String(n.id)));

    if (newNotices.length > 0) {
      const countToNotify = Math.min(newNotices.length, 3);
      for (let i = 0; i < countToNotify; i++) {
        const notice = newNotices[i];
        await triggerLocalNotification(
          `New Notice: ${notice.title}`,
          notice.description || `A new update has been posted in ${notice.category}.`,
          { type: 'notice', id: notice.id }
        );
      }

      if (newNotices.length > 3) {
        await triggerLocalNotification(
          'Multiple New Notices',
          `You have ${newNotices.length} new notices to review.`,
          { type: 'notices' }
        );
      }

      const updatedSeenIds = Array.from(new Set([...seenIds, ...currentIds]));
      await AsyncStorage.setItem(SEEN_NOTICES_KEY, JSON.stringify(updatedSeenIds));
    }
  } catch (error) {
    console.error('Error checking for new notices:', error);
  }
}

export async function checkForNewEvents(events: EventItem[]) {
  if (!events || events.length === 0) return;

  try {
    const storedIdsJson = await AsyncStorage.getItem(SEEN_EVENTS_KEY);
    const currentIds = events.map((e) => String(e.id));

    if (storedIdsJson === null) {
      await AsyncStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(currentIds));
      return;
    }

    const seenIds: string[] = JSON.parse(storedIdsJson);
    const newEvents = events.filter((e) => !seenIds.includes(String(e.id)));

    if (newEvents.length > 0) {
      const countToNotify = Math.min(newEvents.length, 3);
      for (let i = 0; i < countToNotify; i++) {
        const event = newEvents[i];
        await triggerLocalNotification(
          `New Event: ${event.title}`,
          event.description || `New event at ${event.venue || 'campus'} scheduled for ${event.date}.`,
          { type: 'event', id: event.id }
        );
      }

      if (newEvents.length > 3) {
        await triggerLocalNotification(
          'Multiple New Events',
          `You have ${newEvents.length} new events scheduled.`,
          { type: 'events' }
        );
      }

      const updatedSeenIds = Array.from(new Set([...seenIds, ...currentIds]));
      await AsyncStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(updatedSeenIds));
    }
  } catch (error) {
    console.error('Error checking for new events:', error);
  }
}

type PushSubscriptionJSON = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

async function getVapidPublicKey(): Promise<string | null> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await fetch(`${baseUrl}/api/push/vapid-public-key`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.publicKey || null;
  } catch {
    return null;
  }
}

export async function subscribeUserToPush(userId?: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return false;
    }

    const vapidKey = await getVapidPublicKey();
    if (!vapidKey) {
      console.warn('VAPID public key not available');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    const json = subscription.toJSON() as PushSubscriptionJSON;

    await fetch(`${typeof window !== 'undefined' ? window.location.origin : ''}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription: {
          endpoint: json.endpoint,
          keys: json.keys,
        },
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      }),
    });

    await AsyncStorage.setItem(PUSH_SUBSCRIBED_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return false;
  }
}

export async function unsubscribeUserFromPush(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const json = subscription.toJSON() as PushSubscriptionJSON;
      await fetch(`${typeof window !== 'undefined' ? window.location.origin : ''}/api/push/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: json.endpoint }),
      });
      await subscription.unsubscribe();
    }
    await AsyncStorage.setItem(PUSH_SUBSCRIBED_KEY, 'false');
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
  }
}

export async function isPushSubscribed(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return false;

    const stored = await AsyncStorage.getItem(PUSH_SUBSCRIBED_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}
