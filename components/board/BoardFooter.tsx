import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { AppColors, Layout, Radius, Spacing } from '@/constants/theme';

export function BoardFooter() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        {/* Brand Info */}
        <View style={styles.col}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Bell size={14} color={AppColors.surface} />
            </View>
            <Text style={styles.brandName}>Digital Bulletin Board</Text>
          </View>
          <Text style={styles.tagline}>
            Your central hub for campus announcements, schedules, and events.
          </Text>
        </View>

        {/* Quick Links */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Quick Links</Text>
          <TouchableOpacity onPress={() => router.push('/user_notice' as any)} activeOpacity={0.7}>
            <Text style={styles.link}>Notice Board</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/event_page' as any)} activeOpacity={0.7}>
            <Text style={styles.link}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile' as any)} activeOpacity={0.7}>
            <Text style={styles.link}>My Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Social / Connect */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Connect With Us</Text>
          <Text style={styles.socialTagline}>Stay updated on university social media.</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialText}>IG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialText}>IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <Text style={styles.copyright}>© 2026 Digital Bulletin Board. All rights reserved.</Text>
          <Text style={styles.credit}>Designed with care for students</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: AppColors.borderLight, // Soft light-grey background (e.g. #f1f5f9)
    borderTopWidth: 1,
    borderTopColor: AppColors.border, // #e2e8f0 border
    width: '100%',
    marginTop: Spacing.xl,
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    maxWidth: Layout.maxWidthContent,
    alignSelf: 'center',
    width: '100%',
  },
  col: {
    flex: 1,
    minWidth: 220,
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logo: {
    backgroundColor: AppColors.primary,
    padding: 5,
    borderRadius: Radius.sm - 2,
  },
  brandName: {
    fontWeight: '700',
    fontSize: 14,
    color: AppColors.textSecondary, // #1e293b
  },
  tagline: {
    fontSize: 13,
    color: AppColors.textMuted, // #64748b
    lineHeight: 20,
    maxWidth: 280,
  },
  colTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textSecondary, // #1e293b
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    color: AppColors.textMuted, // #64748b
    paddingVertical: 3,
  },
  socialTagline: {
    fontSize: 13,
    color: AppColors.textMuted, // #64748b
    marginBottom: 2,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  socialIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: AppColors.surface, // #ffffff
    borderWidth: 1,
    borderColor: AppColors.border, // #e2e8f0
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted, // #64748b
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    width: '100%',
    alignItems: 'center',
  },
  bottomBarInner: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    maxWidth: Layout.maxWidthContent,
    width: '100%',
  },
  copyright: {
    fontSize: 12,
    color: AppColors.textPlaceholder, // #94a3b8
  },
  credit: {
    fontSize: 12,
    color: AppColors.textPlaceholder, // #94a3b8
  },
});
