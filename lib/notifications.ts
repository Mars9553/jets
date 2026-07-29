import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoticeItem, EventItem } from './api';

// Configure how notifications are handled when the app is in the foreground
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
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting web notification permission:', error);
        return false;
      }
    }
    return false;
  }

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
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body });
          } else {
            alert(`${title}\n\n${body}`);
          }
        });
      } else {
        alert(`${title}\n\n${body}`);
      }
    } else {
      alert(`${title}\n\n${body}`);
    }
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // deliver immediately
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
      // First run: save all existing notices as "seen" to prevent spamming notifications
      await AsyncStorage.setItem(SEEN_NOTICES_KEY, JSON.stringify(currentIds));
      return;
    }

    const seenIds: string[] = JSON.parse(storedIdsJson);
    const newNotices = notices.filter((n) => !seenIds.includes(String(n.id)));

    if (newNotices.length > 0) {
      // Trigger notifications for new notices (limit to 3 if many are added at once to avoid spam)
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

      // Update seen IDs
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
      // First run: save all existing events as "seen" to prevent spamming notifications
      await AsyncStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(currentIds));
      return;
    }

    const seenIds: string[] = JSON.parse(storedIdsJson);
    const newEvents = events.filter((e) => !seenIds.includes(String(e.id)));

    if (newEvents.length > 0) {
      // Trigger notifications for new events (limit to 3 if many are added at once to avoid spam)
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

      // Update seen IDs
      const updatedSeenIds = Array.from(new Set([...seenIds, ...currentIds]));
      await AsyncStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(updatedSeenIds));
    }
  } catch (error) {
    console.error('Error checking for new events:', error);
  }
}
