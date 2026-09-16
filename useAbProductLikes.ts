'use client'

import { useCallback, useEffect, useState } from 'react'

export interface AbLikesItem {
  pid: number
}

export type AbLikes = Array<AbLikesItem>

export interface AbProductLikesResult {
  likedProducts: AbLikes
  addProductToLikes: (productId: number) => Promise<boolean>
  removeProductFromLikes: (productId: number) => Promise<boolean>
  verifyProductLikes: (productId: number) => boolean
}

export interface AbProductLikesParams {
  enableServerLikes?: boolean
  storageKey?: string
}

const AB_LIKES_STORAGE_KEY = 'ab_likes'

const getStoredLikes = (storageKey: string): AbLikes => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbLikes) : []
  } catch {
    return []
  }
}

const useAbProductLikes = (params: AbProductLikesParams = {}): AbProductLikesResult => {
  const storageKey = params.storageKey ?? AB_LIKES_STORAGE_KEY
  const [likedProducts, setLikedProducts] = useState<AbLikes>(() => getStoredLikes(storageKey))

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(likedProducts))
  }, [storageKey, likedProducts])

  const verifyProductLikes = useCallback(
    (productId: number): boolean => {
      return !!likedProducts.find((item: AbLikesItem) => item.pid === productId)
    },
    [likedProducts]
  )

  const addProductToLikes = useCallback(
    (productId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productLiked: boolean = !!likedProducts.find((item: AbLikesItem) => item.pid === productId)

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

  const removeProductFromLikes = useCallback(
    (productId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productLiked: boolean = !!likedProducts.find((item: AbLikesItem) => item.pid === productId)

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

  return {
    likedProducts,
    addProductToLikes,
    removeProductFromLikes,
    verifyProductLikes
  }
}

export { useAbProductLikes }

export default useAbProductLikes