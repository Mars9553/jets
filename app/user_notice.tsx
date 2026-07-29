import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { NoticeListItem } from '@/components/notices/NoticeListItem';
import { api, NoticeItem } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { AppColors, Layout, Radius, Spacing, Shadow } from '@/constants/theme';
import { checkForNewNotices } from '@/lib/notifications';

export default function NoticeScreen() {
  const { user } = useUser();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const loadNotices = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getNotices(user?.userId);
      setNotices(data);
      checkForNewNotices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const filteredNotices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = notices.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );

    return [...filtered].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (timeA === timeB) {
        // Fallback for auto-seeded rows that all share the exact same created_at timestamp
        const parsedA = new Date(a.date).getTime();
        const parsedB = new Date(b.date).getTime();
        if (parsedA !== parsedB && !isNaN(parsedA) && !isNaN(parsedB)) {
          return sortOrder === 'newest' ? parsedB - parsedA : parsedA - parsedB;
        }
        return sortOrder === 'newest' ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id);
      }

      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [notices, searchQuery, sortOrder]);

  const newNoticesCount = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notices.filter((item) => {
      // Use the notice's display date (e.g. "Jun 23, 2026") to determine newness.
      // A notice labelled "Jan 8, 2026" is not "new this week" regardless of when
      // it was inserted into the database.
      const parsed = new Date(item.date).getTime();
      if (!isNaN(parsed)) return parsed >= oneWeekAgo;

      // Fallback: use createdAt if date string is unparseable
      if (item.createdAt) return new Date(item.createdAt).getTime() >= oneWeekAgo;
      return false;
    }).length;
  }, [notices]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.pageTitle}>Notice Board</Text>
      <Text style={styles.pageSubtitle}>
        Stay informed with the latest notices, memos, and campus updates.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Bell size={16} color={AppColors.primary} />
          <Text style={styles.statText}>{notices.length} notices</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxSuccess]}>
          <View style={styles.newDot} />
          <Text style={styles.statTextSuccess}>
            {newNoticesCount === 0 ? 'No new notices' : `${newNoticesCount} new this week`}
          </Text>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.filterSection}>
      <View style={styles.searchWrapper}>
        <Search size={18} color={AppColors.textPlaceholder} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notices..."
          placeholderTextColor={AppColors.textPlaceholder}
          value={localQuery}
          onChangeText={setLocalQuery}
        />
        <TouchableOpacity
          style={[styles.filterBtn, sortOrder === 'oldest' && { backgroundColor: AppColors.primaryLight }]}
          onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={18} color={sortOrder === 'oldest' ? AppColors.primary : AppColors.textMuted} />
        </TouchableOpacity>
      </View>
      <Text style={styles.resultsText}>
        {filteredNotices.length} {filteredNotices.length === 1 ? 'result' : 'results'} • Sorted by {sortOrder}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.surface} />
      <BoardNavbar />

      <FlatList
        data={loading ? [] : filteredNotices}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.heroCard}>
              {renderHeader()}
              {renderSearchBar()}
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={AppColors.primary} />
              </View>
            )}
            {!loading && <BoardFooter />}
          </>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadNotices();
          }} />
        }
        renderItem={({ item }) => <NoticeListItem item={item} />}
      />

      <BottomTabs active="notices" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    ...(Platform.OS === 'web' ? { alignItems: 'center' } : {}),
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : undefined,
    alignSelf: 'center',
  },
  heroCard: {
    backgroundColor: AppColors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    ...Shadow.card,
  },
  headerContainer: {
    paddingBottom: Spacing.md,
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
    flexWrap: 'wrap',
    gap: Spacing.sm,
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
    marginTop: Spacing.sm,
    color: '#dc2626',
    fontSize: 13,
  },
  filterSection: {
    marginBottom: Spacing.md,
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
  filterBtn: {
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: AppColors.borderLight,
    paddingLeft: 12,
  },
  resultsText: {
    marginTop: Spacing.sm,
    color: AppColors.textPlaceholder,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: Platform.OS === 'web' ? Spacing.xl : Spacing.xl + BOTTOM_TAB_HEIGHT,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : undefined,
    alignSelf: 'center',
  },
});
