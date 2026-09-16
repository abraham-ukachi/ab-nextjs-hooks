'use client'

import { useAbRequest } from './helpers/useAbRequest'
import type { AbRequestResponse } from './helpers/useAbRequest'

export const DEFAULT_TAX = 0
export const DEFAULT_DISCOUNT = 0
export const DEFAULT_SHIPPING = 0
export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_CURRENCY_SYMBOL = '$'

export interface ProductPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}

export interface ProductParams {
  sort?: 'asc' | 'desc' | string
  pagination?: ProductPagination
  fields?: string
  filters?: object
  locale?: string
  category?: string
}

export interface ProductMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface ProductResponseError {
  status: number
  name: string
  message: string
  details: object
}

export interface ProductData {
  id: number
  name?: string
  description?: string
  price?: number
  currency?: string
  color?: string
  shape?: string
  material?: string
  lens?: string
  image?: string
  images?: Array<string>
  locale?: string
}

export type ProductResponse = AbRequestResponse<Array<ProductData>>

export interface UseProductRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}

export interface UseProductRequestResponse {
  isAllProductsFetching: boolean
  isOneProductFetching: boolean
  isProductCreating: boolean
  isProductUpdating: boolean
  isProductDeleting: boolean
  fetchAllProducts: (params?: ProductParams | null) => Promise<ProductResponse>
  fetchOneProduct: (id: number) => Promise<ProductResponse>
  createProduct: (userToken: string, newData: Record<string, unknown>) => Promise<ProductResponse>
  updateProduct: (id: number, updateData: Record<string, unknown>) => Promise<ProductResponse>
  deleteProduct: (id: number) => Promise<ProductResponse>
  fetchAllProductsFiltered: (params?: ProductParams | null) => Promise<ProductResponse>
  fetchLatestProducts: (params?: ProductParams | null) => Promise<ProductResponse>
  fetchPopularProducts: (params?: ProductParams | null) => Promise<ProductResponse>
  fetchCartProducts: (
    userId: number,
    indexedCart: Record<string, unknown>,
    productIds: Array<number>,
    params?: ProductParams | null
  ) => Promise<ProductResponse>
}

const useProductRequest = (params: UseProductRequestParams = {}): UseProductRequestResponse => {
  const request = useAbRequest<Array<ProductData>>({
    entity: 'product',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  const fetchAllProductsFiltered = (filterParams: ProductParams | null = null): Promise<ProductResponse> => {
    return request.fetchAll({ ...(filterParams ?? {}), category: filterParams?.category ?? 'all' })
  }

  return {
    isAllProductsFetching: request.isAllFetching,
    isOneProductFetching: request.isOneFetching,
    isProductCreating: request.isCreating,
    isProductUpdating: request.isUpdating,
    isProductDeleting: request.isDeleting,
    fetchAllProducts: request.fetchAll,
    fetchOneProduct: (id: number) => request.fetchOne(id),
    createProduct: request.create,
    updateProduct: (id: number, updateData: Record<string, unknown>) => request.update(id, updateData),
    deleteProduct: request.remove,
    fetchAllProductsFiltered,
    fetchLatestProducts: (filterParams: ProductParams | null = null) =>
      request.fetchAll({ ...(filterParams ?? {}), sort: 'createdAt:desc' }),
    fetchPopularProducts: (filterParams: ProductParams | null = null) =>
      request.fetchAll({ ...(filterParams ?? {}), sort: 'popular' }),
    fetchCartProducts: (userId, indexedCart, productIds, filterParams = null) =>
      request.fetchAll({
        ...(filterParams ?? {}),
        filters: { ...(filterParams?.filters ?? {}), id: { $in: productIds } }
      })
  }
}

export { useProductRequest }

export default useProductRequest