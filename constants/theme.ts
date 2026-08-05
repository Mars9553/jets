import { Platform } from 'react-native';

const tintColorLight = '#2563eb';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const AppColors = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryLight: '#eff6ff',
  primaryMuted: '#dbeafe',
  background: '#f8fafc',
  backgroundAuth: '#f0f4ff',
  surface: '#ffffff',
  illustration: '#e8eef8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#1e293b',
  textMuted: '#64748b',
  textPlaceholder: '#94a3b8',
  inputBg: '#f8fafc',
  success: '#16a34a',
  successBg: '#f0fdf4',
  successBorder: '#dcfce7',
  overlay: 'rgba(15, 23, 42, 0.45)',
  category: {
    General: { bg: '#e0f2fe', text: '#0369a1' },
    Academic: { bg: '#ede9fe', text: '#6d28d9' },
    Career: { bg: '#fef3c7', text: '#b45309' },
    Urgent: { bg: '#fee2e2', text: '#dc2626' },
  } as Record<string, { bg: string; text: string }>,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const Layout = {
  maxWidthAuth: 440,
  maxWidthContent: 960,
  navbarHeight: 56,
};

export const Shadow = Platform.select({
  ios: {
    card: {
      shadowColor: '#0f172a',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 12,
    },
  },
  android: {
    card: { elevation: 2 },
  },
  default: {
    card: {
      shadowColor: '#0f172a',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 12,
      elevation: 2,
    },
  },
})!;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
