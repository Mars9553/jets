import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Bell, Calendar, User } from 'lucide-react-native';
import { Layout, Radius, Shadow, Spacing } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

type NavRoute = 'notices' | 'events' | 'profile';

const NAV_ITEMS: { key: NavRoute; label: string; href: string; icon: typeof Bell }[] = [
  { key: 'notices', label: 'Notice Board', href: '/user_notice', icon: Bell },
  { key: 'events', label: 'Events', href: '/event_page', icon: Calendar },
  { key: 'profile', label: 'My Profile', href: '/profile', icon: User },
];

function resolveActive(pathname: string): NavRoute {
  if (pathname.includes('profile') || pathname.includes('help')) return 'profile';
  if (pathname.includes('event')) return 'events';
  return 'notices';
}

export function BoardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { colors } = useTheme();
  const s = styles(colors);
  const active = resolveActive(pathname);
  const { width } = useWindowDimensions();
  const showLabels = width >= 640;

  return (
    <View style={[s.navbar, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight, shadowColor: colors.text }]}>
      <View style={s.inner}>
        <TouchableOpacity
          style={s.brand}
          onPress={() => router.push('/user_notice')}
          activeOpacity={0.8}
        >
          <View style={[s.logo, { backgroundColor: colors.primary }]}>
            <Bell size={18} color={colors.surface} />
          </View>
          {showLabels && <Text style={[s.brandText, { color: colors.textSecondary }]}>Digital Bulletin Board</Text>}
        </TouchableOpacity>

        <View style={s.navLinks}>
          {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
            const isActive = active === key;
            return (
              <TouchableOpacity
                key={key}
                style={[s.navLink, isActive && { backgroundColor: colors.primaryLight }]}
                onPress={() => router.push(href as any)}
                activeOpacity={0.7}
              >
                <Icon size={15} color={isActive ? colors.primary : colors.textMuted} />
                {showLabels && (
                  <Text style={[s.navLinkText, isActive && { color: colors.primary, fontWeight: '700' }]}>
                    {label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.avatar, { backgroundColor: colors.primary, borderColor: colors.primaryLight }]}
          onPress={() => router.push('/profile' as any)}
          activeOpacity={0.8}
        >
          <Text style={[s.avatarText, { color: colors.surface }]}>{user?.initials || '??'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  navbar: {
    borderBottomWidth: 1,
    width: '100%',
    alignItems: 'center',
    ...Shadow.card,
    zIndex: 1000,
  },
  inner: {
    height: Layout.navbarHeight + 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : undefined,
    gap: Spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  logo: {
    padding: 7,
    borderRadius: Radius.md,
  },
  brandText: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  navLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
