import { useCallback, useEffect, useState } from 'react';

import newsService from '@/services/newsService';
import { News } from '@/types/api';

export interface UseNewsListReturn {
  news: News[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNewsList = (): UseNewsListReturn => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (cursorParam?: number) => {
    try {
      const data = await newsService.getNewsList(cursorParam);
      return data;
    } catch (err) {
      console.error('Error fetching news:', err);
      throw err;
    }
  }, []);

  const loadInitialNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews();
      setNews(data);
      if (data.length > 0) {
        setCursor(data[data.length - 1].createdAtUnix);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load news. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [fetchNews]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading || !cursor) return;
    
    try {
      setLoadingMore(true);
      const data = await fetchNews(cursor);
      if (data.length > 0) {
        setNews(prev => [...prev, ...data]);
        setCursor(data[data.length - 1].createdAtUnix);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, cursor, fetchNews]);

  const refresh = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await loadInitialNews();
  }, [loadInitialNews]);

  useEffect(() => {
    loadInitialNews();
  }, [loadInitialNews]);

  return {
    news,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
