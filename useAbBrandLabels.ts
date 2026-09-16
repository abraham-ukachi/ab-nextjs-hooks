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
* @name: Labels - AB Brand Hook
* @file: useAbBrandLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use brand labels hook
*    -|> import useBrandLabels from './useAbBrandLabels'
*    -|>
*    -|> const { brandLabels } = useBrandLabels()
*    -|>
*    -|> // console.log(brandLabels) // ==> { "lyd": "LesYeuxDoux", "cg": "Clary Gray", ... }
*    -|>
*
*   2+|> // Get a brand label
*    -|> const { getBrandLabel } = useBrandLabels()
*    -|>
*    -|> // console.log(getBrandLabel('lyd')) // ==> "LesYeuxDoux"
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






// ===== BRAND LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a brand as `BrandLabels`
export type BrandLabels = AbLabels


// create a brand labels result interface as `BrandLabelsResultInterface`
export interface BrandLabelsResultInterface {
  brandLabels: BrandLabels
  brandKeys: Array<string>
  getBrandLabel: (key: string, labels?: BrandLabels) => string
}

// create a brand labels hook type as `BrandLabelsResult`
export type BrandLabelsResult = BrandLabelsResultInterface


// default brand keys
// TODO: add more brand keys
export const DEFAULT_BRAND_KEYS: Array<string> = [
  'lyd',
  'lydName',
  'lydDescription',

  'cg',
  'cgName',
  'cgDescription',

  'hexaa',
  'hexaaName',
  'hexaaDescription'

]






// ===== useBrandLabels - AB HOOK ===== //


/**
 * @name useBrandLabels
 * @description A brand labels hook that builds a map of label keys for a brand
 *
 * @param { Array<string> } defaultBrandKeys - The default brand keys to use
 * @param { BrandLabels? } labels - Custom brand labels to override the humanized ones
 *
 * @returns { BrandLabelsResult }
 */
const useBrandLabels = (defaultBrandKeys: Array<string> = DEFAULT_BRAND_KEYS, labels?: BrandLabels): BrandLabelsResult => {

  // build the brand labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the brand labels result as `result`
    const result = buildAbLabels<BrandLabels>(defaultBrandKeys, labels)

    // return `brandLabels`, `brandKeys` & `getBrandLabel`
    return {
      brandLabels: result.labels,
      brandKeys: result.keys,
      getBrandLabel: result.getLabel
    }

  }, [defaultBrandKeys, labels])

}


// export `useBrandLabels` hook as named export
export { useBrandLabels }


// export `useBrandLabels` hook as default
export default useBrandLabels