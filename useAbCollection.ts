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
* @name: Combined - AB Collection Hook
* @file: useAbCollection.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the combined collection hook (labels + request)
*    -|> import useCollection from './useAbCollection'
*    -|>
*    -|> const { collectionLabels, getCollectionLabel, fetchAllCollections } = useCollection()
*    -|>
*    -|> // console.log(collectionLabels) // ==> all collection labels
*    -|>
*
*   2+|> // Pass custom defaults
*    -|> const { isAllCollectionsFetching, fetchAllCollections } = useCollection(DEFAULT_COLLECTION_KEYS, { delayMs: 1000 })
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
import type { CollectionLabelsResult } from './useAbCollectionLabels'
import type { UseCollectionRequestResponse, UseCollectionRequestParams } from './useAbCollectionRequest'
// AB hooks
import { useCollectionLabels } from './useAbCollectionLabels'
import { useCollectionRequest } from './useAbCollectionRequest'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== COLLECTION - TYPES & CONSTANTS ===== //


// create a combined collection result = labels result + request response
export type UseCollectionResult = CollectionLabelsResult & UseCollectionRequestResponse




// ===== useCollection - AB HOOK ===== //


/**
 * @name useCollection
 * @description A combined collection hook that merges labels & request results
 *   into a single `UseCollectionResult`, sparing callers from mounting 2 hooks.
 *
 * @param { Array<string> | null } defaultCollectionKeys - The default collection keys to
 *   use; normalized to `undefined` so `useCollectionLabels` uses its own defaults
 * @param { UseCollectionRequestParams | null } defaultCollectionRequestParams - The default
 *   collection request params; normalized to `{}` so `useCollectionRequest` starts clean
 *
 * @returns { UseCollectionResult }
 */
const useCollection = (
  defaultCollectionKeys: Array<string> | null = null,
  defaultCollectionRequestParams: UseCollectionRequestParams | null = null
): UseCollectionResult => {

  // merge the two sub-hooks into one result; nulls become clean fallbacks
  return {
    // spread the collection labels group (collectionLabels, collectionKeys, getCollectionLabel)
    ...useCollectionLabels(defaultCollectionKeys ?? undefined),
    // spread the collection request group (fetch methods & `is`* flags)
    ...useCollectionRequest(defaultCollectionRequestParams ?? {})
  }

}


// export `useCollection` hook as named export
export { useCollection }


// export `useCollection` hook as default
export default useCollection