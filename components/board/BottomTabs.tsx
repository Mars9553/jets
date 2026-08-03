import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

type Tab = 'notices' | 'events' | 'profile';

type BottomTabsProps = {
  active: Tab;
};

export function BottomTabs({ active }: BottomTabsProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const s = styles(colors);

  if (Platform.OS === 'web') return null;

  return (
    <View style={[s.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={[s.tab, active === 'notices' && [s.tabActive, { borderTopColor: colors.primary }]]}
        onPress={() => router.replace('/user_notice')}
        activeOpacity={0.7}
      >
        <Bell size={20} color={active === 'notices' ? colors.primary : colors.textMuted} />
        <Text style={[s.label, active === 'notices' && [s.labelActive, { color: colors.primary }]]}>Notices</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.tab, active === 'events' && [s.tabActive, { borderTopColor: colors.primary }]]}
        onPress={() => router.replace('/event_page')}
        activeOpacity={0.7}
      >
        <Calendar size={20} color={active === 'events' ? colors.primary : colors.textMuted} />
        <Text style={[s.label, active === 'events' && [s.labelActive, { color: colors.primary }]]}>Events</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.tab, active === 'profile' && [s.tabActive, { borderTopColor: colors.primary }]]}
        onPress={() => router.replace('/profile' as any)}
        activeOpacity={0.7}
      >
        <User size={20} color={active === 'profile' ? colors.primary : colors.textMuted} />
        <Text style={[s.label, active === 'profile' && [s.labelActive, { color: colors.primary }]]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
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
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '600',
  },
});

export const BOTTOM_TAB_HEIGHT = 60;
