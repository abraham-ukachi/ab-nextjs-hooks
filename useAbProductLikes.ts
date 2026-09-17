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
* @name: Product Likes - AB Hook
* @file: useAbProductLikes.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Like a product
*    -|> import useAbProductLikes from './useAbProductLikes'
*    -|>
*    -|> const { addProductToLikes, likedProducts } = useAbProductLikes()
*    -|>
*    -|> // console.log(await addProductToLikes(12)) // ==> true
*    -|> // console.log(likedProducts) // ==> [{ pid: 12 }]
*    -|>
*
*   2+|> // Verify & unlike
*    -|> const { verifyProductLikes, removeProductFromLikes } = useAbProductLikes()
*    -|>
*    -|> // console.log(verifyProductLikes(12)) // ==> true
*    -|> // console.log(await removeProductFromLikes(12)) // ==> true
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
import { useCallback, useEffect, useState } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== PRODUCT LIKES - TYPES & CONSTANTS ===== //


// create a likes item type as `AbLikesItem`
// note: only the `pid` matters here; a like is a simple one-per-product flag
export interface AbLikesItem {
  pid: number
}


// create an array of liked products as `AbLikes`
export type AbLikes = Array<AbLikesItem>


// create a product likes result interface as `AbProductLikesResultInterface`
// note: both mutations resolve a `boolean` so callers can react to like/unlike
export interface AbProductLikesResult {
  likedProducts: AbLikes
  addProductToLikes: (productId: number) => Promise<boolean>
  removeProductFromLikes: (productId: number) => Promise<boolean>
  verifyProductLikes: (productId: number) => boolean
}


// create a product likes params interface as `AbProductLikesParams`
export interface AbProductLikesParams {
  enableServerLikes?: boolean
  storageKey?: string
}


// default localStorage key for the likes
// note: override it at runtime via `params.storageKey`
const AB_LIKES_STORAGE_KEY = 'ab_likes'




// ---- PRIVATE HELPERS ----


// read + parse the likes from localStorage
// note: guarded for SSR (no `window`) and falls back to `[]` on bad/missing JSON
const getStoredLikes = (storageKey: string): AbLikes => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbLikes) : []
  } catch {
    return []
  }
}




// ===== useAbProductLikes - AB HOOK ===== //


/**
 * @name useAbProductLikes
 * @description A product likes hook backed by localStorage that adds/removes/verifies
 * liked product(s) and persists the list on every change
 *
 * @param { AbProductLikesParams } params - Hook params; `storageKey` overrides `AB_LIKES_STORAGE_KEY`
 *
 * @returns { AbProductLikesResult }
 */
const useAbProductLikes = (params: AbProductLikesParams = {}): AbProductLikesResult => {

  // resolve the storage key (default = 'ab_likes')
  const storageKey = params.storageKey ?? AB_LIKES_STORAGE_KEY

  // hydrate the likes once from localStorage on mount (lazy initial state)
  const [likedProducts, setLikedProducts] = useState<AbLikes>(() => getStoredLikes(storageKey))


  // persist the likes to localStorage whenever they (or the key) change
  // note: skips SSR since there's no `window` on the server
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(likedProducts))
  }, [storageKey, likedProducts])


  // check whether a product is already liked (memoized read on `likedProducts`)
  const verifyProductLikes = useCallback(
    (productId: number): boolean => {
      return !!likedProducts.find((item: AbLikesItem) => item.pid === productId)
    },
    [likedProducts]
  )


  // add a product to the likes
  // note: resolves `false` (no-op) if the product is already liked
  const addProductToLikes = useCallback(
    (productId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productLiked: boolean = !!likedProducts.find((item: AbLikesItem) => item.pid === productId)

        // already liked => bail out early
        if (productLiked) {
          resolve(false)

          return
        }

        setLikedProducts((prev: AbLikes) => [...prev, { pid: productId }])
        resolve(true)
      })
    },
    [likedProducts]
  )


  // remove a product from the likes
  // note: resolves `false` (no-op) if the product isn't liked; idempotent by design
  const removeProductFromLikes = useCallback(
    (productId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productLiked: boolean = !!likedProducts.find((item: AbLikesItem) => item.pid === productId)

        // not liked => nothing to remove
        if (!productLiked) {
          resolve(false)

          return
        }

        setLikedProducts((prev: AbLikes) => prev.filter((item: AbLikesItem) => item.pid !== productId))
        resolve(true)
      })
    },
    [likedProducts]
  )


  // return `likedProducts` + all likes helpers
  return {
    likedProducts,
    addProductToLikes,
    removeProductFromLikes,
    verifyProductLikes
  }
}


// export `useAbProductLikes` hook as named export
export { useAbProductLikes }


// export `useAbProductLikes` hook as default
export default useAbProductLikes