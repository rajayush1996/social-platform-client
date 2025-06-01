import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Media, Blog, User } from '@/types/api.types';

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  type?: 'all' | 'media' | 'blog' | 'user';
}

export const useGlobalSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SEARCH.GLOBAL, { params });
      return response.data.data as {
        media: Media[];
        blogs: Blog[];
        users: User[];
      };
    },
    enabled: !!params.query,
  });
};

export const useTrendingMedia = (params: Omit<SearchParams, 'query'> = {}) => {
  return useQuery({
    queryKey: ['trending-media', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SEARCH.TRENDING_MEDIA, { params });
      return response.data.data as Media[];
    },
  });
};

export const useTrendingBlogs = (params: Omit<SearchParams, 'query'> = {}) => {
  return useQuery({
    queryKey: ['trending-blogs', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SEARCH.TRENDING_BLOGS, { params });
      return response.data.data as Blog[];
    },
  });
};

export const useTrendingCreators = (params: Omit<SearchParams, 'query'> = {}) => {
  return useQuery({
    queryKey: ['trending-creators', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SEARCH.TRENDING_CREATORS, { params });
      return response.data.data as User[];
    },
  });
}; 