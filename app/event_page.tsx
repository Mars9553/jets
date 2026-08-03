import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { Search, Calendar } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { EventCard } from '@/components/events/EventCard';
import { api, EventItem } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Layout, Radius, Spacing, Shadow } from '@/constants/theme';
import { checkForNewEvents } from '@/lib/notifications';

export default function EventsScreen() {
  const { user } = useUser();
  const { colors, resolvedTheme } = useTheme();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  const s = useMemo(() => styles(colors), [colors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getEvents(user?.userId);
      setEvents(data);
      checkForNewEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.shortDescription ?? '').toLowerCase().includes(q) ||
        (e.category ?? '').toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <BoardNavbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadEvents();
          }} />
        }
        contentContainerStyle={[
          s.scrollContent,
          Platform.OS !== 'web' && { paddingBottom: BOTTOM_TAB_HEIGHT + Spacing.lg },
        ]}
      >
        <View style={s.page}>
          <View style={[s.heroCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.text }]}>
            <Text style={[s.pageTitle, { color: colors.text }]}>Campus Events</Text>
            <Text style={[s.pageSubtitle, { color: colors.textMuted }]}>
              Discover SUG Week, inaugurations, career fairs, and more happening on campus.
            </Text>

            <View style={s.statsRow}>
              <View style={[s.statBox, { backgroundColor: colors.primaryLight, borderColor: colors.borderLight }]}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[s.statText, { color: colors.primary }]}>{events.length} events</Text>
              </View>
              <View style={[s.statBox, s.statBoxSuccess, { backgroundColor: colors.successBg, borderColor: colors.borderLight }]}>
                <View style={s.newDot} />
                <Text style={[s.statTextSuccess, { color: colors.success }]}>{upcomingCount} upcoming</Text>
              </View>
            </View>

            {error && <Text style={s.errorText}>{error}</Text>}

            <View style={[s.searchWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Search size={18} color={colors.textPlaceholder} />
              <TextInput
                style={[s.searchInput, { color: colors.textSecondary }]}
                placeholder="Search events..."
                placeholderTextColor={colors.textPlaceholder}
                value={localQuery}
                onChangeText={setLocalQuery}
              />
            </View>
          </View>

          <Text style={[s.resultsText, { color: colors.textPlaceholder }]}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </Text>

          {loading ? (
            <View style={[s.grid, columns === 1 && s.gridSingle]}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    s.gridItem,
                    columns === 2 && s.gridItemHalf,
                    columns === 3 && s.gridItemThird,
                  ]}
                >
                  <EventCardSkeleton colors={colors} />
                </View>
              ))}
            </View>
          ) : (
            <View style={[s.grid, columns === 1 && s.gridSingle]}>
              {filteredEvents.map((event) => (
                <View
                  key={event.id}
                  style={[
                    s.gridItem,
                    columns === 2 && s.gridItemHalf,
                    columns === 3 && s.gridItemThird,
                  ]}
                >
                  <EventCard event={event} />
                </View>
              ))}
            </View>
          )}

          {!loading && filteredEvents.length === 0 && (
            <View style={s.empty}>
              <Text style={[s.emptyTitle, { color: colors.textSecondary }]}>No events found</Text>
              <Text style={[s.emptyText, { color: colors.textMuted }]}>Try a different search term.</Text>
            </View>
          )}

          <BoardFooter />
        </View>
      </ScrollView>

      <BottomTabs active="events" />
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },
  page: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : '100%',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  heroCard: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
    borderWidth: 1,
  },
  statBoxSuccess: {
  },
  statText: {
    fontWeight: '500',
    fontSize: 13,
  },
  statTextSuccess: {
    fontWeight: '500',
    fontSize: 13,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  resultsText: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  cardSkeleton: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    height: 380,
    width: '100%',
  },
  imageSkeleton: {
    width: '100%',
    height: 160,
    backgroundColor: colors.illustration,
  },
  bodySkeleton: {
    padding: Spacing.md,
    gap: 10,
  },
  badgeSkeleton: {
    width: 60,
    height: 16,
    borderRadius: Radius.sm - 2,
    backgroundColor: colors.borderLight,
  },
  titleSkeleton: {
    width: '80%',
    height: 20,
    borderRadius: Radius.sm - 2,
    backgroundColor: colors.borderLight,
  },
  textSkeleton: {
    width: '95%',
    height: 14,
    borderRadius: Radius.sm - 2,
    backgroundColor: colors.borderLight,
  },
  dateSkeleton: {
    width: 100,
    height: 14,
    borderRadius: Radius.sm - 2,
    backgroundColor: colors.borderLight,
  },
  btnSkeleton: {
    width: '100%',
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: colors.borderLight,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  gridSingle: {
    flexDirection: 'column',
  },
  gridItem: {
    width: '100%',
  },
  gridItemHalf: {
    width: '48%',
    flexGrow: 1,
  },
  gridItemThird: {
    width: '31%',
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
  },
});

type SkeletonProps = {
  colors: ReturnType<typeof useTheme>['colors'];
};

function EventCardSkeleton({ colors }: SkeletonProps) {
  const s = styles(colors);
  return (
    <View style={[s.cardSkeleton, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={s.imageSkeleton} />
      <View style={s.bodySkeleton}>
        <View style={s.badgeSkeleton} />
        <View style={s.titleSkeleton} />
        <View style={s.textSkeleton} />
        <View style={s.dateSkeleton} />
        <View style={s.btnSkeleton} />
      </View>
    </View>
  );
}
