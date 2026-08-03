import React, { memo, useRef, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Download } from 'lucide-react-native';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { useNoticeDownload, getAvailableFormats } from '@/hooks/useNoticeDownload';
import { NoticeItem } from '@/lib/api';
import { AppColors, Radius, Spacing, Shadow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

function CategoryTag({ category, colors, s }: { category: string; colors: typeof AppColors; s: ReturnType<typeof styles> }) {
  const tagColors = AppColors.category[category] ?? AppColors.category.General;
  const bg = colors.category[category]?.bg ?? tagColors.bg;
  const text = colors.category[category]?.text ?? tagColors.text;
  return (
    <View style={[s.tag, { backgroundColor: bg }]}>
      <Text style={[s.tagText, { color: text }]}>{category}</Text>
    </View>
  );
}

export const NoticeListItem = memo(function NoticeListItem({ item }: { item: NoticeItem }) {
  const router = useRouter();
  const { colors } = useTheme();
  const s = styles(colors);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleMouseEnter = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true }).start();
  }, []);

  const handleMouseLeave = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  }, []);

  const { likes, liked, loading, toggleLike } = useLikeToggle('notice', item.id, {
    likes: item.likes,
    liked: item.liked ?? false,
  });
  const { downloading, promptDownload } = useNoticeDownload();

  /** Whether this notice has any downloadable attachment */
  const { pdf: hasPdf, image: hasImage } = getAvailableFormats(item);
  const hasAttachment = hasPdf || hasImage;

  const MAX_DESC_LINES = 4;
  const [descLines, setDescLines] = useState(0);
  const [fullDescLines, setFullDescLines] = useState(0);
  const isDescTruncated = fullDescLines > descLines;

  return (
    <Animated.View
      style={[
        s.card,
        { transform: [{ scale: scaleAnim }] },
      ]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...({ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } as any)}
    >
      <View style={s.cardTop}>
        <CategoryTag category={item.category} colors={colors} s={s} />
        <View style={s.cardMeta}>
          <Calendar size={13} color={colors.textPlaceholder} />
          <Text style={s.metaText}>{item.date}</Text>
        </View>
      </View>

      <Text style={[s.cardTitle, { color: colors.textSecondary }]}>{item.title}</Text>

      <View style={s.descWrapper}>
        <Text
          style={[s.cardDesc, { color: colors.textMuted }]}
          numberOfLines={MAX_DESC_LINES}
          onTextLayout={(e) => setDescLines(e.nativeEvent.lines.length)}
        >
          {item.summary ?? item.description}
        </Text>
        <Text
          style={[s.cardDesc, { color: colors.textMuted, opacity: 0, position: 'absolute', left: 0, right: 0, top: 0 }]}
          onTextLayout={(e) => setFullDescLines(e.nativeEvent.lines.length)}
        >
          {item.summary ?? item.description}
        </Text>
        {isDescTruncated && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(`/notice/${item.id}` as any)}
          >
            <Text style={[s.viewFullHint, { color: colors.primary }]}>View full notice →</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[s.cardFooter, { borderTopColor: colors.borderLight }]}>
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

        <View style={s.cardActions}>
          <TouchableOpacity
            style={s.viewBtn}
            activeOpacity={0.85}
            onPress={() => router.push(`/notice/${item.id}` as any)}
          >
            <Text style={s.viewBtnText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.downloadBtn,
              !hasAttachment && s.downloadBtnDisabled,
              { borderColor: colors.border, backgroundColor: colors.inputBg },
            ]}
            activeOpacity={0.75}
            onPress={() => promptDownload(item)}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Download
                size={16}
                color={hasAttachment ? colors.primary : colors.textPlaceholder}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});


const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md - 4,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
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
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: Spacing.md - 4,
  },
  descWrapper: {
    position: 'relative',
  },
  viewFullHint: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: -Spacing.md + 4,
    marginBottom: Spacing.md - 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: Spacing.sm + 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  viewBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  viewBtnText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 13,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtnDisabled: {
    opacity: 0.45,
  },
});
