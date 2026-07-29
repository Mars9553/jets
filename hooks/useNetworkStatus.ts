import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      const online = navigator.onLine;
      setIsConnected(online);
      return online;
    } else {
      const state = await NetInfo.refresh();
      // isInternetReachable can be null while still loading — treat null as connected
      const connected = state.isConnected !== false && state.isInternetReachable !== false;
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
      setIsConnected(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      // Set initial state then subscribe to changes
      NetInfo.fetch().then((state) => {
        const connected = state.isConnected !== false && state.isInternetReachable !== false;
        setIsConnected(connected);
      });

      const unsubscribe = NetInfo.addEventListener((state) => {
        const connected = state.isConnected !== false && state.isInternetReachable !== false;
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

