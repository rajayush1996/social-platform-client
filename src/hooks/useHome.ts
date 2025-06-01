import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface HomeParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}

export const useHomeContent = (params: HomeParams = {}) => {
  return useQuery({
    queryKey: ['home', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.HOME, { params });
      return response.data.data as {
        featured: {
          blogs: any[];
          videos: any[];
          reels: any[];
        };
        trending: {
          blogs: any[];
          videos: any[];
          reels: any[];
        };
        latest: {
          blogs: any[];
          videos: any[];
          reels: any[];
        };
      };
    },
  });
}; 