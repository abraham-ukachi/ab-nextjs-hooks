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
* @name: Collection Request - AB Hook
* @file: useAbCollectionRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch all collections
*    -|> import useCollectionRequest from './useAbCollectionRequest'
*    -|>
*    -|> const { fetchAllCollections } = useCollectionRequest()
*    -|>
*    -|> // console.log(await fetchAllCollections()) // ==> { data: [...], meta: {...} }
*    -|>
*
*   2+|> // Fetch, create, update & delete a collection
*    -|> const { fetchOneCollection, createCollection, updateCollection, deleteCollection } = useCollectionRequest()
*    -|>
*    -|> // console.log(await createCollection('xxx', { name: 'Summer 2026' }))
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




// ===== COLLECTION REQUEST - TYPES & CONSTANTS ===== //


// collection pagination query params as `CollectionPagination`
export interface CollectionPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}


// collection request query params as `CollectionParams`
export interface CollectionParams {
  sort?: 'asc' | 'desc'
  pagination?: CollectionPagination
  fields?: string
  filters?: object
  locale?: string
}


// collection meta pagination info as `CollectionMetaPagination`
export interface CollectionMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// collection response error shape as `CollectionResponseError`
export interface CollectionResponseError {
  status: number
  name: string
  message: string
  details: object
}


// collection data shape as `CollectionData`
export interface CollectionData {
  id: number
  name: string
  description?: string
  locale?: string
  color?: string
  icon?: string
  image?: string
}


// `CollectionData` without the required `id` field, for creating a new collection
export type NewCollectionData = Omit<CollectionData, 'id'>


// `CollectionData` that is partially editable, for updating a collection
export type UpdateCollectionData = Partial<CollectionData>


// a collection response wraps a list of `CollectionData` in the generic `AbRequestResponse`
export type CollectionResponse = AbRequestResponse<Array<CollectionData>>


// use collection request params as `UseCollectionRequestParams`
export interface UseCollectionRequestParams {
  apiUrl?: string
  labels?: Record<string, string>
  strings?: Record<string, string>
  delayMs?: number
}


// use collection request response shape as `UseCollectionRequestResponse`
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




// ===== useCollectionRequest - AB HOOK ===== //


/**
 * @name useCollectionRequest
 * @description A collection request hook that wraps the generic `useAbRequest` factory
 *   with a `collection` entity, exposing typed fetch/create/update/delete helpers
 *
 * @param { UseCollectionRequestParams } params - The collection request params (apiUrl, strings, delayMs)
 *
 * @returns { UseCollectionRequestResponse }
 */
const useCollectionRequest = (params: UseCollectionRequestParams = {}): UseCollectionRequestResponse => {

  // build the underlying collection request via the generic `useAbRequest` factory
  const request = useAbRequest<Array<CollectionData>>({
    entity: 'collection',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // return the busy flags + typed fetchers, re-exposed under collection-specific names
  return {
    // ---- flags ----
    isAllCollectionsFetching: request.isAllFetching,
    isOneCollectionFetching: request.isOneFetching,
    isCollectionCreating: request.isCreating,
    isCollectionUpdating: request.isUpdating,
    isCollectionDeleting: request.isDeleting,
    // ---- fetchers ----
    // fetch all collections at once (optionally w/ params)
    fetchAllCollections: request.fetchAll,
    // fetch a single collection by `id`
    fetchOneCollection: (id: number) => request.fetchOne(id),
    // create a new collection w/ `newData`, using the `userToken` for auth
    createCollection: request.create,
    // update an existing collection by `id` w/ `updateData`
    updateCollection: (id: number, updateData: UpdateCollectionData) => request.update(id, updateData),
    // delete a collection by `id`
    deleteCollection: request.remove
  }

}


// export `useCollectionRequest` hook as named export
export { useCollectionRequest }


// export `useCollectionRequest` hook as default
export default useCollectionRequest