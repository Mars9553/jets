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
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Sparkles, ArrowLeft } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { EventCard } from '@/components/events/EventCard';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { CommentsPanel } from '@/components/engagement/CommentsPanel';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { api, EventItem } from '@/lib/api';
import { getStatusLabel } from '@/data/events';
import { useUser } from '@/context/UserContext';
import { AppColors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [related, setRelated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    try {
      const [eventData, allEvents] = await Promise.all([
        api.getEvent(id, user?.userId),
        api.getEvents(user?.userId),
      ]);
      setEvent(eventData);
      setCommentCount(eventData.comments);
      setRelated(allEvents.filter((e) => e.id !== id).slice(0, 3));
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id, user?.userId]);

  useEffect(() => {
    loadEvent();
    if (id && user?.userId) {
      import('@/lib/readReceipts').then(({ markAsRead }) => {
        markAsRead(`event_${id}`, user.userId);
      });
    }
  }, [loadEvent, id, user?.userId]);

  const { likes, liked, loading: likeLoading, toggleLike } = useLikeToggle(
    'event',
    id ?? '',
    { likes: event?.likes ?? 0, liked: false }
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BoardNavbar />
        <ActivityIndicator style={styles.loader} color={AppColors.primary} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <BoardNavbar />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Event not found</Text>
          <TouchableOpacity onPress={() => router.replace('/event_page')}>
            <Text style={styles.backLink}>← Back to events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusLabel = getStatusLabel(event.status);
  const isPast = event.status === 'past';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.surface} />
      <BoardNavbar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.page}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={16} color={AppColors.primary} />
            <Text style={styles.backLink}>Back to events</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <EngagementBar
            targetType="event"
            targetId={event.id}
            comments={commentCount}
            likes={likes}
            liked={liked}
            loading={likeLoading}
            onToggleLike={toggleLike}
          />

          <View style={[styles.mainSection, isWide && styles.mainSectionWide]}>
            <View style={[styles.gallery, isWide && styles.galleryWide]}>
              <View style={[styles.galleryRow, isWide && styles.galleryRowWide]}>
                {(event.gallery ?? []).map((uri) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={[styles.galleryImage, isWide && styles.galleryImageWide]}
                    contentFit="cover"
                    transition={200}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.sidebar, isWide && styles.sidebarWide]}>
              <Text style={styles.sidebarTitle}>Highlights</Text>
              {(event.highlights ?? []).map((item) => (
                <View key={item} style={styles.highlightRow}>
                  <Sparkles size={14} color={AppColors.primary} />
                  <Text style={styles.highlightText}>{item}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <Text style={styles.sidebarTitle}>Event Details</Text>

              <View style={styles.detailRow}>
                <Calendar size={16} color={AppColors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{event.date}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Clock size={16} color={AppColors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{event.time}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MapPin size={16} color={AppColors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Venue</Text>
                  <Text style={styles.detailValue}>{event.venue}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.statusDot, isPast && styles.statusDotPast]} />
                <View>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>{statusLabel} Event</Text>
                </View>
              </View>

              <Text style={styles.organizer}>Organized by {event.organizer}</Text>
            </View>
          </View>

          <CommentsPanel
            targetType="event"
            targetId={event.id}
            onCommentAdded={() => setCommentCount((c) => c + 1)}
          />

          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Events</Text>
            <Text style={styles.relatedSubtitle}>You might also be interested in</Text>

            <View style={[styles.relatedGrid, isWide && styles.relatedGridWide]}>
              {related.map((item) => (
                <View key={item.id} style={[styles.relatedItem, isWide && styles.relatedItemWide]}>
                  <EventCard event={item} compact />
                </View>
              ))}
            </View>
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
  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: Spacing.sm + 4,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    color: AppColors.textMuted,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  mainSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  mainSectionWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gallery: {
    marginBottom: 0,
  },
  galleryWide: {
    flex: 2,
  },
  galleryRow: {
    gap: Spacing.sm + 4,
  },
  galleryRowWide: {
    flexDirection: 'row',
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    backgroundColor: AppColors.illustration,
  },
  galleryImageWide: {
    flex: 1,
    height: 220,
  },
  sidebar: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md + 4,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    ...Shadow.card,
  },
  sidebarWide: {
    flex: 1,
    minWidth: 260,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: Spacing.sm + 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  highlightText: {
    fontSize: 14,
    color: AppColors.textMuted,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.borderLight,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.sm + 4,
  },
  detailLabel: {
    fontSize: 11,
    color: AppColors.textPlaceholder,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
    marginTop: 2,
  },
  statusDotPast: {
    backgroundColor: AppColors.textPlaceholder,
  },
  organizer: {
    fontSize: 13,
    color: AppColors.textPlaceholder,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  relatedSection: {
    width: '100%',
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 4,
  },
  relatedSubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    marginBottom: Spacing.lg,
  },
  relatedGrid: {
    gap: Spacing.md,
  },
  relatedGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedItem: {
    width: '100%',
  },
  relatedItemWide: {
    flex: 1,
    minWidth: 260,
    maxWidth: '33%',
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
});
