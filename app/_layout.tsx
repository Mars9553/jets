import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { UserProvider, useUser } from '@/context/UserContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { registerForNotificationsAsync, WEB_NOTIFICATION_EVENT, subscribeUserToPush, checkForNewNotices, checkForNewEvents } from '@/lib/notifications';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/ui/OfflineScreen';
import { api } from '@/lib/api';

function WebNotificationListener() {
  const { showToast } = useToast();

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: CustomEvent) => {
      const { title, body } = event.detail || {};
      if (title && body) {
        showToast(`${title}: ${body}`, 'info');
      }
    };
    window.addEventListener(WEB_NOTIFICATION_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(WEB_NOTIFICATION_EVENT, handler as EventListener);
    };
  }, [showToast]);

  return null;
}

function NavigationGate() {
  const { user, loading } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)' || !segments.length;

    if (user && inAuthGroup) {
      router.replace('/user_notice');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/' as any);
    }
  }, [user, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
}

function AppContent() {
  const { isConnected, checkConnection } = useNetworkStatus();

  if (isConnected === false) {
    return <OfflineScreen onRetry={checkConnection} />;
  }

  return <NavigationGate />;
}

function NotificationPolling() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const userId = user.userId;

    async function poll() {
      try {
        const [notices, events] = await Promise.all([
          api.getNotices(userId),
          api.getEvents(userId),
        ]);

        if (!mounted) return;

        if (Platform.OS === 'web') {
          await checkForNewNotices(notices);
          await checkForNewEvents(events);
        }
      } catch {
        // ignore polling errors
      }
    }

    poll();
    const interval = setInterval(poll, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.userId]);

  return null;
}

function PushSubscriptionGate() {
  const { user } = useUser();

  useEffect(() => {
    if (!user || Platform.OS !== 'web') return;

    let cancelled = false;
    const userId = user.userId;

    async function setup() {
      const granted = await registerForNotificationsAsync();
      if (!granted || cancelled) return;
      await subscribeUserToPush(userId);
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    registerForNotificationsAsync();
  }, []);

  return (
    <UserProvider>
      <ToastProvider>
        <ThemeProvider>
          <StatusBar style="dark" />
          <WebNotificationListener />
          <NotificationPolling />
          <PushSubscriptionGate />
          <AppContent />
        </ThemeProvider>
      </ToastProvider>
    </UserProvider>
  );
}
