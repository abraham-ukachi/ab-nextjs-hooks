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
* @name: Combined - AB Product Hook
* @file: useAbProduct.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the combined product hook (labels + request)
*    -|> import useProduct from './useAbProduct'
*    -|>
*    -|> const { productLabels, getProductLabel, fetchAllProducts } = useProduct()
*    -|>
*    -|> // console.log(productLabels) // ==> all product labels
*    -|>
*
*   2+|> // Pass custom defaults
*    -|> const { isAllProductsFetching, fetchAllProducts } = useProduct(DEFAULT_PRODUCT_KEYS, { delayMs: 1000 })
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
import type { ProductLabelsResult } from './useAbProductLabels'
import type { UseProductRequestResponse, UseProductRequestParams } from './useAbProductRequest'
// AB hooks
import { useProductLabels } from './useAbProductLabels'
import { useProductRequest } from './useAbProductRequest'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== PRODUCT - TYPES & CONSTANTS ===== //


// create a product params interface as `UseProductParamsInterface`
export interface UseProductParamsInterface {
  defaultProductKeys?: Array<string>
  defaultProductRequestParams?: UseProductRequestParams
}

// create a combined product params type as `UseProductParams`
export type UseProductParams = UseProductParamsInterface

// create a combined product result = labels result + request response
export type UseProductResult = ProductLabelsResult & UseProductRequestResponse




// ===== useProduct - AB HOOK ===== //


/**
 * @name useProduct
 * @description A combined product hook that merges labels & request results
 *   into a single `UseProductResult`, sparing callers from mounting 2 hooks.
 *
 * @param { Array<string> | null } defaultProductKeys - The default product keys to use;
 *   normalized to `undefined` so `useProductLabels` uses its own defaults
 * @param { UseProductRequestParams | null } defaultProductRequestParams - The default
 *   product request params; normalized to `{}` so `useProductRequest` starts clean
 *
 * @returns { UseProductResult }
 */
const useProduct = (
  defaultProductKeys: Array<string> | null = null,
  defaultProductRequestParams: UseProductRequestParams | null = null
): UseProductResult => {

  // merge the two sub-hooks into one result; nulls become clean fallbacks
  return {
    // spread the product labels group (productLabels, productKeys, getProductLabel)
    ...useProductLabels(defaultProductKeys ?? undefined),
    // spread the product request group (fetch methods & `is`* flags)
    ...useProductRequest(defaultProductRequestParams ?? {})
  }

}


// export `useProduct` hook as named export
export { useProduct }


// export `useProduct` hook as default
export default useProduct