import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Download } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { CommentsPanel } from '@/components/engagement/CommentsPanel';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { useNoticeDownload } from '@/hooks/useNoticeDownload';
import { api, NoticeItem } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { AppColors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';

function CategoryTag({ category, colors }: { category: string; colors: typeof AppColors }) {
  const s = styles(colors);
  const bg = colors.category[category]?.bg ?? AppColors.category[category]?.bg ?? AppColors.category.General.bg;
  const text = colors.category[category]?.text ?? AppColors.category[category]?.text ?? AppColors.category.General.text;
  return (
    <View style={[s.tag, { backgroundColor: bg }]}>
      <Text style={[s.tagText, { color: text }]}>{category}</Text>
    </View>
  );
}

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { colors, resolvedTheme } = useTheme();
  const s = styles(colors);

  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  const loadNotice = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.getNotice(id, user?.userId);
      setNotice(data);
      setCommentCount(data.comments);
    } catch {
      setNotice(null);
    } finally {
      setLoading(false);
    }
  }, [id, user?.userId]);

  useEffect(() => {
    loadNotice();
    if (id && user?.userId) {
      import('@/lib/readReceipts').then(({ markAsRead }) => {
        markAsRead(`notice_${id}`, user.userId);
      });
    }
  }, [loadNotice, id, user?.userId]);

  const { likes, liked, loading: likeLoading, toggleLike } = useLikeToggle(
    'notice',
    id ?? '',
    { likes: notice?.likes ?? 0, liked: notice?.liked ?? false }
  );

  const { downloading, promptDownload } = useNoticeDownload();

  if (loading) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <BoardNavbar />
        <ActivityIndicator style={s.loader} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!notice) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <BoardNavbar />
        <View style={s.notFound}>
          <Text style={[s.notFoundTitle, { color: colors.textSecondary }]}>Notice not found</Text>
          <TouchableOpacity onPress={() => router.replace('/user_notice')}>
            <Text style={[s.backLink, { color: colors.primary }]}>← Back to notices</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <BoardNavbar />

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.page}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={16} color={colors.primary} />
            <Text style={[s.backLink, { color: colors.primary }]}>Back to notices</Text>
          </TouchableOpacity>

          <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={s.cardTop}>
              <CategoryTag category={notice.category} colors={colors} />
              <View style={s.dateRow}>
                <Calendar size={14} color={colors.textPlaceholder} />
                <Text style={[s.metaText, { color: colors.textPlaceholder }]}>{notice.date}</Text>
              </View>
            </View>

            <View style={s.titleRow}>
              <Text style={[s.title, { flex: 1, color: colors.text }]}>{notice.title}</Text>
              <TouchableOpacity
                style={[s.downloadBtn, { backgroundColor: colors.primaryLight, borderColor: colors.primaryMuted }]}
                onPress={() => promptDownload(notice)}
                disabled={downloading}
                activeOpacity={0.75}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Download size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <Text style={[s.description, { color: colors.textMuted }]}>{notice.description}</Text>

            <EngagementBar
              targetType="notice"
              targetId={notice.id}
              comments={commentCount}
              likes={likes}
              liked={liked}
              loading={likeLoading}
              onToggleLike={toggleLike}
            />

            <CommentsPanel
              targetType="notice"
              targetId={notice.id}
              onCommentAdded={() => setCommentCount((c) => c + 1)}
            />
          </View>

          <BoardFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loader: { marginTop: Spacing.xl },
  scrollContent: { width: '100%', alignItems: 'center' },
  page: {
    width: '100%',
    maxWidth: Layout.maxWidthContent,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  backLink: {
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.sm - 2,
  },
  tagText: { fontSize: 11, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
});
