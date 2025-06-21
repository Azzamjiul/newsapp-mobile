import { NewsDetailResponse, NewsListResponse } from '@/types/api';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

class NewsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api`;
  }

  /**
   * Fetch news list
   * @param cursor - Optional cursor for pagination
   * @returns Promise<NewsListResponse>
   */
  async getNewsList(cursor?: number): Promise<NewsListResponse> {
    try {
      const url = cursor 
        ? `${this.baseUrl}/news?cursor=${cursor}` 
        : `${this.baseUrl}/news`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsListResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news list:', error);
      throw error;
    }
  }

  /**
   * Fetch news detail by ID
   * @param id - News ID
   * @returns Promise<NewsDetailResponse>
   */
  async getNewsDetail(id: string | number): Promise<NewsDetailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/news/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('News not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsDetailResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news detail:', error);
      throw error;
    }
  }
}

export const newsService = new NewsService();
export default newsService;
