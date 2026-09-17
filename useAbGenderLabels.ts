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
* @name: Labels - AB Gender Hook
* @file: useAbGenderLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use gender labels hook
*    -|> import useGenderLabels from './useAbGenderLabels'
*    -|>
*    -|> const { genderLabels } = useGenderLabels()
*    -|>
*    -|> // console.log(genderLabels) // ==> { "men": "Men", "women": "Women", ... }
*    -|>
*
*   2+|> // Get a gender label
*    -|> const { getGenderLabel } = useGenderLabels()
*    -|>
*    -|> // console.log(getGenderLabel('unisex')) // ==> "Unisex"
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




// ===== GENDER LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a gender as `GenderLabels`
export type GenderLabels = AbLabels


// create a gender labels result interface as `GenderLabelsResult`
export interface GenderLabelsResult {
  genderLabels: GenderLabels
  genderKeys: Array<string>
  getGenderLabel: (key: string, labels?: GenderLabels) => string
}


// default gender keys
// TODO: add more gender keys if needed (e.g. 'nonBinary')
export const DEFAULT_GENDER_KEYS: Array<string> = ['men', 'women', 'unisex', 'kids']




// ===== useGenderLabels - AB HOOK ===== //


/**
 * @name useGenderLabels
 * @description A gender labels hook that builds a map of label keys for a product's gender
 *
 * @param { Array<string> } defaultGenderKeys - The default gender keys to use
 * @param { GenderLabels? } labels - Custom gender labels to override the humanized ones
 *
 * @returns { GenderLabelsResult }
 */
const useGenderLabels = (
  defaultGenderKeys: Array<string> = DEFAULT_GENDER_KEYS,
  labels?: GenderLabels
): GenderLabelsResult => {

  // build the gender labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the gender labels result as `result`
    const result = buildAbLabels<GenderLabels>(defaultGenderKeys, labels)

    // return `genderLabels`, `genderKeys` & `getGenderLabel`
    return {
      genderLabels: result.labels,
      genderKeys: result.keys,
      getGenderLabel: result.getLabel
    }

  }, [defaultGenderKeys, labels])

}


// export `useGenderLabels` hook as named export
export { useGenderLabels }


// export `useGenderLabels` hook as default
export default useGenderLabels