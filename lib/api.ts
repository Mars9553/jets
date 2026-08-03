import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Derives the API base URL automatically — no more hardcoded IPs.
 *
 * Priority:
 *  1. EXPO_PUBLIC_API_URL env var  → use for production / staging
 *  2. Dev + native device          → extract host from Metro's hostUri
 *                                    (same machine = same IP as the API server)
 *  3. Dev + web / emulator         → localhost works fine
 */
function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  if (__DEV__ && Platform.OS !== 'web') {
    const metroHost =
      Constants.expoConfig?.hostUri?.split(':')[0] ??
      (Constants.manifest as any)?.debuggerHost?.split(':')[0];

    if (metroHost) {
      return `http://${metroHost}:3001`;
    }
  }

  if (__DEV__) {
    return 'http://localhost:3001';
  }

  return '';
}

export const API_URL = getApiUrl();


export type TargetType = 'notice' | 'event';

export interface BoardUser {
  userId: string;
  matNumber: string;
  fullName: string;
  initials: string;
  level?: string;
  faculty?: string;
  department?: string;
}

export interface CommentItem {
  id: string;
  author: string;
  initials: string;
  content: string;
  date: string;
  userId?: string;
}

export interface NoticeItem {
  id: string;
  category: string;
  title: string;
  summary?: string;
  description: string;
  date: string;
  createdAt?: string;
  comments: number;
  likes: number;
  liked?: boolean;
  read?: boolean;
  /** Generic attachment URL (Supabase Storage public URL) */
  fileUrl?: string;
  /** Explicit PDF attachment URL */
  pdfUrl?: string;
  /** Explicit image attachment URL */
  imageUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  time?: string;
  venue?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  category?: string;
  image?: string;
  gallery?: string[];
  highlights?: string[];
  organizer?: string;
  comments: number;
  likes: number;
  liked?: boolean;
  attending: number;
  userAttending: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3 * 60 * 1000); // 3 minutes

  let lastError: any;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(id);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 3 minutes. Please check if your server is running and accessible.');
      }
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  throw lastError?.message?.includes('Failed to fetch')
    ? new Error('Unable to connect to the server. Please make sure the API server is running.')
    : lastError;
}

export const api = {
  health: () => request<{ ok: boolean }>('/api/health'),

  login: (matNumber: string, password: string) =>
    request<BoardUser>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ matNumber, password }),
    }),

  register: (payload: {
    matNumber: string;
    fullName: string;
    level: string;
    password: string;
    faculty: string;
    department: string;
  }) =>
    request<BoardUser>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getNotices: (userId?: string) =>
    request<NoticeItem[]>(`/api/notices${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),

  getNotice: (id: string, userId?: string) =>
    request<NoticeItem>(
      `/api/notices/${id}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`
    ),

  getEvents: (userId?: string) =>
    request<EventItem[]>(`/api/events${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),

  getEvent: (id: string, userId?: string) =>
    request<EventItem>(
      `/api/events/${id}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`
    ),

  getComments: (targetType: TargetType, targetId: string, userId?: string) =>
    request<CommentItem[]>(
      `/api/comments/${targetType}/${targetId}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`
    ),

  addComment: (payload: {
    targetType: TargetType;
    targetId: string;
    userId: string;
    authorName: string;
    text: string;
  }) =>
    request<CommentItem>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  toggleLike: (payload: { targetType: TargetType; targetId: string; userId: string }) =>
    request<{ liked: boolean; likes: number }>('/api/likes/toggle', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
