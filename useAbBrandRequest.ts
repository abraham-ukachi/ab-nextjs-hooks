'use client'

import { useAbRequest } from './helpers/useAbRequest'
import type { AbRequestResponse } from './helpers/useAbRequest'

export interface BrandPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}

export interface BrandParams {
  sort?: 'asc' | 'desc'
  pagination?: BrandPagination
  fields?: string
  filters?: object
  locale?: string
}

export interface BrandMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface BrandResponseError {
  status: number
  name: string
  message: string
  details: object
}

export interface BrandData {
  id: number
  name: string
  description?: string
  locale?: string
  color?: string
  icon?: string
  image?: string
}

export type NewBrandData = Omit<BrandData, 'id'>

export type UpdateBrandData = Partial<BrandData>

export type BrandResponse = AbRequestResponse<Array<BrandData>>

export interface UseBrandRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}

export interface UseBrandRequestResponse {
  isAllBrandsFetching: boolean
  isOneBrandFetching: boolean
  isBrandCreating: boolean
  isBrandUpdating: boolean
  isBrandDeleting: boolean
  fetchAllBrands: (params?: BrandParams | null) => Promise<BrandResponse>
  fetchOneBrand: (id: number) => Promise<BrandResponse>
  createBrand: (userToken: string, newData: NewBrandData) => Promise<BrandResponse>
  updateBrand: (id: number, updateData: UpdateBrandData) => Promise<BrandResponse>
  deleteBrand: (id: number) => Promise<BrandResponse>
}

const useBrandRequest = (params: UseBrandRequestParams = {}): UseBrandRequestResponse => {
  const request = useAbRequest<Array<BrandData>>({
    entity: 'brand',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  return {
    isAllBrandsFetching: request.isAllFetching,
    isOneBrandFetching: request.isOneFetching,
    isBrandCreating: request.isCreating,
    isBrandUpdating: request.isUpdating,
    isBrandDeleting: request.isDeleting,
    fetchAllBrands: request.fetchAll,
    fetchOneBrand: (id: number) => request.fetchOne(id),
    createBrand: request.create,
    updateBrand: (id: number, updateData: UpdateBrandData) => request.update(id, updateData),
    deleteBrand: request.remove
  }
}

export { useBrandRequest }

export default useBrandRequest