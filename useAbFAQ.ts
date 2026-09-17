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
* @name: Complete - AB FAQ Hook
* @file: useAbFAQ.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the faq hook (wraps the faq request hook)
*    -|> import useFaq from './useAbFAQ'
*    -|>
*    -|> const { isAllFaqsFetching, fetchAllFaqs } = useFaq()
*    -|>
*    -|> // console.log(await fetchAllFaqs()) // ==> all faqs
*    -|>
*
*   2+|> // Pass custom defaults
*    -|> const { isAllFaqsFetching, fetchAllFaqs } = useFaq({ delayMs: 1000 })
*    -|>
*
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
// NEXT.JS components


// AB types
import type { UseFaqRequestResponse, UseFaqRequestParams } from './useAbFaqRequest'
// AB hooks
import { useFaqRequest } from './useAbFaqRequest'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== FAQ - TYPES & CONSTANTS ===== //


// create a combined faq result as the raw faq request response
// note: faqs have no `labels` group, so the wrapper just re-exposes the request
export type UseFaqResult = UseFaqRequestResponse




// ===== useFaq - AB HOOK ===== //


/**
 * @name useFaq
 * @description A complete faq hook that wraps `useFaqRequest` into a single
 *   `UseFaqResult`, ready for any FAQ section that only needs fetching.
 *
 * @param { UseFaqRequestParams | null } defaultFaqRequestParams - The default faq request
 *   params; normalized to `{}` so `useFaqRequest` starts with no overrides
 *
 * @returns { UseFaqResult }
 */
const useFaq = (defaultFaqRequestParams: UseFaqRequestParams | null = null): UseFaqResult => {

  // wrap the faq request hook; null becomes a clean fallback
  return {
    // spread the faq request group (fetchAllFaqs & `is`* flags)
    ...useFaqRequest(defaultFaqRequestParams ?? {})
  }

}


// export `useFaq` hook as named export
export { useFaq }


// export `useFaq` hook as default
export default useFaq