import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface ProfileData {
  name: string;
  bio: string;
  profilePicture?: string;
  coverImage?: string;
  website?: string;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
      return response.data.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await axiosInstance.patch(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useCreatorRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { reason: string; portfolio: string }) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.CREATOR.REQUEST, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-request'] });
    },
  });
};

export const useMyCreatorRequest = () => {
  return useQuery({
    queryKey: ['creator-request'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.CREATOR.MY_REQUEST);
      return response.data.data;
    },
  });
}; 