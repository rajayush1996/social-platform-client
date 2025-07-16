/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useHomeContent.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Video, Reel, Blog } from '@/types/api.types';

export interface HomeParams {
  categoryId?: string;
  featured?: boolean;
  // …any other filters…
}

export interface HomeContent {
  trendingBlogs: any;
  featuredVideos: { results: Video[]; hasMore: boolean };
  trendingReels:   { results: Reel[];  hasMore: boolean };
  latestBlogs:     { results: Blog[];  hasMore: boolean };
  latestVideos:    { results: Video[]; hasMore: boolean; page: number };
}

export function useHomeContentInfinite(
  body: Omit<HomeParams, 'page'>,
  latestLimit = 12
) {
  return useInfiniteQuery<HomeContent>({
    queryKey: ['home', body],
    // start at page 1
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.USER.HOME,
        {
          ...body,
          // only latestVideos paginates
          latestVideos:   { page: pageParam, limit: latestLimit },
          // the others always page 1
          featuredVideos: { page: 1, limit: 8 },
          trendingReels:  { page: 1, limit: 8 },
          latestBlogs:    { page: 1, limit: 8 },
        }
      );
      return response.data.data as HomeContent;
    },
    getNextPageParam: lastPage =>
      lastPage.latestVideos.hasMore
        ? lastPage.latestVideos.page + 1
        : undefined,
  });
}


interface TrendingVideosParams {
  page?: number;
  limit?: number;
}

interface TrendingVideosResponse {
  currentPage: number;
  results: Video[];
  total: number;
  page: number;
  totalPages: number;
}

export function useTrendingVideos({ page = 1, limit = 10 }: TrendingVideosParams) {
  return useQuery<TrendingVideosResponse>({
    queryKey: ["trendingVideos", page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_CONFIG.ENDPOINTS.USER.TRENDING_VIDEOS}?page=${page}&limit=${limit}`
      );
      return response.data.data as TrendingVideosResponse;
    },
    placeholderData: (previousData) => previousData,
  });
}