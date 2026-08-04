import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoardUser } from '@/lib/api';

const STORAGE_KEY = '@bulletin_user';

type UserContextValue = {
  user: BoardUser | null;
  loading: boolean;
  setUser: (user: BoardUser | null) => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<BoardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const startedAt = Date.now();
    const MIN_LOADING_MS = 1500;
    const MAX_LOADING_MS = 3000;

    const resolveLoading = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startedAt;
      if (elapsed >= MIN_LOADING_MS) {
        setLoading(false);
      } else {
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, MIN_LOADING_MS - elapsed);
      }
    };

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!isMounted) return;
        if (raw) {
          try {
            setUserState(JSON.parse(raw));
          } catch {
            // ignore corrupted stored user data
          }
        }
      })
      .catch(() => {
        // ignore storage errors (e.g. private browsing / unavailable storage)
      })
      .finally(() => {
        resolveLoading();
      });

    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, MAX_LOADING_MS);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const setUser = async (next: BoardUser | null) => {
    setUserState(next);
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
