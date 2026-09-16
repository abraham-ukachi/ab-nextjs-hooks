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
* @name: Labels - AB Shape Hook
* @file: useAbShapeLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use shape labels hook
*    -|> import useShapeLabels from './useAbShapeLabels'
*    -|>
*    -|> const { shapeLabels } = useShapeLabels()
*    -|>
*    -|> // console.log(shapeLabels) // ==> { "butterfly": "Butterfly", "catEye": "Cat Eye", ... }
*    -|>
*
*   2+|> // Get a shape label
*    -|> const { getShapeLabel } = useShapeLabels()
*    -|>
*    -|> // console.log(getShapeLabel('wayfarer')) // ==> "Wayfarer"
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




// ===== SHAPE LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a shape as `ShapeLabels`
export type ShapeLabels = AbLabels


// create a shape labels result interface as `ShapeLabelsResult`
export interface ShapeLabelsResult {
  shapeLabels: ShapeLabels
  shapeKeys: Array<string>
  getShapeLabel: (key: string, labels?: ShapeLabels) => string
}


// default shape keys
// TODO: add more shape keys (e.g. 'panto', 'd-frame', 'geometric' variants)
export const DEFAULT_SHAPE_KEYS: Array<string> = [

  // classic everyday shapes
  'butterfly',
  'catEye',
  'oval',
  'rectangle',
  'round',
  'square',
  'wayfarer',

  // distinct / trending shapes
  'hexagonal',
  'aviator',
  'browline',
  'geometric',

  // rim & mixed shapes
  'rimless',
  'semiRimless',
  'roundRectangle',
  'roundSquare',
  'shield'

]




// ===== useShapeLabels - AB HOOK ===== //


/**
 * @name useShapeLabels
 * @description A shape labels hook that builds a map of label keys for an eyewear shape
 *
 * @param { Array<string> } defaultShapeKeys - The default shape keys to use
 * @param { ShapeLabels? } labels - Custom shape labels to override the humanized ones
 *
 * @returns { ShapeLabelsResult }
 */
const useShapeLabels = (defaultShapeKeys: Array<string> = DEFAULT_SHAPE_KEYS, labels?: ShapeLabels): ShapeLabelsResult => {

  // build the shape labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the shape labels result as `result`
    const result = buildAbLabels<ShapeLabels>(defaultShapeKeys, labels)

    // return `shapeLabels`, `shapeKeys` & `getShapeLabel`
    return {
      shapeLabels: result.labels,
      shapeKeys: result.keys,
      getShapeLabel: result.getLabel
    }

  }, [defaultShapeKeys, labels])

}


// export `useShapeLabels` hook as named export
export { useShapeLabels }


// export `useShapeLabels` hook as default
export default useShapeLabels