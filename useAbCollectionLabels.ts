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
* @name: Labels - AB Collection Hook
* @file: useAbCollectionLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the collection labels hook
*    -|> import useCollectionLabels from './useAbCollectionLabels'
*    -|>
*    -|> const { collectionLabels } = useCollectionLabels()
*    -|>
*    -|> // console.log(collectionLabels) // ==> { "nuance": "Nuance", "charisme": "Charisme", ... }
*    -|>
*
*   2+|> // Get a single collection label
*    -|> const { getCollectionLabel } = useCollectionLabels()
*    -|>
*    -|> // console.log(getCollectionLabel('titane')) // ==> "Titane"
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




// ===== COLLECTION LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a collection as `CollectionLabels`
export type CollectionLabels = AbLabels


// create a collection labels result interface as `CollectionLabelsResult`
export interface CollectionLabelsResult {
  collectionLabels: CollectionLabels
  collectionKeys: Array<string>
  getCollectionLabel: (key: string, labels?: CollectionLabels) => string
}



// default collection keys: every abElements collection / theme name (nuance to accessories)
// TODO: add more collection keys (e.g. 'demi-lune', 'studio', 'kids-caps'...)
export const DEFAULT_COLLECTION_KEYS: Array<string> = [
  'nuance',
  'charisme',
  'caractere',
  'experience',
  'cosmopolite',
  'lesyeuxdoux',
  'lesyeuxdouxsolaires',
  'lesyeuxdouxadolescents',
  'titane',
  'acetate',
  'essentials',
  'trends',
  'classics',
  'sunglasses',
  'premium',
  'fashion',
  'vintage',
  'athletic',
  'kids',
  'luxury',
  'modern',
  'clearance',
  'custom',
  'safety',
  'accessories'
]




// ===== useCollectionLabels - AB HOOK ===== //


/**
 * @name useCollectionLabels
 * @description A collection labels hook that builds a map of label keys for a collection
 *
 * @param { Array<string> } defaultCollectionKeys - The default collection keys to use
 * @param { CollectionLabels? } labels - Custom collection labels to override the humanized ones
 *
 * @returns { CollectionLabelsResult }
 */
const useCollectionLabels = (
  defaultCollectionKeys: Array<string> = DEFAULT_COLLECTION_KEYS,
  labels?: CollectionLabels
): CollectionLabelsResult => {

  // build the collection labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the collection labels result as `result`
    const result = buildAbLabels<CollectionLabels>(defaultCollectionKeys, labels)

    // return `collectionLabels`, `collectionKeys` & `getCollectionLabel`
    return {
      collectionLabels: result.labels,
      collectionKeys: result.keys,
      getCollectionLabel: result.getLabel
    }

  }, [defaultCollectionKeys, labels])

}


// export `useCollectionLabels` hook as named export
export { useCollectionLabels }


// export `useCollectionLabels` hook as default
export default useCollectionLabels