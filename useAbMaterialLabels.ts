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
* @name: Labels - AB Material Hook
* @file: useAbMaterialLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use material labels hook
*    -|> import useMaterialLabels from './useAbMaterialLabels'
*    -|>
*    -|> const { materialLabels } = useMaterialLabels()
*    -|>
*    -|> // console.log(materialLabels) // ==> { "acetate": "Acetate", "titanium": "Titanium", ... }
*    -|>
*
*   2+|> // Get a material label
*    -|> const { getMaterialLabel } = useMaterialLabels()
*    -|>
*    -|> // console.log(getMaterialLabel('carbonFiber')) // ==> "Carbon Fiber"
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




// ===== MATERIAL LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a material as `MaterialLabels`
export type MaterialLabels = AbLabels


// create a material labels result interface as `MaterialLabelsResult`
export interface MaterialLabelsResult {
  materialLabels: MaterialLabels
  materialKeys: Array<string>
  getMaterialLabel: (key: string, labels?: MaterialLabels) => string
}


// default material keys
// TODO: add more material keys (e.g. 'keratin', 'bioAcetate', 'recycledNylon')
export const DEFAULT_MATERIAL_KEYS: Array<string> = [

  // pure frame materials
  'acetate',
  'metal',
  'titanium',
  'wood',
  'plastic',
  'rubber',
  'stainlessSteel',
  'aluminium',
  'carbonFiber',
  'nylon',

  // acetate combos
  'acetateMetal',
  'acetateTitanium',
  'acetateWood',
  'acetatePlastic',
  'acetateRubber',
  'acetateStainlessSteel',
  'acetateAluminium',
  'acetateCarbonFiber',
  'acetateNylon',

  // metal combos
  'metalTitanium',
  'metalWood',
  'metalPlastic',
  'metalRubber',
  'metalStainlessSteel',
  'metalAluminium',
  'metalCarbonFiber',
  'metalNylon',

  // titanium combos
  'titaniumWood',
  'titaniumPlastic',
  'titaniumRubber',
  'titaniumStainlessSteel',
  'titaniumAluminium',
  'titaniumCarbonFiber',
  'titaniumNylon',

  // wood combos
  'woodPlastic',
  'woodRubber',
  'woodStainlessSteel',
  'woodAluminium',
  'woodCarbonFiber',
  'woodNylon',

  // plastic combos
  'plasticRubber',
  'plasticStainlessSteel'

]




// ===== useMaterialLabels - AB HOOK ===== //


/**
 * @name useMaterialLabels
 * @description A material labels hook that builds a map of label keys for a frame material
 *
 * @param { Array<string> } defaultMaterialKeys - The default material keys to use
 * @param { MaterialLabels? } labels - Custom material labels to override the humanized ones
 *
 * @returns { MaterialLabelsResult }
 */
const useMaterialLabels = (
  defaultMaterialKeys: Array<string> = DEFAULT_MATERIAL_KEYS,
  labels?: MaterialLabels
): MaterialLabelsResult => {

  // build the material labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the material labels result as `result`
    const result = buildAbLabels<MaterialLabels>(defaultMaterialKeys, labels)

    // return `materialLabels`, `materialKeys` & `getMaterialLabel`
    return {
      materialLabels: result.labels,
      materialKeys: result.keys,
      getMaterialLabel: result.getLabel
    }

  }, [defaultMaterialKeys, labels])

}


// export `useMaterialLabels` hook as named export
export { useMaterialLabels }


// export `useMaterialLabels` hook as default
export default useMaterialLabels