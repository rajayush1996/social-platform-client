import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ProfileResponse, UserProfile } from '@/types/profile';

// Get current user's profile
export const useProfile = () => {
  const token = localStorage.getItem('accessToken');
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: ProfileResponse }>(API_CONFIG.ENDPOINTS.USER.PROFILE);
      return data.data;
    },
    enabled: !!token, // Only fetch if token exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Update current user's profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      const { data } = await axiosInstance.put<{ data: ProfileResponse }>(
        API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
        profileData
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (avatar: File) => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      const { data } = await axiosInstance.post<{ data: ProfileResponse }>(
        API_CONFIG.ENDPOINTS.USER.UPLOAD_AVATAR,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

// Upload cover image
export const useUploadCover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cover: File) => {
      const formData = new FormData();
      formData.append('cover', cover);
      const { data } = await axiosInstance.post<{ data: ProfileResponse }>(
        API_CONFIG.ENDPOINTS.USER.UPLOAD_COVER,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

// Get public profile by user ID
export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: ['public-profile', userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: ProfileResponse }>(
        API_CONFIG.ENDPOINTS.USER.PUBLIC_PROFILE(userId)
      );
      return data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Update email
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axiosInstance.put<{ data: ProfileResponse }>(
        API_CONFIG.ENDPOINTS.USER.UPDATE_EMAIL,
        { email }
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwords: { currentPassword: string; newPassword: string }) => {
      const { data } = await axiosInstance.put(
        API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD,
        passwords
      );
      return data;
    },
  });
};

// Delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT);
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}; 