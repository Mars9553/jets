import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { EventItem } from '@/lib/api';
import { getStatusLabel } from '@/data/events';
import { AppColors, Radius, Shadow, Spacing } from '@/constants/theme';

type EventCardProps = {
  event: EventItem;
  compact?: boolean;
};

export const EventCard = memo(function EventCard({ event, compact = false }: EventCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const statusLabel = getStatusLabel(event.status);
  const isPast = event.status === 'past';

  const { likes, liked, loading, toggleLike } = useLikeToggle('event', event.id, {
    likes: event.likes,
    liked: false,
  });

  return (
    <View style={[styles.card, compact && styles.cardCompact, isWide && !compact && styles.cardWide]}>
      <Image
        source={{ uri: event.image }}
        style={[styles.image, compact && styles.imageCompact]}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.body}>
        <View style={[styles.statusBadge, isPast && styles.statusPast]}>
          <Text style={[styles.statusText, isPast && styles.statusTextPast]}>{statusLabel}</Text>
        </View>

        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {event.shortDescription}
        </Text>

        <View style={styles.dateRow}>
          <Calendar size={14} color={AppColors.textPlaceholder} />
          <Text style={styles.dateText}>{event.date}</Text>
        </View>

        <View style={styles.engagementRow}>
          <EngagementBar
            targetType="event"
            targetId={event.id}
            comments={event.comments}
            likes={likes}
            liked={liked}
            loading={loading}
            onToggleLike={toggleLike}
            onPressComments={() => router.push(`/event/${event.id}` as any)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/event/${event.id}` as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...Shadow.card,
    flex: 1,
    minWidth: 260,
  },
  cardCompact: {
    minWidth: 220,
  },
  cardWide: {
    maxWidth: undefined,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: AppColors.illustration,
  },
  imageCompact: {
    height: 130,
  },
  body: {
    padding: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.sm - 2,
    marginBottom: Spacing.sm,
  },
  statusPast: {
    backgroundColor: AppColors.inputBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
  },
  statusTextPast: {
    color: AppColors.textMuted,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: 6,
    lineHeight: 23,
  },
  titleCompact: {
    fontSize: 15,
  },
  description: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
    marginBottom: Spacing.sm + 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: 13,
    color: AppColors.textPlaceholder,
  },
  engagementRow: {
    marginBottom: Spacing.sm + 4,
  },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});
