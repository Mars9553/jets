import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Sparkles, ArrowLeft, X } from 'lucide-react-native';
import { BoardNavbar } from '@/components/board/BoardNavbar';
import { BoardFooter } from '@/components/board/BoardFooter';
import { EventCard } from '@/components/events/EventCard';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { CommentsPanel } from '@/components/engagement/CommentsPanel';
import { useLikeToggle } from '@/hooks/useLikeToggle';
import { api, EventItem } from '@/lib/api';
import { getStatusLabel } from '@/data/events';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Layout, Radius, Shadow, Spacing } from '@/constants/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { colors, resolvedTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [related, setRelated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    { likes: event?.likes ?? 0, liked: event?.liked ?? false }
  );

  const s = styles(colors);

  if (loading) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <BoardNavbar />
        <ActivityIndicator style={s.loader} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <BoardNavbar />
        <View style={s.notFound}>
          <Text style={[s.notFoundTitle, { color: colors.textSecondary }]}>Event not found</Text>
          <TouchableOpacity onPress={() => router.replace('/event_page')}>
            <Text style={[s.backLink, { color: colors.primary }]}>← Back to events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusLabel = getStatusLabel(event.status);
  const isPast = event.status === 'past';

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <BoardNavbar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={s.page}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={16} color={colors.primary} />
            <Text style={[s.backLink, { color: colors.primary }]}>Back to events</Text>
          </TouchableOpacity>

          {event.image ? (
            <Pressable onPress={() => setSelectedImage(event.image)} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
              <View style={s.coverWrap}>
                <Image
                  source={{ uri: event.image }}
                  style={s.coverImage}
                  contentFit="cover"
                  transition={200}
                  pointerEvents="none"
                />
                <View style={[s.coverOverlay, { backgroundColor: colors.overlay }]} pointerEvents="none" />
                <View style={s.coverContent} pointerEvents="none">
                  <View style={[s.statusPill, { backgroundColor: colors.surface }]}>
                    <Text style={[s.statusPillText, { color: colors.primary }]}>{statusLabel} Event</Text>
                  </View>
                  <Text style={[s.title, { color: '#fff' }]}>{event.title}</Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <Text style={[s.title, { color: colors.text }]}>{event.title}</Text>
          )}

          {!event.image && (
            <Text style={[s.description, { color: colors.textMuted }]}>{event.description}</Text>
          )}

          <EngagementBar
            targetType="event"
            targetId={event.id}
            comments={commentCount}
            likes={likes}
            liked={liked}
            loading={likeLoading}
            onToggleLike={toggleLike}
          />

          <View style={[s.mainSection, isWide && s.mainSectionWide]}>
            <View style={[s.gallery, isWide && s.galleryWide]}>
              <View style={[s.galleryRow, isWide && s.galleryRowWide]}>
                {(event.gallery ?? []).map((uri) => (
                  <Pressable key={uri} onPress={() => setSelectedImage(uri)} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                    <Image
                      source={{ uri }}
                      style={[s.galleryImage, isWide && s.galleryImageWide]}
                      contentFit="cover"
                      transition={200}
                      pointerEvents="none"
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={[s.sidebar, isWide && s.sidebarWide, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Text style={[s.sidebarTitle, { color: colors.textSecondary }]}>Highlights</Text>
              {(event.highlights ?? []).map((item) => (
                <View key={item} style={s.highlightRow}>
                  <Sparkles size={14} color={colors.primary} />
                  <Text style={[s.highlightText, { color: colors.textMuted }]}>{item}</Text>
                </View>
              ))}

              <View style={[s.divider, { backgroundColor: colors.borderLight }]} />

              <Text style={[s.sidebarTitle, { color: colors.textSecondary }]}>Event Details</Text>

               <View style={s.detailRow}>
                 <Calendar size={16} color={colors.primary} />
                 <View>
                   <Text style={[s.detailLabel, { color: colors.textPlaceholder }]}>Date</Text>
                   <Text style={[s.detailValue, { color: colors.textSecondary }]}>{event.date}</Text>
                 </View>
               </View>

               <View style={s.detailRow}>
                 <Clock size={16} color={colors.primary} />
                 <View>
                   <Text style={[s.detailLabel, { color: colors.textPlaceholder }]}>Time</Text>
                   <Text style={[s.detailValue, { color: colors.textSecondary }]}>{event.time}</Text>
                 </View>
               </View>

               <View style={s.detailRow}>
                 <MapPin size={16} color={colors.primary} />
                 <View>
                   <Text style={[s.detailLabel, { color: colors.textPlaceholder }]}>Venue</Text>
                   <Text style={[s.detailValue, { color: colors.textSecondary }]}>{event.venue}</Text>
                 </View>
               </View>

               <View style={s.detailRow}>
                 <View style={[s.statusDot, { backgroundColor: isPast ? colors.textPlaceholder : colors.primary }]} />
                 <View>
                   <Text style={[s.detailLabel, { color: colors.textPlaceholder }]}>Status</Text>
                   <Text style={[s.detailValue, { color: colors.textSecondary }]}>{statusLabel} Event</Text>
                 </View>
               </View>

              <Text style={[s.organizer, { color: colors.textPlaceholder }]}>Organized by {event.organizer}</Text>
            </View>
          </View>

          {event.image && (
            <Text style={[s.description, { color: colors.textMuted }]}>{event.description}</Text>
          )}

          <CommentsPanel
            targetType="event"
            targetId={event.id}
            onCommentAdded={() => setCommentCount((c) => c + 1)}
          />

          <View style={s.relatedSection}>
            <Text style={[s.relatedTitle, { color: colors.text }]}>Related Events</Text>
            <Text style={[s.relatedSubtitle, { color: colors.textMuted }]}>You might also be interested in</Text>

            <View style={[s.relatedGrid, isWide && s.relatedGridWide]}>
              {related.map((item) => (
                <View key={item.id} style={[s.relatedItem, isWide && s.relatedItemWide]}>
                  <EventCard event={item} compact />
                </View>
              ))}
            </View>
          </View>

          <BoardFooter />
        </View>
      </ScrollView>

      {selectedImage ? (
        <View style={s.imageModalOverlay}>
          <Pressable style={s.imageModalBackground} onPress={() => setSelectedImage(null)} />
          <View style={s.imageModalContent}>
            <Pressable style={s.imageModalClose} onPress={() => setSelectedImage(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={24} color="#fff" />
            </Pressable>
            <Image
              source={{ uri: selectedImage }}
              style={s.imageModalImage}
              contentFit="contain"
              transition={200}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '600',
    fontSize: 14,
  },
  coverWrap: {
    width: '100%',
    height: 260,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  coverOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: Radius.lg,
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    gap: Spacing.sm + 4,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: Spacing.sm + 4,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
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
    backgroundColor: colors.illustration,
  },
  galleryImageWide: {
    flex: 1,
    height: 220,
  },
  sidebar: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 4,
    borderWidth: 1,
    ...Shadow.card,
  },
  sidebarWide: {
    flex: 1,
    minWidth: 260,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
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
    flex: 1,
  },
  divider: {
    height: 1,
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
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 1,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
  },
  organizer: {
    fontSize: 13,
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
    marginBottom: 4,
  },
  relatedSubtitle: {
    fontSize: 14,
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
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalBackground: {
    position: 'absolute',
    inset: 0,
  },
  imageModalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  imageModalImage: {
    width: '100%',
    height: '100%',
  },
});
