import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { api, CommentItem, TargetType } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { Radius, Spacing } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

type CommentsPanelProps = {
  targetType: TargetType;
  targetId: string;
  onCommentAdded?: () => void;
};

export function CommentsPanel({ targetType, targetId, onCommentAdded }: CommentsPanelProps) {
  const { user } = useUser();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const s = styles(colors);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await api.getComments(targetType, targetId, user?.userId);
      setComments(data);
    } catch (err) {
      showToast('Failed to load comments', 'error');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [targetType, targetId, user?.userId]);

  const handleSubmit = async () => {
    if (!user || !text.trim()) return;

    setSubmitting(true);
    try {
      const created = await api.addComment({
        targetType,
        targetId,
        userId: user.userId,
        authorName: user.fullName,
        text: text.trim(),
      });
      setComments((prev) => [created, ...prev]);
      setText('');
      showToast('Comment posted successfully', 'success');
      onCommentAdded?.();
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <View style={[s.container, { borderTopColor: colors.borderLight }]}>
      <Text style={[s.title, { color: colors.textSecondary }]}>Comments ({comments.length})</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={s.loader} />
      ) : comments.length === 0 ? (
        <Text style={[s.empty, { color: colors.textPlaceholder }]}>No comments yet. Start the conversation.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={s.comment}>
            <View style={[s.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[s.avatarText, { color: colors.primary }]}>{comment.initials}</Text>
            </View>
            <View style={[s.commentBody, { backgroundColor: colors.inputBg }]}>
              <View style={s.commentTop}>
                <Text style={[s.author, { color: colors.textSecondary }]}>{comment.author}</Text>
                <Text style={[s.time, { color: colors.textPlaceholder }]}>{comment.date}</Text>
              </View>
              <Text style={[s.commentText, { color: colors.textMuted }]}>{comment.content}</Text>
            </View>
          </View>
        ))
      )}

      {user ? (
        <View style={s.inputRow}>
          <TextInput
            style={[
              s.input,
              { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textPlaceholder}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: colors.primary }, (!text.trim() || submitting) && { backgroundColor: colors.textPlaceholder }]}
            onPress={handleSubmit}
            disabled={!text.trim() || submitting}
          >
            <Send size={16} color={colors.surface} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[s.signInHint, { color: colors.textMuted }]}>Sign in to leave a comment.</Text>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.md,
  },
  empty: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  comment: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sm + 4,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
  },
  commentBody: {
    flex: 1,
    borderRadius: Radius.md,
    padding: 10,
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
  },
  time: {
    fontSize: 11,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInHint: {
    marginTop: Spacing.md,
    fontSize: 13,
    textAlign: 'center',
  },
});
