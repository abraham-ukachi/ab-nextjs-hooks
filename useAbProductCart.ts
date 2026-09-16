'use client'

import { useCallback, useEffect, useState } from 'react'

export interface AbCartItem {
  pid: number
  qty: number
  color_id: number
  created_at?: string
  updated_at?: string
}

export type AbCart = Array<AbCartItem>

export interface AbProductCartResult {
  cartProducts: AbCart
  addProductToCart: (productId: number, productQuantity?: number, colorId?: number) => Promise<number>
  removeProductFromCart: (productId: number, productQuantity?: number, colorId?: number) => Promise<number>
  verifyProductCart: (productId: number, colorId?: number) => boolean
  getProductCartQuantity: (productId: number) => number
  getTotalCartProducts: (includeQuantity?: boolean) => number
}

export interface AbProductCartParams {
  enableServerCart?: boolean
  storageKey?: string
}

const AB_CART_STORAGE_KEY = 'ab_cart'

const findCartItem = (cartProducts: AbCart, productId: number, colorId: number = 1): AbCartItem | undefined => {
  return cartProducts.find((item: AbCartItem) => item.pid === productId && item.color_id === colorId)
}

const getStoredCart = (storageKey: string): AbCart => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbCart) : []
  } catch {
    return []
  }
}

const useAbProductCart = (params: AbProductCartParams = {}): AbProductCartResult => {
  const storageKey = params.storageKey ?? AB_CART_STORAGE_KEY
  const [cartProducts, setCartProducts] = useState<AbCart>(() => getStoredCart(storageKey))

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(cartProducts))
  }, [storageKey, cartProducts])

  const addProductToCart = useCallback(
    (productId: number, productQuantity: number = 1, colorId: number = 1): Promise<number> => {
      return new Promise((resolve) => {
        const currentQuantity: number = findCartItem(cartProducts, productId, colorId)?.qty ?? 0
        const total: number = currentQuantity + productQuantity
        const now: string = new Date().toISOString()

        setCartProducts((prev: AbCart) => {
          const found = findCartItem(prev, productId, colorId)

          if (found) {
            return prev.map((item: AbCartItem) => (item === found ? { ...item, qty: total, updated_at: now } : item))
          }

          return [...prev, { pid: productId, qty: total, color_id: colorId, created_at: now, updated_at: now }]
        })

        resolve(total)
      })
    },
    [cartProducts]
  )

  const removeProductFromCart = useCallback(
    (productId: number, productQuantity: number = 1, colorId: number = 1): Promise<number> => {
      return new Promise((resolve) => {
        const currentQuantity: number = findCartItem(cartProducts, productId, colorId)?.qty ?? 0
        const total: number = Math.max(currentQuantity - productQuantity, 0)
        const now: string = new Date().toISOString()

        setCartProducts((prev: AbCart) => {
          if (total <= 0) {
            return prev.filter((item: AbCartItem) => !(item.pid === productId && item.color_id === colorId))
          }

          return prev.map((item: AbCartItem) =>
            item.pid === productId && item.color_id === colorId ? { ...item, qty: total, updated_at: now } : item
          )
        })

        resolve(total)
      })
    },
    [cartProducts]
  )

  const verifyProductCart = (productId: number, colorId: number = 1): boolean => {
    return !!findCartItem(cartProducts, productId, colorId)
  }

  const getProductCartQuantity = (productId: number): number => {
    return cartProducts
      .filter((item: AbCartItem) => item.pid === productId)
      .reduce((sum: number, item: AbCartItem) => sum + item.qty, 0)
  }

  const getTotalCartProducts = (includeQuantity: boolean = false): number => {
    if (includeQuantity) {
      return cartProducts.reduce((sum: number, item: AbCartItem) => sum + item.qty, 0)
    }

    return cartProducts.length
  }

  return {
    cartProducts,
    addProductToCart,
    removeProductFromCart,
    verifyProductCart,
    getProductCartQuantity,
    getTotalCartProducts
  }
}

export { useAbProductCart }

export default useAbProductCart