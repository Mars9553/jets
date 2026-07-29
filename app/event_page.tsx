import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Search, Calendar } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { EventCard } from '@/components/events/EventCard';
import { api, EventItem } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { AppColors, Layout, Radius, Spacing, Shadow } from '@/constants/theme';
import { checkForNewEvents } from '@/lib/notifications';

function EventCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.imageSkeleton} />
      <View style={styles.bodySkeleton}>
        <View style={styles.badgeSkeleton} />
        <View style={styles.titleSkeleton} />
        <View style={styles.textSkeleton} />
        <View style={styles.dateSkeleton} />
        <View style={styles.btnSkeleton} />
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const { user } = useUser();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.surface} />
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
          styles.scrollContent,
          Platform.OS !== 'web' && { paddingBottom: BOTTOM_TAB_HEIGHT + Spacing.lg },
        ]}
      >
        <View style={styles.page}>
          <View style={styles.heroCard}>
            <Text style={styles.pageTitle}>Campus Events</Text>
            <Text style={styles.pageSubtitle}>
              Discover SUG Week, inaugurations, career fairs, and more happening on campus.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Calendar size={16} color={AppColors.primary} />
                <Text style={styles.statText}>{events.length} events</Text>
              </View>
              <View style={[styles.statBox, styles.statBoxSuccess]}>
                <View style={styles.newDot} />
                <Text style={styles.statTextSuccess}>{upcomingCount} upcoming</Text>
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.searchWrapper}>
              <Search size={18} color={AppColors.textPlaceholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor={AppColors.textPlaceholder}
                value={localQuery}
                onChangeText={setLocalQuery}
              />
            </View>
          </View>

          <Text style={styles.resultsText}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </Text>

          {loading ? (
            <View style={[styles.grid, columns === 1 && styles.gridSingle]}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.gridItem,
                    columns === 2 && styles.gridItemHalf,
                    columns === 3 && styles.gridItemThird,
                  ]}
                >
                  <EventCardSkeleton />
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.grid, columns === 1 && styles.gridSingle]}>
              {filteredEvents.map((event) => (
                <View
                  key={event.id}
                  style={[
                    styles.gridItem,
                    columns === 2 && styles.gridItemHalf,
                    columns === 3 && styles.gridItemThird,
                  ]}
                >
                  <EventCard event={event} />
                </View>
              ))}
            </View>
          )}

          {!loading && filteredEvents.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptyText}>Try a different search term.</Text>
            </View>
          )}

          <BoardFooter />
        </View>
      </ScrollView>

      <BottomTabs active="events" />
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
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : '100%',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  heroCard: {
    backgroundColor: AppColors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: AppColors.textMuted,
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
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
  },
  statBoxSuccess: {
    backgroundColor: AppColors.successBg,
  },
  statText: {
    color: AppColors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  statTextSuccess: {
    color: AppColors.success,
    fontWeight: '500',
    fontSize: 13,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.success,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: AppColors.textSecondary,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  resultsText: {
    fontSize: 13,
    color: AppColors.textPlaceholder,
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  cardSkeleton: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    height: 380,
    width: '100%',
  },
  imageSkeleton: {
    width: '100%',
    height: 160,
    backgroundColor: AppColors.illustration,
  },
  bodySkeleton: {
    padding: Spacing.md,
    gap: 10,
  },
  badgeSkeleton: {
    width: 60,
    height: 16,
    borderRadius: Radius.sm - 2,
    backgroundColor: AppColors.borderLight,
  },
  titleSkeleton: {
    width: '80%',
    height: 20,
    borderRadius: Radius.sm - 2,
    backgroundColor: AppColors.borderLight,
  },
  textSkeleton: {
    width: '95%',
    height: 14,
    borderRadius: Radius.sm - 2,
    backgroundColor: AppColors.borderLight,
  },
  dateSkeleton: {
    width: 100,
    height: 14,
    borderRadius: Radius.sm - 2,
    backgroundColor: AppColors.borderLight,
  },
  btnSkeleton: {
    width: '100%',
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: AppColors.borderLight,
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
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textMuted,
  },
});
