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
* @name: Labels - AB Price Hook
* @file: useAbPriceLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the price labels hook
*    -|> import usePriceLabels from './useAbPriceLabels'
*    -|>
*    -|> const { priceLabels } = usePriceLabels()
*    -|>
*    -|> // console.log(priceLabels) // ==> { "cheap": "Cheap", "affordable": "Affordable", ... }
*    -|>
*
*   2+|> // Get a single price label
*    -|> const { getPriceLabel } = usePriceLabels()
*    -|>
*    -|> // console.log(getPriceLabel('veryExpensive')) // ==> "Very Expensive"
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




// ===== PRICE LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a price as `PriceLabels`
export type PriceLabels = AbLabels


// create a price labels result interface as `PriceLabelsResult`
export interface PriceLabelsResult {
  priceLabels: PriceLabels
  priceKeys: Array<string>
  getPriceLabel: (key: string, labels?: PriceLabels) => string
}



// default price keys: from the cheap end (extraCheap) to the expensive end (extraExpensive)
// note: `affordable` is the neutral sweet-spot in the middle
// TODO: add more price keys (e.g. 'bargain', 'mid-range', 'luxury'...)
export const DEFAULT_PRICE_KEYS: Array<string> = [
  'extraCheap',
  'tooCheap',
  'veryCheap',
  'cheap',
  'affordable',

  'veryExpensive',
  'tooExpensive',
  'extraExpensive'
]




// ===== usePriceLabels - AB HOOK ===== //


/**
 * @name usePriceLabels
 * @description A price labels hook that builds a map of label keys for a price
 *
 * @param { Array<string> } defaultPriceKeys - The default price keys to use
 * @param { PriceLabels? } labels - Custom price labels to override the humanized ones
 *
 * @returns { PriceLabelsResult }
 */
const usePriceLabels = (defaultPriceKeys: Array<string> = DEFAULT_PRICE_KEYS, labels?: PriceLabels): PriceLabelsResult => {

  // build the price labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the price labels result as `result`
    const result = buildAbLabels<PriceLabels>(defaultPriceKeys, labels)

    // return `priceLabels`, `priceKeys` & `getPriceLabel`
    return {
      priceLabels: result.labels,
      priceKeys: result.keys,
      getPriceLabel: result.getLabel
    }

  }, [defaultPriceKeys, labels])

}


// export `usePriceLabels` hook as named export
export { usePriceLabels }


// export `usePriceLabels` hook as default
export default usePriceLabels