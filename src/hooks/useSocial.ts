import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { User } from '@/types/api.types';

interface SocialListParams {
  page?: number;
  limit?: number;
}

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.SOCIAL.FOLLOW(userId));
      return response.data.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.SOCIAL.UNFOLLOW(userId));
      return response.data.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useFollowers = (userId: string, params: SocialListParams = {}) => {
  return useQuery({
    queryKey: ['followers', userId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SOCIAL.FOLLOWERS(userId), { params });
      return response.data.data;
    },
  });
};

export const useFollowing = (userId: string, params: SocialListParams = {}) => {
  return useQuery({
    queryKey: ['following', userId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SOCIAL.FOLLOWING(userId), { params });
      return response.data.data;
    },
  });
};

export const useFeed = (params: SocialListParams = {}) => {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.SOCIAL.FEED, { params });
      return response.data.data;
    },
  });
}; 