/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Video, Reel } from '@/types/api.types';

interface CreatorMediaParams {
  type?: 'video' | 'reel';
  page?: number;
  limit?: number;
}

export const useCreatorMediaList = (params: CreatorMediaParams = {}) => {
  return useQuery({
    queryKey: ['creator-media', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_CONFIG.ENDPOINTS.MEDIA.METADATA, { params });
      return data.data as {
        results: (Video | Reel)[];
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
      };
    },
  });
};

interface MediaMetadataPayload {
  mediaFileId: string;
  title: string;
  description: string;
  tags?: any[];
  category?: string;
  mediaType: 'video' | 'reel';
}

export const useCreateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MediaMetadataPayload) => {
      const { data } = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.MEDIA.METADATA,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-media'] });
    },
  });
};