import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoticeItem, EventItem } from './api';

// Re-exported for cross-platform type resolution (only used at runtime on web)
export const WEB_NOTIFICATION_EVENT = 'eboard-web-notification';
export type WebNotificationPayload = { title: string; body: string; data?: any };

export async function subscribeUserToPush(): Promise<boolean> {
  return false;
}

export async function unsubscribeUserFromPush(): Promise<void> {
}

export async function isPushSubscribed(): Promise<boolean> {
  return false;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions and register for push notifications.
 * Set up the Android notification channel.
 */
export async function registerForNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission to receive notifications was denied.');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for push notifications (simulators will only support local notifications).');
    return true;
  }
}

/**
 * Schedule a local notification immediately.
 */
export async function triggerLocalNotification(title: string, body: string, data?: any) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Failed to trigger local notification:', error);
  }
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
