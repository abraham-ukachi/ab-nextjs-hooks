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
* @name: Combined - AB Filter Hook
* @file: useAbFilter.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the combined filter hook (labels + request)
*    -|> import useFilter from './useAbFilter'
*    -|>
*    -|> const { filterLabels, getFilterLabel, fetchAllFilters } = useFilter()
*    -|>
*    -|> // console.log(filterLabels) // ==> all filter labels
*    -|>
*
*   2+|> // Pass custom defaults
*    -|> const { isAllFiltersFetching, fetchAllFilters } = useFilter(DEFAULT_FILTER_KEYS, { delayMs: 1000 })
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
import type { AbFilterLabelsResult } from './useAbFilterLabels'
import type { UseFilterRequestResponse, UseFilterRequestParams } from './useAbFilterRequest'
// AB hooks
import { useFilterLabels } from './useAbFilterLabels'
import { useFilterRequest } from './useAbFilterRequest'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== FILTER - TYPES & CONSTANTS ===== //


// create a combined filter result = labels result + request response
export type UseFilterResult = AbFilterLabelsResult & UseFilterRequestResponse




// ===== useFilter - AB HOOK ===== //


/**
 * @name useFilter
 * @description A combined filter hook that merges labels & request results
 *   into a single `UseFilterResult`, sparing callers from mounting 2 hooks.
 *   note: the filter labels group is `AbFilterLabelsResult`, which already
 *   bundles the sub-label helpers (brand, collection, price, color, shape...).
 *
 * @param { Array<string> | null } defaultFilterKeys - The default filter keys to use;
 *   normalized to `undefined` so `useFilterLabels` uses its own defaults
 * @param { UseFilterRequestParams | null } defaultFilterRequestParams - The default filter
 *   request params; normalized to `{}` so `useFilterRequest` starts clean
 *
 * @returns { UseFilterResult }
 */
const useFilter = (
  defaultFilterKeys: Array<string> | null = null,
  defaultFilterRequestParams: UseFilterRequestParams | null = null
): UseFilterResult => {

  // merge the two sub-hooks into one result; nulls become clean fallbacks
  return {
    // spread the filter labels group (filterLabels, filterKeys & all `get*Label` helpers)
    ...useFilterLabels(defaultFilterKeys ?? undefined),
    // spread the filter request group (fetch methods & `is`* flags)
    ...useFilterRequest(defaultFilterRequestParams ?? {})
  }

}


// export `useFilter` hook as named export
export { useFilter }


// export `useFilter` hook as default
export default useFilter