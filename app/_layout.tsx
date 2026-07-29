import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '@/constants/theme';
import { UserProvider, useUser } from '@/context/UserContext';
import { registerForNotificationsAsync } from '@/lib/notifications';
import { ToastProvider } from '@/context/ToastContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/ui/OfflineScreen';

function NavigationGate() {
  const { user, loading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)' || !segments.length;

    if (user && inAuthGroup) {
      // Redirect logged-in user to the main page
      router.replace('/user_notice');
    } else if (!user && !inAuthGroup) {
      // Redirect unauthenticated user to the sign in page
      router.replace('/(auth)/' as any);
    }
  }, [user, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: AppColors.background },
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
        <StatusBar style="dark" />
        <AppContent />
      </ToastProvider>
    </UserProvider>
  );
}

