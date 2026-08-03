import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

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
      const online = typeof navigator !== 'undefined' && navigator.onLine;
      setIsConnected(online);
      return online;
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

      // Set initial state immediately from browser
      setIsConnected(typeof navigator !== 'undefined' && navigator.onLine);

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
  }, []);

  return {
    isConnected,
    checkConnection,
  };
}

