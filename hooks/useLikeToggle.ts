import { useState, useEffect } from 'react';
import { api, TargetType } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export function useLikeToggle(
  targetType: TargetType,
  targetId: string,
  initial: { likes: number; liked: boolean }
) {
  const { user } = useUser();
  const { showToast } = useToast();
  const [likes, setLikes] = useState(initial.likes);
  const [liked, setLiked] = useState(initial.liked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(initial.likes);
    setLiked(initial.liked);
  }, [initial.likes, initial.liked, targetId]);

  const toggleLike = async () => {
    if (!user) {
      showToast('Please sign in to like this item.', 'info');
      return;
    }

    setLoading(true);
    try {
      const result = await api.toggleLike({
        targetType,
        targetId,
        userId: user.userId,
      });
      setLikes(result.likes);
      setLiked(result.liked);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update like', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { likes, liked, loading, toggleLike, setLikes, setLiked };
}

