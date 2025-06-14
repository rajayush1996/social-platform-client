import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

interface ProfileData {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  coverImage?: string;
  website?: string;
  isCreator: boolean;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  stats?: {
    totalViews: number;
    totalLikes: number;
    totalFollowers: number;
    totalFollowing: number;
  };
}

// Register user
export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: { name: string; email: string; username: string; password: string; confirmPassword: string }) => {
      const { data } = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, payload);
      return data.data;
    },
  });
};

// Login user
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, payload);
      
      // Store access token and user data in localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Fetch and store complete profile data
      try {
        const profileResponse = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
        const profileData = profileResponse.data.data;
        
        // Update localStorage with complete profile
        localStorage.setItem('profile', JSON.stringify(profileData));
        
        // Update React Query cache
        queryClient.setQueryData(['profile'], profileData);
        
        return {
          ...data.data,
          profile: profileData
        };
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Return basic user data if profile fetch fails
        return data.data;
      }
    },
  });
};

// Refresh token
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (payload: { refreshToken: string }) => {
      const { data } = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, payload);
      return data.data;
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      // Clear localStorage on logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      // Clear React Query cache
      queryClient.clear();
      return data;
    },
  });
};

// Resend verification email
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
      return data;
    },
  });
}; 