import AsyncStorage from '@react-native-async-storage/async-storage';

const getReadKey = (userId: string) => `@read_memos_${userId}`;

export async function markAsRead(id: string, userId: string) {
  if (!userId) return;
  try {
    const key = getReadKey(userId);
    const existing = await AsyncStorage.getItem(key);
    const readIds: string[] = existing ? JSON.parse(existing) : [];
    if (!readIds.includes(id)) {
      readIds.push(id);
      await AsyncStorage.setItem(key, JSON.stringify(readIds));
    }
  } catch (e) {
    console.error('Failed to mark memo as read', e);
  }
}

export async function getReadIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const key = getReadKey(userId);
    const existing = await AsyncStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    console.error('Failed to fetch read memos', e);
    return [];
  }
}
