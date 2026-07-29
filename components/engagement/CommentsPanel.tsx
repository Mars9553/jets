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
import { AppColors, Radius, Spacing } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';

type CommentsPanelProps = {
  targetType: TargetType;
  targetId: string;
  onCommentAdded?: () => void;
};

export function CommentsPanel({ targetType, targetId, onCommentAdded }: CommentsPanelProps) {
  const { user } = useUser();
  const { showToast } = useToast();
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
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>

      {loading ? (
        <ActivityIndicator color={AppColors.primary} style={styles.loader} />
      ) : comments.length === 0 ? (
        <Text style={styles.empty}>No comments yet. Start the conversation.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{comment.initials}</Text>
            </View>
            <View style={styles.commentBody}>
              <View style={styles.commentTop}>
                <Text style={styles.author}>{comment.author}</Text>
                <Text style={styles.time}>{comment.date}</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          </View>
        ))
      )}

      {user ? (
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
            placeholder="Write a comment..."
            placeholderTextColor={AppColors.textPlaceholder}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || submitting) && styles.sendBtnDisabled]}
            onPress={handleSubmit}
            disabled={!text.trim() || submitting}
          >
            <Send size={16} color={AppColors.surface} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.signInHint}>Sign in to leave a comment.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textSecondary,
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.md,
  },
  empty: {
    color: AppColors.textPlaceholder,
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
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  commentBody: {
    flex: 1,
    backgroundColor: AppColors.inputBg,
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
    color: AppColors.textSecondary,
  },
  time: {
    fontSize: 11,
    color: AppColors.textPlaceholder,
  },
  commentText: {
    fontSize: 14,
    color: AppColors.textMuted,
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
    borderColor: AppColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: AppColors.text,
    backgroundColor: AppColors.surface,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: AppColors.textPlaceholder,
  },
  signInHint: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: AppColors.textMuted,
    textAlign: 'center',
  },
});
