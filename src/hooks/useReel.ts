import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api.config'
import type { Reel } from '@/types/api.types'

export interface ReelsPage {
  results: Reel[]
  currentPage: number
  totalPages: number
  hasMore: boolean
}

export function useReelsInfinite(limit = 10, startKey?: string) {
  return useInfiniteQuery<ReelsPage, Error>({
    // include startKey in query key so navigating to a different reel
    // resets the cached pages and cancels any ongoing fetches
    queryKey: ['reels', limit, startKey],
    // 2) initial page
    initialPageParam: 1,
    // 3) how to fetch a page
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.REELS, {
        params: { page: pageParam, limit },
      })
      // assume your API returns { results, page, totalPages, hasMore } under `data.data`
      return data.data as ReelsPage
    },
    getNextPageParam: (last) => (last.hasMore ? last.currentPage + 1 : undefined),
  })
}

export const useIncrementReelView = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.put(
        API_CONFIG.ENDPOINTS.REELS.INCREMENT_VIEW(id)
      )
      return data.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reels'] })
      queryClient.invalidateQueries({ queryKey: ['reel', id] })
    },
  })
}
