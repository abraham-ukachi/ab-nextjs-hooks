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
* @name: Labels - AB Lens Hook
* @file: useAbLensLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use lens labels hook
*    -|> import useLensLabels from './useAbLensLabels'
*    -|>
*    -|> const { lensLabels } = useLensLabels()
*    -|>
*    -|> // console.log(lensLabels) // ==> { "clear": "Clear", "polarized": "Polarized", ... }
*    -|>
*
*   2+|> // Get a lens label
*    -|> const { getLensLabel } = useLensLabels()
*    -|>
*    -|> // console.log(getLensLabel('uvProtection')) // ==> "UV Protection"
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




// ===== LENS LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a lens as `LensLabels`
export type LensLabels = AbLabels


// create a lens labels result interface as `LensLabelsResult`
export interface LensLabelsResult {
  lensLabels: LensLabels
  lensKeys: Array<string>
  getLensLabel: (key: string, labels?: LensLabels) => string
}


// default lens keys
// TODO: add more lens keys (e.g. 'transition', 'blueLight', 'photochromic' variants)
export const DEFAULT_LENS_KEYS: Array<string> = [

  // standard & vision-correcting lenses
  'clear',
  'blueLightBlocking',
  'photochromic',
  'polarized',
  'mirrored',
  'gradient',
  'tinted',

  // lens coatings
  'antiReflective',
  'antiScratch',
  'antiFog',
  'uvProtection',
  'waterRepellent',
  'oilRepellent',

  // hygiene & durability coatings
  'antiGlare',
  'antiSmudge',
  'antiOil',
  'antiShock',
  'antiBacterial'

]




// ===== useLensLabels - AB HOOK ===== //


/**
 * @name useLensLabels
 * @description A lens labels hook that builds a map of label keys for an eyewear lens
 *
 * @param { Array<string> } defaultLensKeys - The default lens keys to use
 * @param { LensLabels? } labels - Custom lens labels to override the humanized ones
 *
 * @returns { LensLabelsResult }
 */
const useLensLabels = (defaultLensKeys: Array<string> = DEFAULT_LENS_KEYS, labels?: LensLabels): LensLabelsResult => {

  // build the lens labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the lens labels result as `result`
    const result = buildAbLabels<LensLabels>(defaultLensKeys, labels)

    // return `lensLabels`, `lensKeys` & `getLensLabel`
    return {
      lensLabels: result.labels,
      lensKeys: result.keys,
      getLensLabel: result.getLabel
    }

  }, [defaultLensKeys, labels])

}


// export `useLensLabels` hook as named export
export { useLensLabels }


// export `useLensLabels` hook as default
export default useLensLabels