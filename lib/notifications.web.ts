import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoticeItem, EventItem } from './api';

const WEB_PERMISSION_KEY = 'web_notification_permission';

export const WEB_NOTIFICATION_EVENT = 'eboard-web-notification';

export type WebNotificationPayload = {
  title: string;
  body: string;
  data?: any;
};

/**
 * Dispatch a custom DOM event so the app can show an in-app toast.
 * This guarantees the user always receives feedback on web, regardless
 * of whether the browser Notification API is permitted or available.
 */
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

/**
 * Request notification permissions for web (Web Notifications API).
 */
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

/**
 * Trigger a web notification.
 *
 * Strategy:
 *  1. Try the browser Notification API (if permission granted).
 *  2. Always dispatch a custom DOM event so the app can show an in-app
 *     toast as a reliable fallback / guarantee.
 *  3. If the browser API is unavailable, fall back to window.alert.
 */
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

/**
 * Checks for any new notices/memos and triggers a notification for them.
 */
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

/**
 * Checks for any new events and triggers a notification for them.
 */
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
