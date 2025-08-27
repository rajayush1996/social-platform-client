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

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.CATEGORIES);
      return res.data.data;
    },
  });
}