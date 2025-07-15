/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Reel as ReelType, Comment } from '@/types/api.types';

interface ReelListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: 'trending' | 'latest' | 'popular';
  featured?: boolean;
}

interface ReelListResponse {
  results: Reel[];
  skip: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  totalResults: number;
}

export const useReels = (params: ReelListParams = {}) => {
  return useInfiniteQuery<ReelListResponse>({
    queryKey: ['reels', params],
    // start with skip=0
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      // pass skip and limit to your API
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.REELS, {
        params: { ...params, skip: pageParam, limit: params.limit ?? 10 },
      });
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      // if the API says there’s more, schedule the next skip
      if (lastPage.hasMore) {
        return lastPage.skip + lastPage.limit;
      }
      return undefined;
    },
  });
};


interface Reel {
  likeCount: number;
  mediaDetails: any;
  id: string;
  thumbnailId: string;
  mediaFileId: string;
  title: string;
  description: string;
  category: string;
  mediaType: string;
  userId: string;
  views: number;
  status: string;
  reviewedBy: string;
  reviewedAt: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
  mediaFileUrl: string;
}

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