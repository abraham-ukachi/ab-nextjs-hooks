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
* @name: Data Mapper - AB response-mapping utilities & hook
* @file: useAbDataMapper.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // map a paginated API response into typed records + meta + total
*    -|> import useAbDataMapper from './useAbDataMapper'
*    -|>
*    -|> const { mapped, meta, total } = useAbDataMapper(data, {
*    -|>   resultsKey: 'data',
*    -|>   metaKey: 'pagination'
*    -|> })
*    -|>
*
*   2+|> // build a query string straight from a params object
*    -|> const query = stringifyParams({ page: 1, sort: 'name' }, '?')
*    -|> // console.log(query) // ==> "?page=1&sort=name"
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
import { useMemo } from 'react'
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




// ===== DATA MAPPER - TYPES & CONSTANTS ===== //


// create the pagination metadata shape as `AbMetaPagination`, following the
// common `page`/`pageSize`/`pageCount`/`total` convention
export interface AbMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// create a generic meta bag as `AbMeta`; holds `pagination` (optional) + any
// other response meta keys you may have
export interface AbMeta {
  pagination?: AbMetaPagination
  [key: string]: unknown
}


// create the mapper function type as `AbMapper`; turns one raw record into `T`
export type AbMapper<T = Record<string, unknown>> = (item: Record<string, unknown>) => T


// create the hook/`mapAbData` params as `AbDataMapperParams`; these tell the
// mapper which keys hold the results/meta/total + an optional mapper fn
export interface AbDataMapperParams {
  resultsKey?: string
  metaKey?: string
  totalKey?: string
  mapper?: AbMapper
}


// create the `useAbDataMapper`/`mapAbData` result as `AbDataMapperResult`;
// a bag of mapped records, the meta & a total count
export interface AbDataMapperResult<T> {
  mapped: Array<T>
  meta: AbMeta | null
  total: number
}





// ===== DATA MAPPER - UTILITIES ===== //


/**
 * @name stringifyParams
 * @description Serializes a params object into a query string, prefixed by
 *  default w/ `?`. Returns an empty string for `null`/`undefined` params.
 *
 * @param { Record<string, unknown>? } params - The params to serialize
 * @param { string } prefix - The query-string prefix; defaults to `?`
 *
 * @returns { string } - e.g. "?page=1&sort=name" ("", if no params)
 */
export const stringifyParams = (params: Record<string, unknown> | null = null, prefix: string = '?'): string => {
  // no params => no query string
  if (!params) return ''

  // build & encode the query string, keeping the given prefix
  return `${prefix}${new URLSearchParams(params as Record<string, string>).toString()}`
}


/**
 * @name getAbMetaPagination
 * @description Pulls the `pagination` sub-object out of a meta bag, falling
 *  back to `fallbackPage` for the page and `0` for the rest when missing.
 *
 * @param { AbMeta? } meta - The response meta bag (may be `null`/`undefined`)
 * @param { number } fallbackPage - The page to use when pagination is absent
 *
 * @returns { AbMetaPagination }
 */
export const getAbMetaPagination = (meta: AbMeta | null | undefined, fallbackPage: number = 1): AbMetaPagination => {
  // grab the pagination sub-object (or `undefined`)
  const pagination = meta?.pagination

  // build a full `AbMetaPagination`, defaulting missing bits to `0`/the page
  return {
    page: pagination?.page ?? fallbackPage,
    pageSize: pagination?.pageSize ?? 0,
    pageCount: pagination?.pageCount ?? 0,
    total: pagination?.total ?? 0
  }
}


/**
 * @name mapAbData
 * @description Maps a raw (unknown) payload into `{ mapped, meta, total }`.
 *  Resolves the results array (via `resultsKey`, falling back to `data`), the
 *  meta bag, and a total — applying `mapper` to each record when provided.
 *
 * @param { unknown } data - The raw payload (non-object payloads => empty result)
 * @param { AbDataMapperParams } params - Which keys to read + optional mapper
 *
 * @returns { AbDataMapperResult<T> }
 */
const mapAbData = <T = Record<string, unknown>>(
  data: unknown,
  params: AbDataMapperParams = {}
): AbDataMapperResult<T> => {
  // destructure params w/ the conventional key names
  const { resultsKey = 'results', metaKey = 'meta', totalKey = 'total', mapper } = params

  // early-out: nothing to map (non-object payload) => empty result
  if (!data || typeof data !== 'object') {
    return { mapped: [], meta: null, total: 0 }
  }

  // treat the payload as a plain record
  const rawRecord = data as Record<string, unknown>
  // resolve the results array: `resultsKey` first, then `data`, then `[]`
  const rawResults = (rawRecord[resultsKey] ?? rawRecord.data ?? []) as Array<Record<string, unknown>>
  // resolve the meta bag (or `null`)
  const meta = (rawRecord[metaKey] as AbMeta | undefined) ?? null
  // resolve the total: explicit `totalKey` > pagination total > results length
  const total = (rawRecord[totalKey] as number | undefined) ?? getAbMetaPagination(meta).total ?? rawResults.length

  // apply the mapper to each record when one is given; else pass results through
  const mapped = (mapper ? rawResults.map((item) => mapper(item)) : rawResults) as Array<T>

  // return the mapped records, meta & total
  return { mapped, meta, total }
}





// ===== useAbDataMapper - AB HOOK ===== //


/**
 * @name useAbDataMapper
 * @description A memoized version of `mapAbData`: maps an API response w/ the
 *  same params & keys, but only re-maps when `data` or `params` change.
 *
 * @param { unknown } data - The raw payload to map
 * @param { AbDataMapperParams } params - Which keys to read + optional mapper
 *
 * @returns { AbDataMapperResult<T> }
 */
const useAbDataMapper = <T = Record<string, unknown>>(
  data: unknown,
  params: AbDataMapperParams = {}
): AbDataMapperResult<T> => {
  // deferred mapper: only re-runs when `data`/`params` actually change
  return useMemo(() => mapAbData<T>(data, params), [data, params])
}


// export `useAbDataMapper` & `mapAbData` as named exports
export { useAbDataMapper, mapAbData }


// export `useAbDataMapper` hook as default
export default useAbDataMapper