import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Reel, Comment } from '@/types/api.types';

interface ReelListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: 'trending' | 'latest' | 'popular';
  featured?: boolean;
}

interface ReelListResponse {
  results: Reel[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const useReels = (params: ReelListParams = {}) => {
  return useInfiniteQuery<ReelListResponse>({
    queryKey: ['reels', params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.REELS, { 
        params: { ...params, page: pageParam } 
      });
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useReel = (id: string) => {
  return useQuery({
    queryKey: ['reel', id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.REELS_DETAIL(id));
      return response.data.data as Reel;
    },
  });
};

export const useLikeReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.LIKE, {
        contentId: id,
        contentType: 'reel'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reel', id] });
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });
};

export const useReelComments = (reelId: string, params: ReelListParams = {}) => {
  return useQuery({
    queryKey: ['reel-comments', reelId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.REELS_COMMENTS(reelId), { params });
      return response.data.data as {
        results: Comment[];
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
      };
    },
  });
};

export const useAddReelComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reelId, text }: { reelId: string; text: string }) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.COMMENT, {
        contentId: reelId,
        contentType: 'reel',
        text
      });
      return response.data.data as Comment;
    },
    onSuccess: (_, { reelId }) => {
      queryClient.invalidateQueries({ queryKey: ['reel-comments', reelId] });
      queryClient.invalidateQueries({ queryKey: ['reel', reelId] });
    },
  });
};

export const useSaveReel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.SAVE, {
        contentId: id,
        contentType: 'reel'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reel', id] });
      queryClient.invalidateQueries({ queryKey: ['reels'] });
    },
  });
}; 