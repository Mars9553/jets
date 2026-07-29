import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, CalendarDays } from 'lucide-react-native';
import { AppColors, Radius, Spacing } from '@/constants/theme';

export type BoardTab = 'notices' | 'events';

type TabToggleProps = {
  active: BoardTab;
  onChange: (tab: BoardTab) => void;
};

export function TabToggle({ active, onChange }: TabToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, active === 'notices' && styles.tabActive]}
        onPress={() => onChange('notices')}
        activeOpacity={0.85}
      >
        <FileText size={16} color={active === 'notices' ? AppColors.surface : AppColors.primary} />
        <Text style={[styles.tabText, active === 'notices' && styles.tabTextActive]}>Notices</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, active === 'events' && styles.tabActive]}
        onPress={() => onChange('events')}
        activeOpacity={0.85}
      >
        <CalendarDays size={16} color={active === 'events' ? AppColors.surface : AppColors.primary} />
        <Text style={[styles.tabText, active === 'events' && styles.tabTextActive]}>Events</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: Radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: AppColors.primary,
  },
  tabText: {
    color: AppColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: AppColors.surface,
  },
});
