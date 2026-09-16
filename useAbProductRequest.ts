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
* @name: Product Request - AB Hook
* @file: useAbProductRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch all products
*    -|> import useProductRequest from './useAbProductRequest'
*    -|>
*    -|> const { fetchAllProducts } = useProductRequest()
*    -|>
*    -|> // console.log(await fetchAllProducts({ sort: 'asc' }))
*    -|>
*
*   2+|> // Fetch the latest, popular & cart products
*    -|> const { fetchLatestProducts, fetchCartProducts } = useProductRequest()
*    -|>
*    -|> // console.log(await fetchLatestProducts())
*    -|> // console.log(await fetchCartProducts(1, {}, [1, 2, 3]))
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




// ===== PRODUCT REQUEST - TYPES & CONSTANTS ===== //


// --- DEFAULT VALUES ---
// default tax amount (0%) for a product
export const DEFAULT_TAX = 0
// default discount amount (0%) for a product
export const DEFAULT_DISCOUNT = 0
// default shipping cost (0) for a product
export const DEFAULT_SHIPPING = 0
// default currency code for a product
export const DEFAULT_CURRENCY = 'USD'
// default currency symbol for a product
export const DEFAULT_CURRENCY_SYMBOL = '$'


// product pagination query params as `ProductPagination`
export interface ProductPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}


// product request query params as `ProductParams`; `category` scopes the fetch
export interface ProductParams {
  sort?: 'asc' | 'desc' | string
  pagination?: ProductPagination
  fields?: string
  filters?: object
  locale?: string
  category?: string
}


// product meta pagination info as `ProductMetaPagination`
export interface ProductMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// product response error shape as `ProductResponseError`
export interface ProductResponseError {
  status: number
  name: string
  message: string
  details: object
}


// product data shape as `ProductData`
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


// a product response wraps a list of `ProductData` in the generic `AbRequestResponse`
export type ProductResponse = AbRequestResponse<Array<ProductData>>


// use product request params as `UseProductRequestParams`
export interface UseProductRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}


// use product request response shape as `UseProductRequestResponse`
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




// ===== useProductRequest - AB HOOK ===== //


/**
 * @name useProductRequest
 * @description A product request hook that wraps the generic `useAbRequest` factory
 *   with a `product` entity, exposing typed fetch/create/update/delete helpers as well
 *   as the specialized filtered/latest/popular/cart fetchers
 *
 * @param { UseProductRequestParams } params - The product request params (apiUrl, strings, delayMs)
 *
 * @returns { UseProductRequestResponse }
 */
const useProductRequest = (params: UseProductRequestParams = {}): UseProductRequestResponse => {

  // build the underlying product request via the generic `useAbRequest` factory
  const request = useAbRequest<Array<ProductData>>({
    entity: 'product',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // fetch all products filtered by a `category`; defaults to 'all' when none is given
  // note: merges the incoming params w/ the category, so other filters stay intact
  const fetchAllProductsFiltered = (filterParams: ProductParams | null = null): Promise<ProductResponse> => {
    return request.fetchAll({ ...(filterParams ?? {}), category: filterParams?.category ?? 'all' })
  }

  // return the busy flags + typed fetchers, re-exposed under product-specific names
  return {
    // ---- flags ----
    isAllProductsFetching: request.isAllFetching,
    isOneProductFetching: request.isOneFetching,
    isProductCreating: request.isCreating,
    isProductUpdating: request.isUpdating,
    isProductDeleting: request.isDeleting,
    // ---- fetchers: crud ----
    // fetch all products at once (optionally w/ params)
    fetchAllProducts: request.fetchAll,
    // fetch a single product by `id`
    fetchOneProduct: (id: number) => request.fetchOne(id),
    // create a new product w/ `newData`, using the `userToken` for auth
    createProduct: request.create,
    // update an existing product by `id` w/ `updateData`
    updateProduct: (id: number, updateData: Record<string, unknown>) => request.update(id, updateData),
    // delete a product by `id`
    deleteProduct: request.remove,
    // ---- fetchers: specialized ----
    // fetch all products, filtered by category (defaults to 'all')
    fetchAllProductsFiltered,
    // fetch the latest products, sorted by `createdAt` descending
    fetchLatestProducts: (filterParams: ProductParams | null = null) =>
      request.fetchAll({ ...(filterParams ?? {}), sort: 'createdAt:desc' }),
    // fetch the popular products, sorted by `popular`
    fetchPopularProducts: (filterParams: ProductParams | null = null) =>
      request.fetchAll({ ...(filterParams ?? {}), sort: 'popular' }),
    // fetch the cart products whose ids are in `productIds` (the `$in` filter)
    // TODO: `userId` & `indexedCart` are accepted but not yet used; wire them up later
    fetchCartProducts: (userId, indexedCart, productIds, filterParams = null) =>
      request.fetchAll({
        ...(filterParams ?? {}),
        filters: { ...(filterParams?.filters ?? {}), id: { $in: productIds } }
      })
  }

}


// export `useProductRequest` hook as named export
export { useProductRequest }


// export `useProductRequest` hook as default
export default useProductRequest