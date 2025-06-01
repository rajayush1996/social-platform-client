import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Notification } from '@/types/api.types';

interface NotificationListParams {
  page?: number;
  limit?: number;
}

export const useNotifications = (params: NotificationListParams = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS.LIST, { params });
      return response.data.data as {
        results: Notification[];
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
      };
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS.MARK_READ(id));
      return response.data.data as Notification;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}; 