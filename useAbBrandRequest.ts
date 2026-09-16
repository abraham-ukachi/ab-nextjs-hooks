/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
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
* @name: Brand Request - AB Hook
* @file: useAbBrandRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch all brands
*    -|> import useBrandRequest from './useAbBrandRequest'
*    -|>
*    -|> const { fetchAllBrands } = useBrandRequest()
*    -|>
*    -|> // console.log(await fetchAllBrands()) // ==> { data: [...], meta: {...} }
*    -|>
*
*   2+|> // Fetch, create, update & delete a brand
*    -|> const { fetchOneBrand, createBrand, updateBrand, deleteBrand } = useBrandRequest()
*    -|>
*    -|> // console.log(await createBrand('xxx', { name: 'LesYeuxDoux' }))
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




// ===== BRAND REQUEST - TYPES & CONSTANTS ===== //


// brand pagination query params as `BrandPagination`
export interface BrandPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}


// brand request query params as `BrandParams`
export interface BrandParams {
  sort?: 'asc' | 'desc'
  pagination?: BrandPagination
  fields?: string
  filters?: object
  locale?: string
}


// brand meta pagination info as `BrandMetaPagination`
export interface BrandMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// brand response error shape as `BrandResponseError`
export interface BrandResponseError {
  status: number
  name: string
  message: string
  details: object
}


// brand data shape as `BrandData`
export interface BrandData {
  id: number
  name: string
  description?: string
  locale?: string
  color?: string
  icon?: string
  image?: string
}


// `BrandData` without the required `id` field, for creating a new brand
export type NewBrandData = Omit<BrandData, 'id'>


// `BrandData` that is partially editable, for updating a brand
export type UpdateBrandData = Partial<BrandData>


// a brand response wraps a list of `BrandData` in the generic `AbRequestResponse`
export type BrandResponse = AbRequestResponse<Array<BrandData>>


// use brand request params as `UseBrandRequestParams`
export interface UseBrandRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}


// use brand request response shape as `UseBrandRequestResponse`
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




// ===== useBrandRequest - AB HOOK ===== //


/**
 * @name useBrandRequest
 * @description A brand request hook that wraps the generic `useAbRequest` factory
 *   with a `brand` entity, exposing typed fetch/create/update/delete helpers
 *
 * @param { UseBrandRequestParams } params - The brand request params (apiUrl, strings, delayMs)
 *
 * @returns { UseBrandRequestResponse }
 */
const useBrandRequest = (params: UseBrandRequestParams = {}): UseBrandRequestResponse => {

  // build the underlying brand request via the generic `useAbRequest` factory
  const request = useAbRequest<Array<BrandData>>({
    entity: 'brand',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // return the busy flags + typed fetchers, re-exposed under brand-specific names
  return {
    // ---- flags ----
    isAllBrandsFetching: request.isAllFetching,
    isOneBrandFetching: request.isOneFetching,
    isBrandCreating: request.isCreating,
    isBrandUpdating: request.isUpdating,
    isBrandDeleting: request.isDeleting,
    // ---- fetchers ----
    // fetch all brands at once (optionally w/ params)
    fetchAllBrands: request.fetchAll,
    // fetch a single brand by `id`
    fetchOneBrand: (id: number) => request.fetchOne(id),
    // create a new brand w/ `newData`, using the `userToken` for auth
    createBrand: request.create,
    // update an existing brand by `id` w/ `updateData`
    updateBrand: (id: number, updateData: UpdateBrandData) => request.update(id, updateData),
    // delete a brand by `id`
    deleteBrand: request.remove
  }

}


// export `useBrandRequest` hook as named export
export { useBrandRequest }


// export `useBrandRequest` hook as default
export default useBrandRequest