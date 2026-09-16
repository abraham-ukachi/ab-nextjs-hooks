'use client'

import { useAbRequest } from './helpers/useAbRequest'
import type { AbRequestResponse } from './helpers/useAbRequest'

export interface FilterPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}

export interface FilterParams {
  sort?: 'asc' | 'desc'
  pagination?: FilterPagination
  fields?: string
  filters?: object
  locale?: string
  category?: string
}

export interface FilterMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface FilterResponseError {
  status: number
  name: string
  message: string
  details: object
}

export interface FilterData {
  id: number
  name: string
  label?: string
  locale?: string
}

export interface FilterOptionData {
  id: number
  name: string
  label?: string
  locale?: string
}

export type FilterResponse = AbRequestResponse<Array<FilterData>>

export type FilterOptionResponse = AbRequestResponse<Array<FilterOptionData>>

export interface UseFilterRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}

export interface UseFilterRequestResponse {
  isAllFiltersFetching: boolean
  isAllFilterOptionsFetching: boolean
  isBrandFilterOptionsFetching: boolean
  isCollectionFilterOptionsFetching: boolean
  isPriceFilterOptionsFetching: boolean
  isColorFilterOptionsFetching: boolean
  isShapeFilterOptionsFetching: boolean
  isGenderFilterOptionsFetching: boolean
  isMaterialFilterOptionsFetching: boolean
  isLensFilterOptionsFetching: boolean
  isBridgeFilterOptionsFetching: boolean
  isBranchFilterOptionsFetching: boolean
  fetchAllFilters: (params?: FilterParams | null) => Promise<FilterResponse>
  fetchAllFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchBrandFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchCollectionFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchPriceFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchColorFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchShapeFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchGenderFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchMaterialFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchLensFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchBridgeFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
  fetchBranchFilterOptions: (params?: FilterParams | null) => Promise<FilterOptionResponse>
}

const useFilterRequest = (params: UseFilterRequestParams = {}): UseFilterRequestResponse => {
  const filtersRequest = useAbRequest<Array<FilterData>>({
    entity: 'filter',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  const optionsRequest = useAbRequest<Array<FilterOptionData>>({
    entity: 'filter-option',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  const isAllFilterOptionsFetching = optionsRequest.isAllFetching

  const bindParams = (
    fetcher: (p: FilterParams | null) => Promise<FilterOptionResponse>
  ): ((p?: FilterParams | null) => Promise<FilterOptionResponse>) => fetcher

  return {
    isAllFiltersFetching: filtersRequest.isAllFetching,
    isAllFilterOptionsFetching,
    isBrandFilterOptionsFetching: isAllFilterOptionsFetching,
    isCollectionFilterOptionsFetching: isAllFilterOptionsFetching,
    isPriceFilterOptionsFetching: isAllFilterOptionsFetching,
    isColorFilterOptionsFetching: isAllFilterOptionsFetching,
    isShapeFilterOptionsFetching: isAllFilterOptionsFetching,
    isGenderFilterOptionsFetching: isAllFilterOptionsFetching,
    isMaterialFilterOptionsFetching: isAllFilterOptionsFetching,
    isLensFilterOptionsFetching: isAllFilterOptionsFetching,
    isBridgeFilterOptionsFetching: isAllFilterOptionsFetching,
    isBranchFilterOptionsFetching: isAllFilterOptionsFetching,
    fetchAllFilters: filtersRequest.fetchAll,
    fetchAllFilterOptions: optionsRequest.fetchAll,
    fetchBrandFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchCollectionFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchPriceFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchColorFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchShapeFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchGenderFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchMaterialFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchLensFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchBridgeFilterOptions: bindParams(optionsRequest.fetchAll),
    fetchBranchFilterOptions: bindParams(optionsRequest.fetchAll)
  }
}

export { useFilterRequest }

export default useFilterRequest