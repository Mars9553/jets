import React, { memo, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { EventItem } from '@/lib/api';
import { getStatusLabel } from '@/data/events';
import { Radius, Shadow, Spacing } from '@/constants/theme';

import { useTheme } from '@/context/ThemeContext';

type EventCardProps = {
  event: EventItem;
  compact?: boolean;
};

export const EventCard = memo(function EventCard({ event, compact = false }: EventCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { colors } = useTheme();
  const s = styles(colors);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleMouseEnter = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true }).start();
  }, []);

  const handleMouseLeave = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  }, []);

  const statusLabel = getStatusLabel(event.status);
  const isPast = event.status === 'past';

  const { likes, liked, loading, toggleLike } = useLikeToggle('event', event.id, {
    likes: event.likes,
    liked: event.liked ?? false,
  });

  return (
    <Animated.View
      style={[
        s.card,
        { backgroundColor: colors.surface, borderColor: colors.borderLight, transform: [{ scale: scaleAnim }] },
        compact && s.cardCompact,
        isWide && !compact && s.cardWide,
      ]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...({ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } as any)}
    >
      <Image
        source={{ uri: event.image }}
        style={[s.image, compact && s.imageCompact]}
        contentFit="cover"
        transition={200}
      />

      <View style={s.body}>
        <View style={[s.statusBadge, { backgroundColor: isPast ? colors.inputBg : colors.primaryLight }]}>
          <Text style={[s.statusText, { color: isPast ? colors.textMuted : colors.primary }]}>
            {statusLabel}
          </Text>
        </View>

        <Text style={[s.title, compact && s.titleCompact, { color: colors.textSecondary }]} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={[s.description, { color: colors.textMuted }]} numberOfLines={2}>
          {event.shortDescription}
        </Text>

        <View style={s.dateRow}>
          <Calendar size={14} color={colors.textPlaceholder} />
          <Text style={[s.dateText, { color: colors.textPlaceholder }]}>{event.date}</Text>
        </View>

        <View style={s.engagementRow}>
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
          style={[s.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/event/${event.id}` as any)}
          activeOpacity={0.85}
        >
          <Text style={[s.buttonText, { color: colors.surface }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
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
    backgroundColor: colors.illustration,
  },
  imageCompact: {
    height: 130,
  },
  body: {
    padding: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.sm - 2,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 23,
  },
  titleCompact: {
    fontSize: 15,
  },
  description: {
    fontSize: 13,
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
  },
  engagementRow: {
    marginBottom: Spacing.sm + 4,
  },
  button: {
    borderRadius: Radius.sm,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
