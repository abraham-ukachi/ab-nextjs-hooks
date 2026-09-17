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
* @name: Labels - AB Branch Hook
* @file: useAbBranchLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use branch labels hook
*    -|> import useBranchLabels from './useAbBranchLabels'
*    -|>
*    -|> const { branchLabels } = useBranchLabels()
*    -|>
*    -|> // console.log(branchLabels) // ==> { "flexible": "Flexible", "springHinge": "Spring Hinge", ... }
*    -|>
*
*   2+|> // Get a branch label
*    -|> const { getBranchLabel } = useBranchLabels()
*    -|>
*    -|> // console.log(getBranchLabel('springHinge')) // ==> "Spring Hinge"
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




// ===== BRANCH LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a branch as `BranchLabels`
export type BranchLabels = AbLabels


// create a branch labels result interface as `BranchLabelsResult`
export interface BranchLabelsResult {
  branchLabels: BranchLabels
  branchKeys: Array<string>
  getBranchLabel: (key: string, labels?: BranchLabels) => string
}


// default branch keys
// TODO: add more branch keys (e.g. 'titaniumFlex', 'memoryMetal')
export const DEFAULT_BRANCH_KEYS: Array<string> = [

  // flexible builds
  'flexible',
  'adjustable',
  'springHinge',

  // attach mechanisms
  'clipOn',
  'magnetic',

  // removable & swappable
  'folding',
  'removable',
  'detachable',
  'interchangeable',

  // adaptive builds
  'convertible',
  'reversible',
  'retractable',
  'rotating',
  'swappable',
  'swiveling',

  // bendable builds
  'foldable',
  'bendable',
  'twistable'

]




// ===== useBranchLabels - AB HOOK ===== //


/**
 * @name useBranchLabels
 * @description A branch labels hook that builds a map of label keys for an eyewear branch (arm/temple)
 *
 * @param { Array<string> } defaultBranchKeys - The default branch keys to use
 * @param { BranchLabels? } labels - Custom branch labels to override the humanized ones
 *
 * @returns { BranchLabelsResult }
 */
const useBranchLabels = (
  defaultBranchKeys: Array<string> = DEFAULT_BRANCH_KEYS,
  labels?: BranchLabels
): BranchLabelsResult => {

  // build the branch labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the branch labels result as `result`
    const result = buildAbLabels<BranchLabels>(defaultBranchKeys, labels)

    // return `branchLabels`, `branchKeys` & `getBranchLabel`
    return {
      branchLabels: result.labels,
      branchKeys: result.keys,
      getBranchLabel: result.getLabel
    }

  }, [defaultBranchKeys, labels])

}


// export `useBranchLabels` hook as named export
export { useBranchLabels }


// export `useBranchLabels` hook as default
export default useBranchLabels