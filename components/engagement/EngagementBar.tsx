import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Heart, MessageSquare } from 'lucide-react-native';
import { AppColors, Radius, Spacing } from '@/constants/theme';
import { TargetType } from '@/lib/api';

type EngagementBarProps = {
  targetType: TargetType;
  targetId: string;
  comments: number;
  likes: number;
  liked: boolean;
  loading?: boolean;
  onPressComments?: () => void;
  onToggleLike: () => void;
};

export function EngagementBar({
  comments,
  likes,
  liked,
  loading,
  onPressComments,
  onToggleLike,
}: EngagementBarProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.statBtn}
        onPress={onPressComments}
        activeOpacity={0.7}
        disabled={!onPressComments}
      >
        <MessageSquare size={15} color={AppColors.textPlaceholder} />
        <Text style={styles.statText}>{comments}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statBtn}
        onPress={onToggleLike}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={AppColors.primary} />
        ) : (
          <Heart
            size={15}
            color={liked ? '#ef4444' : AppColors.textPlaceholder}
            fill={liked ? '#ef4444' : 'transparent'}
          />
        )}
        <Text style={[styles.statText, liked && styles.likedText]}>{likes}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md - 4,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  statText: {
    color: AppColors.textPlaceholder,
    fontSize: 13,
    fontWeight: '500',
  },
  likedText: {
    color: '#ef4444',
  },
});
