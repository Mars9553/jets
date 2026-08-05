import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { UserProvider, useUser } from '@/context/UserContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { registerForNotificationsAsync, WEB_NOTIFICATION_EVENT } from '@/lib/notifications';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/ui/OfflineScreen';

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
          <AppContent />
        </ThemeProvider>
      </ToastProvider>
    </UserProvider>
  );
}
