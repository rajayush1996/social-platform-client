import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface NotificationListParams {
  page?: number;
  limit?: number;
}

export const useNotifications = (params: NotificationListParams = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.NOTIFICATION.LIST, { params });
      return response.data.data;
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.NOTIFICATION.UNREAD_COUNT);
      return response.data.data.count;
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(API_CONFIG.ENDPOINTS.NOTIFICATION.MARK_READ(id));
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(API_CONFIG.ENDPOINTS.NOTIFICATION.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}; 