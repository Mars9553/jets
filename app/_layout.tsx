import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider, useUser } from '@/context/UserContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { registerForNotificationsAsync } from '@/lib/notifications';
import { ToastProvider } from '@/context/ToastContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/ui/OfflineScreen';

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
          <AppContent />
        </ThemeProvider>
      </ToastProvider>
    </UserProvider>
  );
}
