import { useEffect, useState } from 'react';

import newsService from '@/services/newsService';
import { News } from '@/types/api';

export interface UseNewsDetailReturn {
  news: News | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNewsDetail = (id: string | string[] | undefined): UseNewsDetailReturn => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsDetail = async () => {
    if (!id || Array.isArray(id)) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getNewsDetail(id);
      setNews(data);
    } catch (err) {
      console.error('Error fetching news detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchNewsDetail();
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  return {
    news,
    loading,
    error,
    refetch,
  };
};
