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
* @name: Labels - AB Product Hook
* @file: useAbProductLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use product labels hook
*    -|> import useProductLabels from './useAbProductLabels'
*    -|>
*    -|> const { productLabels } = useProductLabels()
*    -|>
*    -|> // console.log(productLabels) // ==> { "af099c4": "Af099C4", "af099c4_name": ... }
*    -|>
*
*   2+|> // Get a product label
*    -|> const { getProductLabel } = useProductLabels()
*    -|>
*    -|> // console.log(getProductLabel('af099c4_name')) // ==> "Af099C4 Name"
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
import { buildAbLabels } from './helpers/buildAbLabels'
// NEXT.JS components


// AB types
import type { AbLabels } from './helpers/buildAbLabels'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== PRODUCT LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a product as `ProductLabels`
export type ProductLabels = AbLabels


// create a product labels result interface as `ProductLabelsResult`
export interface ProductLabelsResult {
  productLabels: ProductLabels
  productKeys: Array<string>
  getProductLabel: (key: string, labels?: ProductLabels) => string
}


// default product keys
// note: keys are scoped per-product, so they carry the product id prefix
// TODO: make the product scope dynamic instead of hardcoding the seed keys
export const DEFAULT_PRODUCT_KEYS: Array<string> = ['af099c4', 'af099c4_name', 'af099c4_caption', 'af099c4_description']




// ===== useProductLabels - AB HOOK ===== //


/**
 * @name useProductLabels
 * @description A product labels hook that builds a map of label keys for a product
 *
 * @param { Array<string> } defaultProductKeys - The default product keys to use
 * @param { ProductLabels? } labels - Custom product labels to override the humanized ones
 *
 * @returns { ProductLabelsResult }
 */
const useProductLabels = (
  defaultProductKeys: Array<string> = DEFAULT_PRODUCT_KEYS,
  labels?: ProductLabels
): ProductLabelsResult => {

  // build the product labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the product labels result as `result`
    const result = buildAbLabels<ProductLabels>(defaultProductKeys, labels)

    // return `productLabels`, `productKeys` & `getProductLabel`
    return {
      productLabels: result.labels,
      productKeys: result.keys,
      getProductLabel: result.getLabel
    }

  }, [defaultProductKeys, labels])

}


// export `useProductLabels` hook as named export
export { useProductLabels }


// export `useProductLabels` hook as default
export default useProductLabels