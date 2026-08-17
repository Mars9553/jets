import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { API_URL } from '@/lib/api';

// Disable NetInfo's isInternetReachable probe — it makes an HTTP request to an
// external URL (clients3.google.com) that frequently fails on restricted
// networks (school, corporate, captive portals) even when the device has a
// valid connection. isConnected (network interface status) is sufficient and
// reliable across all network types and devices.
NetInfo.configure({ reachabilityShouldRun: () => false });

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      // navigator.onLine is unreliable on desktop (e.g. restricted networks,
      // captive portals, VPNs). Verify by actually hitting the API health
      // endpoint so the app works whenever the server is reachable.
      try {
        const healthUrl = API_URL ? `${API_URL}/api/health` : '/api/health';
        const res = await fetch(healthUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const online = res.ok;
        setIsConnected(online);
        return online;
      } catch {
        setIsConnected(false);
        return false;
      }
    } else {
      const state = await NetInfo.refresh();
      // Rely on isConnected (network interface up) only.
      // isInternetReachable checks reachability to an external probe URL
      // (e.g. clients3.google.com) which can return false on restricted
      // networks even though the device has a valid connection.
      const connected = state.isConnected !== false;
      setIsConnected(connected);
      return connected;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      checkConnection();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      // Set initial state then subscribe to changes
      NetInfo.fetch().then((state) => {
        const connected = state.isConnected !== false;
        setIsConnected(connected);
      });

      const unsubscribe = NetInfo.addEventListener((state) => {
        const connected = state.isConnected !== false;
        setIsConnected(connected);
      });

      return () => unsubscribe();
    }
  }, [checkConnection]);

  return {
    isConnected,
    checkConnection,
  };
}

