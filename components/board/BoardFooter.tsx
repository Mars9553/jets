import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function BoardFooter() {
  const router = useRouter();
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <View style={[s.footer, { backgroundColor: colors.borderLight, borderTopColor: colors.border }]}>
      <View style={s.inner}>
        {/* Brand Info */}
        <View style={s.col}>
          <View style={s.brandRow}>
            <View style={[s.logo, { backgroundColor: colors.primary }]}>
              <Bell size={14} color={colors.surface} />
            </View>
            <Text style={[s.brandName, { color: colors.textSecondary }]}>Digital Bulletin Board</Text>
          </View>
          <Text style={[s.tagline, { color: colors.textMuted }]}>
            Your central hub for campus announcements, schedules, and events.
          </Text>
        </View>

        {/* Quick Links */}
        <View style={s.col}>
          <Text style={[s.colTitle, { color: colors.textSecondary }]}>Quick Links</Text>
          <TouchableOpacity onPress={() => router.push('/user_notice' as any)} activeOpacity={0.7}>
            <Text style={[s.link, { color: colors.textMuted }]}>Notice Board</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/event_page' as any)} activeOpacity={0.7}>
            <Text style={[s.link, { color: colors.textMuted }]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile' as any)} activeOpacity={0.7}>
            <Text style={[s.link, { color: colors.textMuted }]}>My Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Social / Connect */}
        <View style={s.col}>
          <Text style={[s.colTitle, { color: colors.textSecondary }]}>Connect With Us</Text>
          <Text style={[s.socialTagline, { color: colors.textMuted }]}>Stay updated on university social media.</Text>
          <View style={s.socialRow}>
            <TouchableOpacity style={[s.socialIcon, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[s.socialText, { color: colors.textMuted }]}>IG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.socialIcon, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[s.socialText, { color: colors.textMuted }]}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.socialIcon, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[s.socialText, { color: colors.textMuted }]}>IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[s.bottomBar, { borderTopColor: colors.border }]}>
        <View style={s.bottomBarInner}>
          <Text style={[s.copyright, { color: colors.textPlaceholder }]}>© 2026 Digital Bulletin Board. All rights reserved.</Text>
          <Text style={[s.credit, { color: colors.textPlaceholder }]}>Designed with care for students</Text>
        </View>
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  footer: {
    borderTopWidth: 1,
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
    padding: 5,
    borderRadius: Radius.sm - 2,
  },
  brandName: {
    fontWeight: '700',
    fontSize: 14,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 280,
  },
  colTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    paddingVertical: 3,
  },
  socialTagline: {
    fontSize: 13,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bottomBar: {
    borderTopWidth: 1,
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
  },
  credit: {
    fontSize: 12,
  },
});
