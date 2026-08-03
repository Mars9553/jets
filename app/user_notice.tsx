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
import { Bell, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { BottomTabs, BOTTOM_TAB_HEIGHT } from '@/components/board/BottomTabs';
import { NoticeListItem } from '@/components/notices/NoticeListItem';
import { api, NoticeItem } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Layout, Radius, Spacing, Shadow } from '@/constants/theme';
import { checkForNewNotices } from '@/lib/notifications';

export default function NoticeScreen() {
  const { user } = useUser();
  const { colors } = useTheme();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const s = useMemo(() => styles(colors), [colors]);

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
    let filtered = notices.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.summary ?? '').toLowerCase().includes(q)
    );

    if (selectedTag) {
      filtered = filtered.filter((item) => item.category === selectedTag);
    }

    return [...filtered].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (timeA === timeB) {
        const parsedA = new Date(a.date).getTime();
        const parsedB = new Date(b.date).getTime();
        if (parsedA !== parsedB && !isNaN(parsedA) && !isNaN(parsedB)) {
          return sortOrder === 'newest' ? parsedB - parsedA : parsedA - parsedB;
        }
        return sortOrder === 'newest' ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id);
      }

      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [notices, searchQuery, sortOrder, selectedTag]);

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

  const renderHeader = () => {
    const primaryLight = colors.primaryLight;
    const successBg = colors.successBg;
    const success = colors.success;
    return (
      <View style={s.headerContainer}>
        <Text style={[s.pageTitle, { color: colors.text }]}>Notice Board</Text>
        <Text style={[s.pageSubtitle, { color: colors.textMuted }]}>
          Stay informed with the latest notices, memos, and campus updates.
        </Text>

        <View style={s.statsRow}>
          <View style={[s.statBox, { backgroundColor: primaryLight, borderColor: colors.borderLight }]}>
            <Bell size={16} color={colors.primary} />
            <Text style={[s.statText, { color: colors.primary }]}>{notices.length} notices</Text>
          </View>
          <View style={[s.statBox, { backgroundColor: successBg, borderColor: colors.borderLight }]}>
            <View style={s.newDot} />
            <Text style={[s.statTextSuccess, { color: success }]}>
              {newNoticesCount === 0 ? 'No new notices' : `${newNoticesCount} new this week`}
            </Text>
          </View>
        </View>

        {error && <Text style={[s.errorText, { color: '#dc2626' }]}>{error}</Text>}
      </View>
    );
  };

  const renderSearchBar = () => {
    const tags = useMemo(() => {
      const map = new Map<string, number>();
      notices.forEach((item) => {
        map.set(item.category, (map.get(item.category) || 0) + 1);
      });
      return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    }, [notices]);

    return (
      <View style={s.filterSection}>
        <View style={[s.searchWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={18} color={colors.textPlaceholder} />
          <TextInput
            style={s.searchInput}
            placeholder="Search notices..."
            placeholderTextColor={colors.textPlaceholder}
            value={localQuery}
            onChangeText={setLocalQuery}
          />
          <TouchableOpacity
            style={[s.filterBtn, sortOrder === 'oldest' && { backgroundColor: colors.primaryLight }]}
            onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={18} color={sortOrder === 'oldest' ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={s.tagRow}>
          {tags.map((tag) => {
            const active = selectedTag === tag.name;
            return (
              <TouchableOpacity
                key={tag.name}
                activeOpacity={0.8}
                onPress={() => setSelectedTag(active ? null : tag.name)}
                style={[
                  s.tagChip,
                  {
                    backgroundColor: colors.background,
                    borderColor: active ? colors.primary : colors.borderLight,
                  },
                  active && { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text style={[s.tagChipText, { color: active ? colors.primary : colors.textSecondary }]}>
                  {tag.name}
                </Text>
                <Text style={[s.tagChipCount, { color: active ? colors.primary : colors.textPlaceholder }]}>{tag.count}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.resultsRow}>
          <Text style={[s.resultsText, { color: colors.textPlaceholder }]}>
            {filteredNotices.length} {filteredNotices.length === 1 ? 'result' : 'results'}
          </Text>
          {(selectedTag || sortOrder !== 'newest') && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedTag(null);
                setSortOrder('newest');
              }}
              style={[s.clearFiltersBtn, { backgroundColor: colors.background, borderColor: colors.borderLight }]}
            >
              <X size={14} color={colors.textPlaceholder} />
              <Text style={[s.clearFiltersText, { color: colors.textPlaceholder }]}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <BoardNavbar />

      <FlatList
        data={loading ? [] : filteredNotices}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={s.listHeader}>
            <View style={[s.heroCard, { backgroundColor: colors.surface, shadowColor: colors.text, borderColor: colors.borderLight }]}>
              {renderHeader()}
              {renderSearchBar()}
            </View>
          </View>
        }
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {loading && (
              <View style={s.loader}>
                <ActivityIndicator size="large" color={colors.primary} />
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

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: colors.surface,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerContainer: {
    paddingBottom: Spacing.md,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    gap: 6,
    borderWidth: 1,
  },
  statBoxSuccess: {
    backgroundColor: colors.successBg,
  },
  statText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  statTextSuccess: {
    color: colors.success,
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
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
    ...Platform.select({
      web: { boxShadow: '0 1px 2px rgba(15,23,42,0.04)' } as any,
      default: {},
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
      default: {},
    }),
  },
  filterBtn: {
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
    paddingLeft: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tagChipTextActive: {
    color: colors.primary,
  },
  tagChipCount: {
    color: colors.textPlaceholder,
    fontSize: 12,
    fontWeight: '600',
  },
  tagChipCountActive: {
    color: colors.primary,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  clearFiltersText: {
    color: colors.textPlaceholder,
    fontSize: 12,
    fontWeight: '600',
  },
  resultsText: {
    color: colors.textPlaceholder,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: Platform.OS === 'web' ? Spacing.xl : Spacing.xl + BOTTOM_TAB_HEIGHT,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? Layout.maxWidthContent : undefined,
    alignSelf: 'center',
  },
});
