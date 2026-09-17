/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-hooks
* @name: Filter Request - AB Hook
* @file: useAbFilterRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch all filters
*    -|> import useFilterRequest from './useAbFilterRequest'
*    -|>
*    -|> const { fetchAllFilters } = useFilterRequest()
*    -|>
*    -|> // console.log(await fetchAllFilters({ category: 'brand' }))
*    -|>
*
*   2+|> // Fetch the color filter options
*    -|> const { fetchColorFilterOptions } = useFilterRequest()
*    -|>
*    -|> // console.log(await fetchColorFilterOptions())
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// REACT types
// REACT hooks
// REACT components


// NEXT.JS types
// NEXT.JS hooks
import { useAbRequest } from './helpers/useAbRequest'
// NEXT.JS components


// AB types
import type { AbRequestResponse } from './helpers/useAbRequest'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== FILTER REQUEST - TYPES & CONSTANTS ===== //


// filter pagination query params as `FilterPagination`
export interface FilterPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}


// filter request query params as `FilterParams`; `category` scopes which options are fetched
export interface FilterParams {
  sort?: 'asc' | 'desc'
  pagination?: FilterPagination
  fields?: string
  filters?: object
  locale?: string
  category?: string
}


// filter meta pagination info as `FilterMetaPagination`
export interface FilterMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// filter response error shape as `FilterResponseError`
export interface FilterResponseError {
  status: number
  name: string
  message: string
  details: object
}


// filter data shape as `FilterData`
export interface FilterData {
  id: number
  name: string
  label?: string
  locale?: string
}


// single filter option data shape as `FilterOptionData`
export interface FilterOptionData {
  id: number
  name: string
  label?: string
  locale?: string
}


// a filter response wraps a list of `FilterData` in the generic `AbRequestResponse`
export type FilterResponse = AbRequestResponse<Array<FilterData>>


// a filter option response wraps a list of `FilterOptionData` in the generic `AbRequestResponse`
export type FilterOptionResponse = AbRequestResponse<Array<FilterOptionData>>


// use filter request params as `UseFilterRequestParams`
export interface UseFilterRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}


// use filter request response shape as `UseFilterRequestResponse`
// note: all named option fetchers hang off the same `filter-option` request under the hood
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




// ===== useFilterRequest - AB HOOK ===== //


/**
 * @name useFilterRequest
 * @description A filter request hook that wraps the generic `useAbRequest` factory twice:
 *   once for filters, and once for filter options — then re-exposes the option fetcher
 *   under many named, category-specific aliases
 *
 * @param { UseFilterRequestParams } params - The filter request params (apiUrl, strings, delayMs)
 *
 * @returns { UseFilterRequestResponse }
 */
const useFilterRequest = (params: UseFilterRequestParams = {}): UseFilterRequestResponse => {

  // build the filters request via the generic `useAbRequest` factory
  const filtersRequest = useAbRequest<Array<FilterData>>({
    entity: 'filter',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // build the filter options request via the generic `useAbRequest` factory
  const optionsRequest = useAbRequest<Array<FilterOptionData>>({
    entity: 'filter-option',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // alias the shared 'filter options' busy flag (every named option fetcher reuses it)
  const isAllFilterOptionsFetching = optionsRequest.isAllFetching

  // type-only shim that keeps the generic option fetcher's signature (no runtime change)
  const bindParams = (
    fetcher: (p?: FilterParams | null) => Promise<FilterOptionResponse>
  ): ((p?: FilterParams | null) => Promise<FilterOptionResponse>) => fetcher

  // return the busy flags + typed fetchers, re-exposed under filter-specific names
  return {
    // ---- flags: filters ----
    isAllFiltersFetching: filtersRequest.isAllFetching,
    // ---- flags: filter options (all share the same busy state) ----
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
    // ---- fetchers: filters ----
    // fetch all filters at once (optionally w/ params)
    fetchAllFilters: filtersRequest.fetchAll,
    // fetch all filter options at once (optionally w/ params)
    fetchAllFilterOptions: optionsRequest.fetchAll,
    // ---- fetchers: named filter options (all delegate to the same option fetch) ----
    // fetch the brand filter options
    fetchBrandFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the collection filter options
    fetchCollectionFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the price filter options
    fetchPriceFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the color filter options
    fetchColorFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the shape filter options
    fetchShapeFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the gender filter options
    fetchGenderFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the material filter options
    fetchMaterialFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the lens filter options
    fetchLensFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the bridge filter options
    fetchBridgeFilterOptions: bindParams(optionsRequest.fetchAll),
    // fetch the branch filter options
    fetchBranchFilterOptions: bindParams(optionsRequest.fetchAll)
  }

}


// export `useFilterRequest` hook as named export
export { useFilterRequest }


// export `useFilterRequest` hook as default
export default useFilterRequest