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
* @name: FAQ Request - AB Hook
* @file: useAbFaqRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Fetch all faqs
*    -|> import useFaqRequest from './useAbFaqRequest'
*    -|>
*    -|> const { fetchAllFaqs } = useFaqRequest()
*    -|>
*    -|> // console.log(await fetchAllFaqs()) // ==> { data: [...], meta: {...} }
*    -|>
*
*   2+|> // Fetch the faqs, sorted by question
*    -|> const { fetchAllFaqs } = useFaqRequest()
*    -|>
*    -|> // console.log(await fetchAllFaqs({ sort: 'desc' }))
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




// ===== FAQ REQUEST - TYPES & CONSTANTS ===== //


// faq pagination query params as `FaqPagination`
export interface FaqPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}


// faq request query params as `FaqParams`
export interface FaqParams {
  sort?: 'asc' | 'desc'
  pagination?: FaqPagination
  fields?: string
  filters?: object
  locale?: string
}


// faq meta pagination info as `FaqMetaPagination`
export interface FaqMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}


// faq response error shape as `FaqResponseError`
export interface FaqResponseError {
  status: number
  name: string
  message: string
  details: object
}


// faq data shape as `FaqData` (a simple question/answer pair)
export interface FaqData {
  id: number
  question: string
  answer: string
  locale?: string
}


// a faq response wraps a list of `FaqData` in the generic `AbRequestResponse`
export type FaqResponse = AbRequestResponse<Array<FaqData>>


// use faq request params as `UseFaqRequestParams`
export interface UseFaqRequestParams {
  apiUrl?: string
  strings?: Record<string, string>
  delayMs?: number
}


// use faq request response shape as `UseFaqRequestResponse`
export interface UseFaqRequestResponse {
  isAllFaqsFetching: boolean
  fetchAllFaqs: (params?: FaqParams | null) => Promise<FaqResponse>
}




// ===== useFaqRequest - AB HOOK ===== //


/**
 * @name useFaqRequest
 * @description A faq request hook that wraps the generic `useAbRequest` factory
 *   with a `faq` entity, exposing a single typed fetch-all helper
 *
 * @param { UseFaqRequestParams } params - The faq request params (apiUrl, strings, delayMs)
 *
 * @returns { UseFaqRequestResponse }
 */
const useFaqRequest = (params: UseFaqRequestParams = {}): UseFaqRequestResponse => {

  // build the underlying faq request via the generic `useAbRequest` factory
  const request = useAbRequest<Array<FaqData>>({
    entity: 'faq',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  // return the busy flag + the single fetch-all helper
  return {
    isAllFaqsFetching: request.isAllFetching,
    // fetch all faqs at once (optionally w/ params)
    fetchAllFaqs: request.fetchAll
  }

}


// export `useFaqRequest` hook as named export
export { useFaqRequest }


// export `useFaqRequest` hook as default
export default useFaqRequest