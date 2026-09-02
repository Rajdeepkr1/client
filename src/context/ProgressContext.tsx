import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as progressApi from '../api/progress';
import type { ProgressItem } from '../types';
import { useAuth } from './AuthContext';

interface ProgressContextValue {
  items: ProgressItem[];
  bookmarked: ProgressItem[];
  readCount: number;
  isRead: (subject: string, topicId: string) => boolean;
  isBookmarked: (subject: string, topicId: string) => boolean;
  toggleRead: (subject: string, topicId: string) => Promise<void>;
  toggleBookmark: (subject: string, topicId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function key(subject: string, topicId: string) {
  return `${subject}::${topicId}`;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<ProgressItem[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    progressApi
      .listProgress()
      .then(setItems)
      .catch(() => setItems([]));
  }, [isLoggedIn]);

  const readKeys = useMemo(
    () => new Set(items.filter((p) => p.read).map((p) => key(p.subject, p.topicId))),
    [items]
  );
  const bookmarkedKeys = useMemo(
    () => new Set(items.filter((p) => p.bookmarked).map((p) => key(p.subject, p.topicId))),
    [items]
  );

  const applyUpdate = useCallback((updated: ProgressItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.subject === updated.subject && p.topicId === updated.topicId);
      if (idx === -1) return [...prev, updated];
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }, []);

  const toggleRead = useCallback(
    async (subject: string, topicId: string) => {
      const updated = await progressApi.toggleRead(subject, topicId);
      applyUpdate(updated);
    },
    [applyUpdate]
  );

  const toggleBookmark = useCallback(
    async (subject: string, topicId: string) => {
      const updated = await progressApi.toggleBookmark(subject, topicId);
      applyUpdate(updated);
    },
    [applyUpdate]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      items,
      bookmarked: items.filter((p) => p.bookmarked),
      readCount: items.filter((p) => p.read).length,
      isRead: (subject, topicId) => readKeys.has(key(subject, topicId)),
      isBookmarked: (subject, topicId) => bookmarkedKeys.has(key(subject, topicId)),
      toggleRead,
      toggleBookmark,
    }),
    [items, readKeys, bookmarkedKeys, toggleRead, toggleBookmark]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
