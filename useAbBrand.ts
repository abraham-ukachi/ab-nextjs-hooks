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
* @name: Combined - AB Brand Hook
* @file: useAbBrand.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the combined brand hook (labels + colors + request)
*    -|> import useBrand from './useAbBrand'
*    -|>
*    -|> const { brandLabels, getBrandLabel, brandColors, getBrandColor, fetchAllBrands } = useBrand()
*    -|>
*    -|> // console.log(brandLabels, brandColors) // ==> all brand labels & colors
*    -|>
*
*   2+|> // Pass custom defaults
*    -|> const { isAllBrandsFetching, fetchAllBrands } = useBrand(DEFAULT_BRAND_KEYS, { delayMs: 1000 })
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
import type { BrandLabelsResult } from './useAbBrandLabels'
import type { UseBrandRequestResponse, UseBrandRequestParams } from './useAbBrandRequest'
import type { AbBrandColorsResult } from './useAbBrandColors'
// AB hooks
import { useBrandLabels } from './useAbBrandLabels'
import { useBrandRequest } from './useAbBrandRequest'
import { useBrandColors } from './useAbBrandColors'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== BRAND - TYPES & CONSTANTS ===== //


// create a combined brand result = labels result + request response + colors result
export type UseBrandResult = BrandLabelsResult & UseBrandRequestResponse & AbBrandColorsResult




// ===== useBrand - AB HOOK ===== //


/**
 * @name useBrand
 * @description A combined brand hook that merges labels, colors & request results
 *   into a single `UseBrandResult`, sparing callers from mounting 3 hooks.
 *
 * @param { Array<string> | null } defaultBrandKeys - The default brand keys to use;
 *   normalized to `undefined` so `useBrandLabels` falls back to its own defaults
 * @param { UseBrandRequestParams | null } defaultBrandRequestParams - The default brand
 *   request params; normalized to `{}` so `useBrandRequest` starts with no overrides
 *
 * @returns { UseBrandResult }
 */
const useBrand = (
  defaultBrandKeys: Array<string> | null = null,
  defaultBrandRequestParams: UseBrandRequestParams | null = null
): UseBrandResult => {

  // merge the three sub-hooks into one result; nulls become clean fallbacks
  return {
    // spread the brand labels group (brandLabels, brandKeys, getBrandLabel)
    ...useBrandLabels(defaultBrandKeys ?? undefined),
    // spread the brand request group (fetch methods & `is`* flags)
    ...useBrandRequest(defaultBrandRequestParams ?? {}),
    // spread the brand colors group (brandColors, getBrandColor)
    ...useBrandColors()
  }

}


// export `useBrand` hook as named export
export { useBrand }


// export `useBrand` hook as default
export default useBrand