import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
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
import { AppColors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';

function CategoryTag({ category }: { category: string }) {
  const colors = AppColors.category[category] ?? AppColors.category.General;
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }]}>
      <Text style={[styles.tagText, { color: colors.text }]}>{category}</Text>
    </View>
  );
}

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
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
      <SafeAreaView style={styles.container}>
        <BoardNavbar />
        <ActivityIndicator style={styles.loader} color={AppColors.primary} />
      </SafeAreaView>
    );
  }

  if (!notice) {
    return (
      <SafeAreaView style={styles.container}>
        <BoardNavbar />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Notice not found</Text>
          <TouchableOpacity onPress={() => router.replace('/user_notice')}>
            <Text style={styles.backLink}>← Back to notices</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.surface} />
      <BoardNavbar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color={AppColors.primary} />
            <Text style={styles.backLink}>Back to notices</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.cardTop}>
              <CategoryTag category={notice.category} />
              <View style={styles.dateRow}>
                <Calendar size={14} color={AppColors.textPlaceholder} />
                <Text style={styles.metaText}>{notice.date}</Text>
              </View>
            </View>

            <View style={styles.titleRow}>
              <Text style={[styles.title, { flex: 1 }]}>{notice.title}</Text>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => promptDownload(notice)}
                disabled={downloading}
                activeOpacity={0.75}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={AppColors.primary} />
                ) : (
                  <Download size={18} color={AppColors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>{notice.description}</Text>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
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
    color: AppColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
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
  metaText: { color: AppColors.textPlaceholder, fontSize: 13 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: AppColors.textMuted,
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
    color: AppColors.textSecondary,
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
    borderColor: AppColors.primaryMuted,
    backgroundColor: AppColors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
});
