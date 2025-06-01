import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface MediaListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const useMediaList = (params: MediaListParams = {}) => {
  return useQuery({
    queryKey: ['media', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.MEDIA.LIST, { params });
      return response.data.data;
    },
  });
};

export const useMediaDetail = (id: string) => {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.MEDIA.DETAIL(id));
      return response.data.data;
    },
  });
};

export const useIncrementView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.put(API_CONFIG.ENDPOINTS.MEDIA.INCREMENT_VIEW(id));
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['media', id] });
    },
  });
}; 