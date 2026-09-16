'use client'

import { useAbRequest } from './helpers/useAbRequest'
import type { AbRequestResponse } from './helpers/useAbRequest'

export interface CollectionPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}

export interface CollectionParams {
  sort?: 'asc' | 'desc'
  pagination?: CollectionPagination
  fields?: string
  filters?: object
  locale?: string
}

export interface CollectionMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface CollectionResponseError {
  status: number
  name: string
  message: string
  details: object
}

export interface CollectionData {
  id: number
  name: string
  description?: string
  locale?: string
  color?: string
  icon?: string
  image?: string
}

export type NewCollectionData = Omit<CollectionData, 'id'>

export type UpdateCollectionData = Partial<CollectionData>

export type CollectionResponse = AbRequestResponse<Array<CollectionData>>

export interface UseCollectionRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}

export interface UseCollectionRequestResponse {
  isAllCollectionsFetching: boolean
  isOneCollectionFetching: boolean
  isCollectionCreating: boolean
  isCollectionUpdating: boolean
  isCollectionDeleting: boolean
  fetchAllCollections: (params?: CollectionParams | null) => Promise<CollectionResponse>
  fetchOneCollection: (id: number) => Promise<CollectionResponse>
  createCollection: (userToken: string, newData: NewCollectionData) => Promise<CollectionResponse>
  updateCollection: (id: number, updateData: UpdateCollectionData) => Promise<CollectionResponse>
  deleteCollection: (id: number) => Promise<CollectionResponse>
}

const useCollectionRequest = (params: UseCollectionRequestParams = {}): UseCollectionRequestResponse => {
  const request = useAbRequest<Array<CollectionData>>({
    entity: 'collection',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  return {
    isAllCollectionsFetching: request.isAllFetching,
    isOneCollectionFetching: request.isOneFetching,
    isCollectionCreating: request.isCreating,
    isCollectionUpdating: request.isUpdating,
    isCollectionDeleting: request.isDeleting,
    fetchAllCollections: request.fetchAll,
    fetchOneCollection: (id: number) => request.fetchOne(id),
    createCollection: request.create,
    updateCollection: (id: number, updateData: UpdateCollectionData) => request.update(id, updateData),
    deleteCollection: request.remove
  }
}

export { useCollectionRequest }

export default useCollectionRequest