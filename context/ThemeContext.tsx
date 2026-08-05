import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppColors } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => Promise<void>;
  colors: typeof AppColors;
};

const STORAGE_KEY = '@bulletin_theme_mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const lightColors = AppColors;
const darkColors = {
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  primaryLight: '#0f172a',
  primaryMuted: '#1e293b',
  background: '#0f172a',
  backgroundAuth: '#111827',
  surface: '#1e293b',
  illustration: '#1e293b',
  border: '#334155',
  borderLight: '#1f2937',
  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  textPlaceholder: '#64748b',
  inputBg: '#1e293b',
  success: '#4ade80',
  successBg: '#052e16',
  successBorder: '#14532d',
  overlay: 'rgba(0, 0, 0, 0.55)',
  category: {
    General: { bg: '#164e63', text: '#67e8f9' },
    Academic: { bg: '#4c1d95', text: '#c4b5fd' },
    Career: { bg: '#78350f', text: '#fde68a' },
    Urgent: { bg: '#7f1d1d', text: '#fca5a5' },
  } as Record<string, { bg: string; text: string }>,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw === 'light' || raw === 'dark' || raw === 'system') {
          setModeState(raw);
        }
      })
      .catch(() => {});
  }, []);

  const resolvedTheme: 'light' | 'dark' = mode === 'system' ? systemColorScheme : mode;
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;

  const setMode = async (next: ThemeMode) => {
    setModeState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      console.error('[Theme] save error', e);
    }
  };

  const value = useMemo(() => ({ mode, resolvedTheme, setMode, colors }), [mode, resolvedTheme, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
