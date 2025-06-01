import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Video, Comment } from '@/types/api.types';

interface VideoListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: 'trending' | 'latest' | 'popular';
  duration?: 'short' | 'medium' | 'long';
  featured?: boolean;
}

interface VideoListResponse {
  videos: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useVideos = (params: VideoListParams = {}) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.VIDEOS, { params });
      return response.data.data as VideoListResponse;
    },
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.VIDEOS_DETAIL(id));
      return response.data.data as Video;
    },
  });
};

export const useLikeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.LIKE, {
        contentId: id,
        contentType: 'video'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useVideoComments = (videoId: string, params: VideoListParams = {}) => {
  return useQuery({
    queryKey: ['video-comments', videoId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.VIDEOS_COMMENTS(videoId), { params });
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

export const useAddVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, text }: { videoId: string; text: string }) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.COMMENT, {
        contentId: videoId,
        contentType: 'video',
        text
      });
      return response.data.data as Comment;
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['video-comments', videoId] });
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    },
  });
};

export const useSaveVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.SAVE, {
        contentId: id,
        contentType: 'video'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}; 