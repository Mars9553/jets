import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Download } from 'lucide-react-native';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { useNoticeDownload, getAvailableFormats } from '@/hooks/useNoticeDownload';
import { NoticeItem } from '@/lib/api';
import { AppColors, Radius, Shadow, Spacing } from '@/constants/theme';

function CategoryTag({ category }: { category: string }) {
  const colors = AppColors.category[category] ?? AppColors.category.General;
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }]}>
      <Text style={[styles.tagText, { color: colors.text }]}>{category}</Text>
    </View>
  );
}

export const NoticeListItem = memo(function NoticeListItem({ item }: { item: NoticeItem }) {
  const router = useRouter();
  const { likes, liked, loading, toggleLike } = useLikeToggle('notice', item.id, {
    likes: item.likes,
    liked: item.liked ?? false,
  });
  const { downloading, promptDownload } = useNoticeDownload();

  /** Whether this notice has any downloadable attachment */
  const { pdf: hasPdf, image: hasImage } = getAvailableFormats(item);
  const hasAttachment = hasPdf || hasImage;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <CategoryTag category={item.category} />
        <View style={styles.cardMeta}>
          <Calendar size={13} color={AppColors.textPlaceholder} />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <EngagementBar
          targetType="notice"
          targetId={item.id}
          comments={item.comments}
          likes={likes}
          liked={liked}
          loading={loading}
          onToggleLike={toggleLike}
          onPressComments={() => router.push(`/notice/${item.id}` as any)}
        />

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.85}
            onPress={() => router.push(`/notice/${item.id}` as any)}
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.downloadBtn,
              !hasAttachment && styles.downloadBtnDisabled,
            ]}
            activeOpacity={0.75}
            onPress={() => promptDownload(item)}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={AppColors.primary} />
            ) : (
              <Download
                size={16}
                color={hasAttachment ? AppColors.primary : AppColors.textPlaceholder}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});


const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md - 4,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm + 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.sm - 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDesc: {
    color: AppColors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: Spacing.md - 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: AppColors.textPlaceholder,
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
    paddingTop: Spacing.sm + 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  viewBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  viewBtnText: {
    color: AppColors.surface,
    fontWeight: '600',
    fontSize: 13,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputBg,
  },
  downloadBtnDisabled: {
    opacity: 0.45,
  },
});
