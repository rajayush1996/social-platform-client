import { API_CONFIG } from '@/config/api.config'
import axiosInstance from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export interface CreatorRequestPayload {
  documents:    string[]   // CDN URLs from your Bunny uploads
  name:      string
  photo:     string
  idProof:   string
}

export interface CreatorRequestResponse {
  id:     string
  status: string
  // …other fields returned by your API
}

export function useCreateCreatorRequest() {
  const mutation = useMutation<CreatorRequestResponse, Error, CreatorRequestPayload>({
    mutationKey: ['creatorRequest'],
    mutationFn: (data) =>
      axiosInstance
        .post<CreatorRequestResponse>(API_CONFIG.ENDPOINTS.CREATOR.REQUEST, data)
        .then((res) => res.data),
  })

  return {
    submitRequest: mutation.mutateAsync,
    isLoading:  mutation.isPending,
    error:   mutation.error,
  }
}