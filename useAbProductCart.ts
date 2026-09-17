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
* @name: Product Cart - AB Hook
* @file: useAbProductCart.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Add a product to the cart
*    -|> import useAbProductCart from './useAbProductCart'
*    -|>
*    -|> const { addProductToCart, cartProducts } = useAbProductCart()
*    -|>
*    -|> // console.log(await addProductToCart(12, 2)) // ==> 2
*    -|> // console.log(cartProducts) // ==> [{ pid: 12, qty: 2, color_id: 1, ... }]
*    -|>
*
*   2+|> // Totals & verification
*    -|> const { getTotalCartProducts, verifyProductCart } = useAbProductCart()
*    -|>
*    -|> // console.log(getTotalCartProducts()) // ==> 1
*    -|> // console.log(verifyProductCart(12)) // ==> true
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




// ===== PRODUCT CART - TYPES & CONSTANTS ===== //


// create a cart item type as `AbCartItem`
// note: `created_at` / `updated_at` are set on first add & subsequent qty changes
export interface AbCartItem {
  pid: number
  qty: number
  color_id: number
  created_at?: string
  updated_at?: string
}


// create an array of cart items as `AbCart`
export type AbCart = Array<AbCartItem>


// create a product cart result interface as `AbProductCartResultInterface`
// note: every mutation resolves the new quantity for easy chaining
export interface AbProductCartResult {
  cartProducts: AbCart
  addProductToCart: (productId: number, productQuantity?: number, colorId?: number) => Promise<number>
  removeProductFromCart: (productId: number, productQuantity?: number, colorId?: number) => Promise<number>
  verifyProductCart: (productId: number, colorId?: number) => boolean
  getProductCartQuantity: (productId: number) => number
  getTotalCartProducts: (includeQuantity?: boolean) => number
}


// create a product cart params interface as `AbProductCartParams`
export interface AbProductCartParams {
  enableServerCart?: boolean
  storageKey?: string
}


// default localStorage key for the cart
// note: override it at runtime via `params.storageKey`
const AB_CART_STORAGE_KEY = 'ab_cart'




// ---- PRIVATE HELPERS ----


// find a cart item by `productId` (+ optional `colorId`); falls back to color 1
const findCartItem = (cartProducts: AbCart, productId: number, colorId: number = 1): AbCartItem | undefined => {
  return cartProducts.find((item: AbCartItem) => item.pid === productId && item.color_id === colorId)
}


// read + parse the cart from localStorage
// note: guarded for SSR (no `window`) and falls back to `[]` on bad/missing JSON
const getStoredCart = (storageKey: string): AbCart => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbCart) : []
  } catch {
    return []
  }
}




// ===== useAbProductCart - AB HOOK ===== //


/**
 * @name useAbProductCart
 * @description A product cart hook backed by localStorage that adds/removes/verifies
 * product(s) (keyed by product id + color id) and persists the cart on every change
 *
 * @param { AbProductCartParams } params - Hook params; `storageKey` overrides `AB_CART_STORAGE_KEY`
 *
 * @returns { AbProductCartResult }
 */
const useAbProductCart = (params: AbProductCartParams = {}): AbProductCartResult => {

  // resolve the storage key (default = 'ab_cart')
  const storageKey = params.storageKey ?? AB_CART_STORAGE_KEY

  // hydrate the cart once from localStorage on mount (lazy initial state)
  const [cartProducts, setCartProducts] = useState<AbCart>(() => getStoredCart(storageKey))


  // persist the cart to localStorage whenever it (or the key) changes
  // note: skips SSR since there's no `window` on the server
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(cartProducts))
  }, [storageKey, cartProducts])


  // add `productQuantity` (default: 1) of a product (w/ optional `colorId`) to the cart
  // note: increments the existing item's qty if it's already in the cart
  const addProductToCart = useCallback(
    (productId: number, productQuantity: number = 1, colorId: number = 1): Promise<number> => {
      return new Promise((resolve) => {
        // grab the current qty (if any) so adding = current + new
        const currentQuantity: number = findCartItem(cartProducts, productId, colorId)?.qty ?? 0
        const total: number = currentQuantity + productQuantity
        const now: string = new Date().toISOString()

        setCartProducts((prev: AbCart) => {
          const found = findCartItem(prev, productId, colorId)

          // if the item exists, bump its qty & touch `updated_at`
          if (found) {
            return prev.map((item: AbCartItem) => (item === found ? { ...item, qty: total, updated_at: now } : item))
          }

          // otherwise append a brand-new cart item
          return [...prev, { pid: productId, qty: total, color_id: colorId, created_at: now, updated_at: now }]
        })

        // resolve with the new total qty
        resolve(total)
      })
    },
    [cartProducts]
  )


  // remove `productQuantity` (default: 1) of a product from the cart
  // note: the whole item is dropped once its qty hits 0 or below
  const removeProductFromCart = useCallback(
    (productId: number, productQuantity: number = 1, colorId: number = 1): Promise<number> => {
      return new Promise((resolve) => {
        const currentQuantity: number = findCartItem(cartProducts, productId, colorId)?.qty ?? 0
        const total: number = Math.max(currentQuantity - productQuantity, 0)
        const now: string = new Date().toISOString()

        setCartProducts((prev: AbCart) => {
          // drop the item entirely when its quantity is exhausted
          if (total <= 0) {
            return prev.filter((item: AbCartItem) => !(item.pid === productId && item.color_id === colorId))
          }

          // otherwise just decrement the qty & touch `updated_at`
          return prev.map((item: AbCartItem) =>
            item.pid === productId && item.color_id === colorId ? { ...item, qty: total, updated_at: now } : item
          )
        })

        resolve(total)
      })
    },
    [cartProducts]
  )


  // check whether a product (w/ optional `colorId`) is currently in the cart
  const verifyProductCart = (productId: number, colorId: number = 1): boolean => {
    return !!findCartItem(cartProducts, productId, colorId)
  }


  // sum up the qty of a product across every color variant in the cart
  const getProductCartQuantity = (productId: number): number => {
    return cartProducts
      .filter((item: AbCartItem) => item.pid === productId)
      .reduce((sum: number, item: AbCartItem) => sum + item.qty, 0)
  }


  // count the cart items; pass `includeQuantity` = true to sum up all their qtys instead
  const getTotalCartProducts = (includeQuantity: boolean = false): number => {
    if (includeQuantity) {
      return cartProducts.reduce((sum: number, item: AbCartItem) => sum + item.qty, 0)
    }

    return cartProducts.length
  }


  // return `cartProducts` + all cart helpers
  return {
    cartProducts,
    addProductToCart,
    removeProductFromCart,
    verifyProductCart,
    getProductCartQuantity,
    getTotalCartProducts
  }
}


// export `useAbProductCart` hook as named export
export { useAbProductCart }


// export `useAbProductCart` hook as default
export default useAbProductCart