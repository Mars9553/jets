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
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUserState(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
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
