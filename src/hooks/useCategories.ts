import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_CONFIG } from '@/config/api.config';


export interface Category {
  id: string;
  name: string;
  type: string;
  parentId: Category | null;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  results: Category[];
  skip: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  totalResults: number;
  currentPage: number;
}

export interface CategoryQueryParams {
  type?: string;                // e.g. "videos | reels | blogs"
  sortBy?: string;              // default "createdAt"
  isActive?: boolean;
  parentId?: string;
}

export function useCategories(params: CategoryQueryParams = { sortBy: "createdAt" }) {
  return useQuery<Category[]>({
    queryKey: ["categories", params], // include params in the key for caching
    queryFn: async () => {
      const res = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.CATEGORIES, {
        params, // axios will build query string automatically
      });
      return res.data.data;
    },
  });
}