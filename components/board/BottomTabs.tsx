import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, User } from 'lucide-react-native';
import { AppColors, Layout, Spacing } from '@/constants/theme';

type Tab = 'notices' | 'events' | 'profile';

type BottomTabsProps = {
  active: Tab;
};

export function BottomTabs({ active }: BottomTabsProps) {
  const router = useRouter();

  if (Platform.OS === 'web') return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, active === 'notices' && styles.tabActive]}
        onPress={() => router.replace('/user_notice')}
        activeOpacity={0.7}
      >
        <Bell size={20} color={active === 'notices' ? AppColors.primary : AppColors.textMuted} />
        <Text style={[styles.label, active === 'notices' && styles.labelActive]}>Notices</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, active === 'events' && styles.tabActive]}
        onPress={() => router.replace('/event_page')}
        activeOpacity={0.7}
      >
        <Calendar size={20} color={active === 'events' ? AppColors.primary : AppColors.textMuted} />
        <Text style={[styles.label, active === 'events' && styles.labelActive]}>Events</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, active === 'profile' && styles.tabActive]}
        onPress={() => router.replace('/profile' as any)}
        activeOpacity={0.7}
      >
        <User size={20} color={active === 'profile' ? AppColors.primary : AppColors.textMuted} />
        <Text style={[styles.label, active === 'profile' && styles.labelActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    flexDirection: 'row',
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: AppColors.primary,
  },
  label: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: AppColors.primary,
    fontWeight: '600',
  },
});

export const BOTTOM_TAB_HEIGHT = 60;
