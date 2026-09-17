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
* @name: Requests - AB Hook
* @file: useAbRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch every item of an entity
*    -|> import { useAbRequest } from './helpers/useAbRequest'
*    -|>
*    -|> const { fetchAll, isAllFetching } = useAbRequest({ entity: 'user' })
*    -|>
*    -|> fetchAll()
*    -|>
*   2+|> // Create a new entity item w/ a user token
*    -|> const { create, isCreating } = useAbRequest({ apiUrl: 'https://api.site.com' })
*    -|>
*    -|> create('my-token', { name: 'Abraham' })
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
import { useCallback, useMemo, useState } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== AB REQUESTS - TYPES & INTERFACES ===== //


// the shape of an ab request error; carries the `status` + some readable info
export interface AbRequestError {
  status?: number
  name?: string
  message?: string
  details?: Record<string, unknown>
}


// the ab request response; either the `data` (+ optional `meta`) or an `error`
export interface AbRequestResponse<T = unknown> {
  data?: T
  meta?: Record<string, unknown>
  error?: AbRequestError | null
}


// the endpoints map used to build the request urls, one per action
export interface AbRequestEndpoints {
  fetchAll?: string
  fetchOne?: string
  create?: string
  update?: string
  delete?: string
}


// the `useAbRequest` options used to configure every request
// TODO 1: add `timeoutMs` support & an `onError` callback
export interface AbRequestParams {
  apiUrl?: string
  entity?: string
  endpoints?: AbRequestEndpoints
  delayMs?: number
  labels?: Record<string, string>
  strings?: Record<string, string>
  stringify?: (params?: any | null) => string
}


// the result of the `useAbRequest` hook; a set of loading flags + all the actions
// note: `isAllFetching` guards `fetchAll`, `isOneFetching` guards `fetchOne`, etc.
export interface AbRequestHookResult<T = unknown> {
  isAllFetching: boolean
  isOneFetching: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  conflictError: AbRequestError
  fetchAll: (params?: any | null) => Promise<AbRequestResponse<T>>
  fetchOne: (id: number, params?: any | null) => Promise<AbRequestResponse<T>>
  create: (userToken: string, newData: Record<string, unknown>) => Promise<AbRequestResponse<T>>
  update: (id: number, updateData: Record<string, unknown>, userToken?: string) => Promise<AbRequestResponse<T>>
  remove: (id: number, userToken?: string) => Promise<AbRequestResponse<T>>
}




// ===== STRINGIFY - AB HELPER ===== //


/**
 * @name stringifyAbParams
 * @description Stringifies the given `params` into a query-string prefix (e.g. `?page=1`),
 * or an empty string when no params are provided
 *
 * @param { any | null } params - The params to stringify
 *
 * @returns { string } the query-string prefix, or `''` when `params` is empty
 */
export const stringifyAbParams = (params: any | null = null): string => {
  // no params = no query-string
  if (!params) return ''

  // build the query-string, prefixed with a `?`
  return `?${new URLSearchParams(params as Record<string, string>).toString()}`
}




// ===== REQUEST - AB HELPERS ===== //


// strip any leading `/` from an endpoint so it safely joins the `apiUrl`
// note: an empty endpoint gracefully defaults to `''`
const stripLeadingSlash = (endpoint: string = ''): string => endpoint.replace(/^\//, '')


/**
 * @name requestJson
 * @description Low-level `fetch` wrapper that performs a JSON request & returns the
 * parsed `responseData`; resolves even on an empty body & throws on any HTTP error
 *
 * @param { string } url - The url to request
 * @param { RequestInit } init - The fetch init (method, headers, body...)
 *
 * @returns { Promise<any> } the parsed JSON response data
 */
const requestJson = async (url: string, init: RequestInit): Promise<any> => {
  // fire the underlying fetch request
  const response = await fetch(new Request(url, init))

  // try to parse the body as JSON, gracefully `null`-ing an empty/unparseable body
  const responseData = await response.json().catch(() => null)

  // all good (either `ok` or an explicit 200)? return the parsed data right away
  if (response.ok || response.status === 200) {
    return responseData
  }

  // otherwise, throw the response data as an error
  // note: this keeps the `error`/`message` shape intact for the caller to catch
  throw { ...(responseData?.error ?? responseData) }
}




// ===== useAbRequest - AB HOOK ===== //


/**
 * @name useAbRequest
 * @description A request hook exposing CRUD-style actions (`fetchAll`, `fetchOne`,
 * `create`, `update`, `remove`) for a given `entity`, with per-action loading flags and
 * a shared `conflictError` that guards against overlapping requests
 *
 * @param { AbRequestParams } options - The request options (apiUrl, entity, endpoints...)
 *
 * @returns { AbRequestHookResult<T> } the loading flags, `conflictError` & all actions
 */
const useAbRequest = <T = Record<string, unknown>>(options: AbRequestParams = {}): AbRequestHookResult<T> => {
  // unwrap the core options, each with a sensible default
  // note: `stringify` falls back to our own `stringifyAbParams` helper
  const entity = options.entity ?? 'item'
  const apiUrl = options.apiUrl ?? ''
  const delayMs = options.delayMs ?? 0
  const stringify = options.stringify ?? stringifyAbParams

  // memoize the endpoints, defaulting to a generic `api/{entity}s` set for this entity
  const endpoints = useMemo(
    () =>
      options.endpoints ?? {
        fetchAll: `api/${entity}s`,
        fetchOne: `api/${entity}s`,
        create: `api/${entity}s`,
        update: `api/${entity}s`,
        delete: `api/${entity}s`
      },
    [options.endpoints, entity]
  )

  // set up the per-action loading flags, all initially idle
  const [isAllFetching, setIsAllFetching] = useState(false)
  const [isOneFetching, setIsOneFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // memoize the fully joined request urls (apiUrl + stripped endpoint) for every action
  const requestUrls = useMemo(
    () => ({
      fetchAll: `${apiUrl}/${stripLeadingSlash(endpoints.fetchAll)}`,
      fetchOne: `${apiUrl}/${stripLeadingSlash(endpoints.fetchOne)}`,
      create: `${apiUrl}/${stripLeadingSlash(endpoints.create)}`,
      update: `${apiUrl}/${stripLeadingSlash(endpoints.update)}`,
      delete: `${apiUrl}/${stripLeadingSlash(endpoints.delete)}`
    }),
    [apiUrl, endpoints]
  )

  // memoize a shared 409 `conflictError`, honoring any custom `strings` along the way
  const conflictError = useMemo(
    (): AbRequestError => ({
      status: 409,
      name: options.strings?.conflict ?? 'Conflict',
      message: options.strings?.conflictError ?? 'Conflict error',
      details: {
        message: options.strings?.conflictMessage ?? 'Another request is being processed, please wait for it to finish'
      }
    }),
    [options.strings]
  )


  // --- fetchAll ---
  // fetch every item of the entity in a single GET request
  /**
   * @name fetchAll
   * @description Fetches all the items of the current entity via a GET request
   *
   * @param { any | null } fetchParams - Optional query params appended to the url
   *
   * @returns { Promise<AbRequestResponse<T>> }
   */
  const fetchAll = useCallback(
    async (fetchParams: any = null): Promise<AbRequestResponse<T>> => {
      // wrap things inside a Promise so the loading flag can guard resolve/reject
      return new Promise(async (resolve, reject) => {
        // already fetching all? reject with the `conflictError` & bail out
        if (isAllFetching) {
          reject({ ...conflictError, details: { message: `All ${entity}s are being fetched, please wait for it to finish` } })

          return
        }

        // flip the `isAllFetching` flag while the request is running
        setIsAllFetching(true)

        try {
          // honor the artificial `delayMs` (handy for demos & tests) when set
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          // perform the GET request, appending the stringified `fetchParams` to the url
          resolve(
            await requestJson(`${requestUrls.fetchAll}${stringify(fetchParams)}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
          )
        } catch (error) {
          // let the caller handle any http/network error as they see fit
          reject(error)
        } finally {
          // always reset the loading flag once the request is done
          setIsAllFetching(false)
        }
      })
    },
    [isAllFetching, conflictError, entity, delayMs, stringify, requestUrls]
  )


  // --- fetchOne ---
  // fetch a single item of the entity by its `id` via a GET request
  /**
   * @name fetchOne
   * @description Fetches one item of the current entity (by `id`) via a GET request
   *
   * @param { number } id - The id of the item to fetch
   * @param { any | null } fetchParams - Optional query params appended to the url
   *
   * @returns { Promise<AbRequestResponse<T>> }
   */
  const fetchOne = useCallback(
    async (id: number, fetchParams: any = null): Promise<AbRequestResponse<T>> => {
      // wrap things inside a Promise so the loading flag can guard resolve/reject
      return new Promise(async (resolve, reject) => {
        // already fetching one? reject with the `conflictError` & bail out
        if (isOneFetching) {
          reject({ ...conflictError, details: { message: `One ${entity} is being fetched, please wait for it to finish` } })

          return
        }

        // flip the `isOneFetching` flag while the request is running
        setIsOneFetching(true)

        try {
          // honor the artificial `delayMs` (handy for demos & tests) when set
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          // perform the GET request, appending `id` & the stringified `fetchParams`
          resolve(
            await requestJson(`${requestUrls.fetchOne}/${id}${stringify(fetchParams)}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
          )
        } catch (error) {
          // let the caller handle any http/network error as they see fit
          reject(error)
        } finally {
          // always reset the loading flag once the request is done
          setIsOneFetching(false)
        }
      })
    },
    [isOneFetching, conflictError, entity, delayMs, stringify, requestUrls]
  )


  // --- create ---
  // create a new item of the entity via a POST request
  /**
   * @name create
   * @description Creates a new item for the current entity via a POST request
   *
   * @param { string } userToken - The bearer token used for authorization
   * @param { Record<string, unknown> } newData - The new item's data
   *
   * @returns { Promise<AbRequestResponse<T>> }
   */
  const create = useCallback(
    async (userToken: string, newData: Record<string, unknown>): Promise<AbRequestResponse<T>> => {
      // wrap things inside a Promise so the loading flag can guard resolve/reject
      return new Promise(async (resolve, reject) => {
        // already creating? reject with the `conflictError` & bail out
        if (isCreating) {
          reject({ ...conflictError, details: { message: `A ${entity} is being created, please wait for it to finish` } })

          return
        }

        // flip the `isCreating` flag while the request is running
        setIsCreating(true)

        try {
          // honor the artificial `delayMs` (handy for demos & tests) when set
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          // perform the POST request, sending `newData` as the JSON body
          resolve(
            await requestJson(requestUrls.create, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${userToken}`
              },
              body: JSON.stringify(newData)
            })
          )
        } catch (error) {
          // let the caller handle any http/network error as they see fit
          reject(error)
        } finally {
          // always reset the loading flag once the request is done
          setIsCreating(false)
        }
      })
    },
    [isCreating, conflictError, entity, delayMs, requestUrls]
  )


  // --- update ---
  // update an existing item of the entity by its `id` via a PUT request
  /**
   * @name update
   * @description Updates an existing item (by `id`) of the current entity via a PUT request
   *
   * @param { number } id - The id of the item to update
   * @param { Record<string, unknown> } updateData - The updated item's data
   * @param { string? } userToken - Optional bearer token used for authorization
   *
   * @returns { Promise<AbRequestResponse<T>> }
   */
  const update = useCallback(
    async (id: number, updateData: Record<string, unknown>, userToken?: string): Promise<AbRequestResponse<T>> => {
      // wrap things inside a Promise so the loading flag can guard resolve/reject
      return new Promise(async (resolve, reject) => {
        // already updating? reject with the `conflictError` & bail out
        if (isUpdating) {
          reject({ ...conflictError, details: { message: `This ${entity} is being updated, please wait for it to finish` } })

          return
        }

        // flip the `isUpdating` flag while the request is running
        setIsUpdating(true)

        try {
          // honor the artificial `delayMs` (handy for demos & tests) when set
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          // perform the PUT request, sending `updateData` & `id` in the url
          resolve(
            await requestJson(`${requestUrls.update}/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(userToken ? { Authorization: `Bearer ${userToken}` } : {})
              },
              body: JSON.stringify(updateData)
            })
          )
        } catch (error) {
          // let the caller handle any http/network error as they see fit
          reject(error)
        } finally {
          // always reset the loading flag once the request is done
          setIsUpdating(false)
        }
      })
    },
    [isUpdating, conflictError, entity, delayMs, requestUrls]
  )


  // --- remove ---
  // delete an existing item of the entity by its `id` via a DELETE request
  /**
   * @name remove
   * @description Deletes an existing item (by `id`) of the current entity via a DELETE request
   *
   * @param { number } id - The id of the item to delete
   * @param { string? } userToken - Optional bearer token used for authorization
   *
   * @returns { Promise<AbRequestResponse<T>> }
   */
  const remove = useCallback(
    async (id: number, userToken?: string): Promise<AbRequestResponse<T>> => {
      // wrap things inside a Promise so the loading flag can guard resolve/reject
      return new Promise(async (resolve, reject) => {
        // already deleting? reject with the `conflictError` & bail out
        if (isDeleting) {
          reject({ ...conflictError, details: { message: `This ${entity} is being deleted, please wait for it to finish` } })

          return
        }

        // flip the `isDeleting` flag while the request is running
        setIsDeleting(true)

        try {
          // honor the artificial `delayMs` (handy for demos & tests) when set
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          // perform the DELETE request, appending the `id` to the url
          resolve(
            await requestJson(`${requestUrls.delete}/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(userToken ? { Authorization: `Bearer ${userToken}` } : {})
              }
            })
          )
        } catch (error) {
          // let the caller handle any http/network error as they see fit
          reject(error)
        } finally {
          // always reset the loading flag once the request is done
          setIsDeleting(false)
        }
      })
    },
    [isDeleting, conflictError, entity, delayMs, requestUrls]
  )


  // return the raw object w/ all the loading flags, the `conflictError` & every action
  return {
    isAllFetching,
    isOneFetching,
    isCreating,
    isUpdating,
    isDeleting,
    conflictError,
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
}


// export `useAbRequest` hook & `requestJson` helper as named exports
export { useAbRequest, requestJson }