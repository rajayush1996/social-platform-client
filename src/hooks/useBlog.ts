import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { Blog, Comment } from '@/types/api.types';

interface BlogListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: 'trending' | 'latest' | 'popular';
  readTime?: 'short' | 'medium' | 'long';
  featured?: boolean;
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.BLOG.CREATE, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await axiosInstance.put(API_CONFIG.ENDPOINTS.BLOG.UPDATE(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(API_CONFIG.ENDPOINTS.BLOG.DELETE(id));
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] });
      queryClient.removeQueries({ queryKey: ['blog', id] });
    },
  });
};

export const useBlogs = (params: BlogListParams = {}) => {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.BLOGS, { params });
      return response.data.data as {
        results: Blog[];
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
      };
    },
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.BLOGS_DETAIL(id));
      return response.data.data as Blog;
    },
  });
};

export const useUserBlogs = (userId: string, params: BlogListParams = {}) => {
  return useQuery({
    queryKey: ['user-blogs', userId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.BLOG.USER_BLOGS}/${userId}`, { params });
      return response.data.data as Blog[];
    },
  });
};

export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.LIKE, {
        contentId: id,
        contentType: 'blog'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUnlikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.BLOG.UNLIKE(id));
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['liked-blogs'] });
    },
  });
};

export const useBlogComments = (blogId: string, params: BlogListParams = {}) => {
  return useQuery({
    queryKey: ['blog-comments', blogId, params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.BLOGS_COMMENTS(blogId), { params });
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

export const useAddBlogComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogId, text }: { blogId: string; text: string }) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.COMMENT, {
        contentId: blogId,
        contentType: 'blog',
        text
      });
      return response.data.data as Comment;
    },
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    },
  });
};

export const useDeleteBlogComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogId, commentId }: { blogId: string; commentId: string }) => {
      const response = await axiosInstance.delete(API_CONFIG.ENDPOINTS.BLOG.DELETE_COMMENT(blogId, commentId));
      return response.data.data;
    },
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogId] });
    },
  });
};

export const useSaveBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.INTERACTIONS.SAVE, {
        contentId: id,
        contentType: 'blog'
      });
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};