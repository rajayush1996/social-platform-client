// hooks/usePaginatedContent.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";

export interface UseContentParams {
  page?: number;
  limit?: number;
  type?: "videos" | "reels";
  category?: string;
  filter?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  skip: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  totalResults: number;
  currentPage: number;
}

export function usePaginatedContent<T>({
  page = 1,
  limit = 12,
  type = "videos",
  category,
  filter,
}: UseContentParams) {
  const queryKey = [
    "paginatedContent",
    type,
    category ?? "all",
    filter ?? "",
    page,
    limit,
  ] as const;

  const { data, isLoading, isError } = useQuery<PaginatedResponse<T>>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        type,
        ...(filter ? { filter } : {}),
        ...(category && category !== "all" ? { category } : {}),
      });
      const url = `${API_CONFIG.ENDPOINTS.USER.TRENDING_VIDEOS}?${params}`;
      const resp = await axiosInstance.get<{ data: PaginatedResponse<T> }>(url);
      return resp.data.data;
    },
    placeholderData: (old) => old,
  });

  return {
    items:         data?.results    ?? [],
    skip:          data?.skip       ?? 0,
    limit:         data?.limit      ?? limit,
    hasMore:       data?.hasMore    ?? false,
    totalPages:    data?.totalPages ?? 1,
    totalResults:  data?.totalResults ?? 0,
    currentPage:   data?.currentPage  ?? page,
    isLoading,
    isError,
  };
}
