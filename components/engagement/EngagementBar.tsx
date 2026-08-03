import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Heart, MessageSquare } from 'lucide-react-native';
import { Spacing } from '@/constants/theme';
import { TargetType } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

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
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <View style={s.row}>
      <TouchableOpacity
        style={s.statBtn}
        onPress={onPressComments}
        activeOpacity={0.7}
        disabled={!onPressComments}
      >
        <MessageSquare size={15} color={colors.textPlaceholder} />
        <Text style={[s.statText, { color: colors.textPlaceholder }]}>{comments}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.statBtn}
        onPress={onToggleLike}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Heart
            size={15}
            color={liked ? '#ef4444' : colors.textPlaceholder}
            fill={liked ? '#ef4444' : 'transparent'}
          />
        )}
        <Text style={[s.statText, liked && s.likedText, { color: liked ? '#ef4444' : colors.textPlaceholder }]}>{likes}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
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
    fontSize: 13,
    fontWeight: '500',
  },
  likedText: {
    color: '#ef4444',
  },
});
