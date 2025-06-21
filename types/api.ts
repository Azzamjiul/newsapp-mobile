/**
 * API Types based on the OpenAPI contract
 */

export interface News {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  publisherId: number;
  publisherUrl: string;
  createdAt: string;
  importedAt: string;
  createdAtUnix: number;
}

export interface NewsListResponse extends Array<News> {}

export interface NewsDetailResponse extends News {}
