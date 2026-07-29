import React, { useState, useCallback } from 'react';
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
} from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { AppColors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { api } from '@/lib/api';
import { getReadIds } from '@/lib/readReceipts';
import { triggerLocalNotification } from '@/lib/notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [readCount, setReadCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.surface} />
      <BoardNavbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'web' && { paddingBottom: BOTTOM_TAB_HEIGHT + Spacing.lg },
        ]}
      >
        <View style={styles.page}>
          {/* Profile Header */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.initials || '??'}</Text>
              </View>
              <View style={styles.badgeContainer}>
                <Award size={14} color={AppColors.surface} />
              </View>
            </View>
            <Text style={styles.userName}>{user?.fullName || 'Guest User'}</Text>
            <View style={styles.deptBadge}>
              <Text style={styles.deptBadgeText}>
                {user?.department}{user?.level ? ` • Level ${user.level}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOpen size={20} color={AppColors.success} style={styles.statIcon} />
              <Text style={styles.statVal}>{readCount}</Text>
              <Text style={styles.statLbl}>Read Memos</Text>
            </View>
            <View style={styles.statItem}>
              <Bell size={20} color={alertsCount > 0 ? "#eab308" : AppColors.textMuted} style={styles.statIcon} />
              <Text style={styles.statVal}>{alertsCount}</Text>
              <Text style={styles.statLbl}>Unread Alerts</Text>
            </View>
          </View>

          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <User size={18} color={AppColors.textMuted} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>MAT Number</Text>
                <Text style={styles.infoValue}>{user?.matNumber || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <BookOpen size={18} color={AppColors.textMuted} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user?.department || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Award size={18} color={AppColors.textMuted} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Faculty</Text>
                <Text style={styles.infoValue}>{user?.faculty || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Mail size={18} color={AppColors.textMuted} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>
                  {user?.matNumber ? `${user.matNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@uni.edu.ng` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* App Preferences */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.infoCard}>
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <View style={[styles.infoIconWrapper, { backgroundColor: AppColors.primaryLight }]}>
                  <Bell size={18} color={AppColors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.prefTitle}>Push Notifications</Text>
                  <Text style={styles.prefSubtitle}>Get notified on urgent updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: AppColors.border, true: AppColors.primaryMuted }}
                thumbColor={notificationsEnabled ? AppColors.primary : AppColors.textPlaceholder}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.prefRowButton} 
              activeOpacity={0.7}
              onPress={async () => {
                await triggerLocalNotification(
                  'Test Notification',
                  'This is a test notification from E-Board!'
                );
              }}
            >
              <View style={styles.prefLeft}>
                <View style={[styles.infoIconWrapper, { backgroundColor: AppColors.primaryLight }]}>
                  <Bell size={18} color={AppColors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.prefTitle}>Send Test Notification</Text>
                  <Text style={styles.prefSubtitle}>Trigger a test alert instantly</Text>
                </View>
              </View>
              <ChevronRight size={18} color={AppColors.textPlaceholder} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.prefRowButton} activeOpacity={0.7}>
              <View style={styles.prefLeft}>
                <View style={[styles.infoIconWrapper, { backgroundColor: AppColors.successBg }]}>
                  <Shield size={18} color={AppColors.success} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.prefTitle}>Privacy & Security</Text>
                  <Text style={styles.prefSubtitle}>Manage your account security</Text>
                </View>
              </View>
              <ChevronRight size={18} color={AppColors.textPlaceholder} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.prefRowButton} activeOpacity={0.7}>
              <View style={styles.prefLeft}>
                <View style={[styles.infoIconWrapper, { backgroundColor: '#fef9c3' }]}>
                  <HelpCircle size={18} color="#ca8a04" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.prefTitle}>Help & Support</Text>
                  <Text style={styles.prefSubtitle}>FAQ, contact admin, support ticket</Text>
                </View>
              </View>
              <ChevronRight size={18} color={AppColors.textPlaceholder} />
            </TouchableOpacity>
          </View>

          {/* Logout Action */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={18} color="#dc2626" />
            <Text style={styles.logoutText}>Log Out Account</Text>
          </TouchableOpacity>

          <BoardFooter />
        </View>
      </ScrollView>

      <BottomTabs active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
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
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
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
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: AppColors.primaryLight,
  },
  avatarText: {
    color: AppColors.surface,
    fontSize: 32,
    fontWeight: '700',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: AppColors.success,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 6,
  },
  deptBadge: {
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.md,
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md - 4,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md - 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...Shadow.card,
  },
  statIcon: {
    marginBottom: 6,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    paddingLeft: 4,
  },
  infoCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
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
    backgroundColor: AppColors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: AppColors.textPlaceholder,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
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
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  prefSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  prefRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
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
