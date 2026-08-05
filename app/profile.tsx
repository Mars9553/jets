import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  User,
  Mail,
  BookOpen,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  Award,
  Moon,
  Sun,
  Laptop,
  ChevronDown,
  Smartphone,
  Download,
} from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { Layout, Radius, Shadow, Spacing } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import { getReadIds } from '@/lib/readReceipts';
import { triggerLocalNotification } from '@/lib/notifications';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { colors, mode, setMode } = useTheme();
  const { showToast } = useToast();
  const { canInstall, promptInstall } = useInstallPrompt();
  const s = useMemo(() => styles(colors), [colors]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [readCount, setReadCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  // Reload stats every time this screen comes into focus so that
  // notices AND events viewed in detail pages are reflected immediately.
  useFocusEffect(
    useCallback(() => {
      if (!user?.userId) return;
      async function loadStats() {
        try {
          const [notices, events, readIds] = await Promise.all([
            api.getNotices(),
            api.getEvents(),
            getReadIds(user!.userId),
          ]);
          // readIds contains both 'notice_X' and 'event_X' entries
          const totalPosts = notices.length + events.length;
          setReadCount(readIds.length);
          setAlertsCount(Math.max(0, totalPosts - readIds.length));
        } catch (e) {
          console.error('[Profile] loadStats error:', e);
        }
      }
      loadStats();
    }, [user?.userId]),
  );

  const handleLogout = async () => {
    const performLogout = async () => {
      await setUser(null);
      router.replace('/(auth)/' as any);
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out of your account?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => performLogout(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <BoardNavbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scrollContent,
          Platform.OS !== 'web' && { paddingBottom: BOTTOM_TAB_HEIGHT + Spacing.lg },
        ]}
      >
        <View style={s.page}>
          {/* Profile Header */}
          <View style={s.profileHeaderCard}>
            <View style={s.avatarContainer}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{user?.initials || '??'}</Text>
              </View>
              <View style={s.badgeContainer}>
                <Award size={14} color={colors.surface} />
              </View>
            </View>
            <Text style={s.userName}>{user?.fullName || 'Guest User'}</Text>
            <View style={s.deptBadge}>
              <Text style={s.deptBadgeText}>
                {user?.department}{user?.level ? ` • Level ${user.level}` : ''}
              </Text>
            </View>
          </View>

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <BookOpen size={20} color={colors.success} style={s.statIcon} />
              <Text style={s.statVal}>{readCount}</Text>
              <Text style={s.statLbl}>Read Memos</Text>
            </View>
            <View style={s.statItem}>
              <Bell size={20} color={alertsCount > 0 ? "#eab308" : colors.textMuted} style={s.statIcon} />
              <Text style={s.statVal}>{alertsCount}</Text>
              <Text style={s.statLbl}>Unread Alerts</Text>
            </View>
          </View>

          {/* Personal Information */}
          <Text style={s.sectionTitle}>Personal Information</Text>
          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <View style={s.infoIconWrapper}>
                <User size={18} color={colors.textMuted} />
              </View>
              <View style={s.infoContent}>
                <Text style={s.infoLabel}>MAT Number</Text>
                <Text style={s.infoValue}>{user?.matNumber || 'N/A'}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={s.infoIconWrapper}>
                <BookOpen size={18} color={colors.textMuted} />
              </View>
              <View style={s.infoContent}>
                <Text style={s.infoLabel}>Department</Text>
                <Text style={s.infoValue}>{user?.department || 'N/A'}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={s.infoIconWrapper}>
                <Award size={18} color={colors.textMuted} />
              </View>
              <View style={s.infoContent}>
                <Text style={s.infoLabel}>Faculty</Text>
                <Text style={s.infoValue}>{user?.faculty || 'N/A'}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={s.infoIconWrapper}>
                <Mail size={18} color={colors.textMuted} />
              </View>
              <View style={s.infoContent}>
                <Text style={s.infoLabel}>Email Address</Text>
                <Text style={s.infoValue}>
                  {user?.matNumber ? `${user.matNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@uni.edu.ng` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* App Preferences */}
          <Text style={s.sectionTitle}>Preferences</Text>
          <View style={s.infoCard}>
            <View style={s.prefRow}>
              <View style={s.prefLeft}>
                <View style={[s.infoIconWrapper, { backgroundColor: colors.primaryLight }]}>
                  <Bell size={18} color={colors.primary} />
                </View>
                <View style={s.infoContent}>
                  <Text style={s.prefTitle}>Push Notifications</Text>
                  <Text style={s.prefSubtitle}>Get notified on urgent updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primaryMuted }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textPlaceholder}
              />
            </View>

          <View style={s.divider} />

          <TouchableOpacity
            style={s.prefRow}
            onPress={() => setThemeExpanded(!themeExpanded)}
            activeOpacity={0.7}
          >
            <View style={s.prefLeft}>
              <View style={[s.infoIconWrapper, { backgroundColor: colors.primaryLight }]}>
                <Moon size={18} color={colors.primary} />
              </View>
              <View style={s.infoContent}>
                <Text style={s.prefTitle}>Appearance</Text>
                <Text style={s.prefSubtitle}>Choose light, dark, or system theme</Text>
              </View>
            </View>
            <ChevronDown
              size={18}
              color={colors.textPlaceholder}
            />
          </TouchableOpacity>

          {themeExpanded && (
            <View style={s.themeOptions}>
              {([
                { key: 'light' as const, icon: Sun, label: 'Light' },
                { key: 'dark' as const, icon: Moon, label: 'Dark' },
                { key: 'system' as const, icon: Laptop, label: 'System' },
              ]).map(({ key, icon: Icon, label }) => {
                const isActive = mode === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      s.themeOption,
                      { backgroundColor: isActive ? colors.primary : colors.surface },
                    ]}
                    onPress={() => setMode(key)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      size={16}
                      color={isActive ? colors.surface : colors.textMuted}
                    />
                    <Text
                      style={[
                        s.themeOptionText,
                        { color: isActive ? colors.surface : colors.textSecondary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={s.divider} />

          <TouchableOpacity 
              style={s.prefRowButton} 
              activeOpacity={0.7}
              onPress={async () => {
                await triggerLocalNotification(
                  'Test Notification',
                  'This is a test notification from E-Board!'
                );
                showToast('Test notification sent', 'info');
              }}
            >
              <View style={s.prefLeft}>
                <View style={[s.infoIconWrapper, { backgroundColor: colors.primaryLight }]}>
                  <Bell size={18} color={colors.primary} />
                </View>
                <View style={s.infoContent}>
                  <Text style={s.prefTitle}>Send Test Notification</Text>
                  <Text style={s.prefSubtitle}>Trigger a test alert instantly</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textPlaceholder} />
            </TouchableOpacity>

            <View style={s.divider} />

            <TouchableOpacity style={s.prefRowButton} activeOpacity={0.7}>
              <View style={s.prefLeft}>
                <View style={[s.infoIconWrapper, { backgroundColor: colors.successBg }]}>
                  <Shield size={18} color={colors.success} />
                </View>
                <View style={s.infoContent}>
                  <Text style={s.prefTitle}>Privacy & Security</Text>
                  <Text style={s.prefSubtitle}>Manage your account security</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textPlaceholder} />
            </TouchableOpacity>

            <View style={s.divider} />

            <TouchableOpacity 
                style={s.prefRowButton} 
                activeOpacity={0.7}
                onPress={() => router.push('/help' as any)}
              >
              <View style={s.prefLeft}>
                <View style={[s.infoIconWrapper, { backgroundColor: '#fef9c3' }]}>
                  <HelpCircle size={18} color="#ca8a04" />
                </View>
                <View style={s.infoContent}>
                  <Text style={s.prefTitle}>Help & Support</Text>
                  <Text style={s.prefSubtitle}>FAQ, contact admin, support ticket</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textPlaceholder} />
            </TouchableOpacity>
          </View>

          {Platform.OS === 'web' && (
            <View style={s.infoCard}>
              <TouchableOpacity
                style={s.prefRowButton}
                activeOpacity={0.7}
                onPress={async () => {
                  if (canInstall) {
                    const accepted = await promptInstall();
                    showToast(
                      accepted ? 'Installation started' : 'Installation cancelled',
                      accepted ? 'success' : 'info'
                    );
                  } else {
                    showToast(
                      'Use your browser menu: Share > Add to Home Screen',
                      'info'
                    );
                  }
                }}
              >
                <View style={s.prefLeft}>
                  <View style={[s.infoIconWrapper, { backgroundColor: colors.primaryLight }]}>
                    <Smartphone size={18} color={colors.primary} />
                  </View>
                  <View style={s.infoContent}>
                    <Text style={s.prefTitle}>Install on Device</Text>
                    <Text style={s.prefSubtitle}>
                      {canInstall
                        ? 'Add E-Board to your home screen'
                        : 'Add to home screen for quick access'}
                    </Text>
                  </View>
                </View>
                <Download size={18} color={colors.textPlaceholder} />
              </TouchableOpacity>
            </View>
          )}

          {/* Logout Action */}
          <TouchableOpacity
            style={[
              s.logoutButton,
              logoutHovered && { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
            ]}
            onPress={handleLogout}
            activeOpacity={0.8}
            {...({ onMouseEnter: () => setLogoutHovered(true), onMouseLeave: () => setLogoutHovered(false) } as any)}
          >
            <LogOut size={18} color={logoutHovered ? '#b91c1c' : '#dc2626'} />
            <Text style={[s.logoutText, logoutHovered && { color: '#b91c1c' }]}>Log Out Account</Text>
          </TouchableOpacity>

          <BoardFooter />
        </View>
      </ScrollView>

      <BottomTabs active="profile" />
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },
  page: {
    width: '100%',
    maxWidth: Layout.maxWidthContent,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...Shadow.card,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primaryLight,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: '700',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  deptBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.md,
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md - 4,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md - 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...Shadow.card,
  },
  statIcon: {
    marginBottom: 6,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    paddingLeft: 4,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...Shadow.card,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 12,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textPlaceholder,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: Spacing.md,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  prefTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  prefSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  prefRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    marginBottom: Spacing.md,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: Radius.md,
    gap: 8,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
});
