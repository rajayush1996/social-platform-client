import { useInfiniteQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api.config'


export interface Reel {
  id: string
  type: 'reel'
  title: string
  description: string
  category: string
  userId: string
  views: number
  status: string
  createdAt: string
  updatedAt: string
  thumbnailUrl: string | null
  mediaFileUrl: string
}

export interface ReelsPage {
  results: Reel[]
  currentPage: number
  totalPages: number
  hasMore: boolean
}

export function useReelsInfinite(limit = 10) {
  return useInfiniteQuery<ReelsPage, Error>({
    // 1) your query key
    queryKey: ['reels', limit],
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
