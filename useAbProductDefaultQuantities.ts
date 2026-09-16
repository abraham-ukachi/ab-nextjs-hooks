'use client'

import { useCallback, useEffect, useState } from 'react'

export interface AbDefaultQuantityItem {
  pid: number
  qty: number
}

export type AbDefaultQuantities = Array<AbDefaultQuantityItem>

export interface AbProductDefaultQuantitiesResult {
  defaultQuantities: AbDefaultQuantities
  updateDefaultProductQuantity: (productId: number, productQuantity: number) => Promise<boolean>
  getDefaultProductQuantity: (productId: number, initialQuantity?: number) => number
}

export interface AbProductDefaultQuantitiesParams {
  enableServerQuantities?: boolean
  storageKey?: string
}

const AB_DEFAULT_QUANTITIES_STORAGE_KEY = 'ab_default_quantities'

const getStoredDefaultQuantities = (storageKey: string): AbDefaultQuantities => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbDefaultQuantities) : []
  } catch {
    return []
  }
}

const useAbProductDefaultQuantities = (params: AbProductDefaultQuantitiesParams = {}): AbProductDefaultQuantitiesResult => {
  const storageKey = params.storageKey ?? AB_DEFAULT_QUANTITIES_STORAGE_KEY
  const [defaultQuantities, setDefaultQuantities] = useState<AbDefaultQuantities>(() =>
    getStoredDefaultQuantities(storageKey)
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(defaultQuantities))
  }, [storageKey, defaultQuantities])

  const updateDefaultProductQuantity = useCallback(
    (productId: number, productQuantity: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productFound: boolean = !!defaultQuantities.find((item: AbDefaultQuantityItem) => item.pid === productId)

        setDefaultQuantities((prev: AbDefaultQuantities) => {
          if (productFound) {
            return prev.map((item: AbDefaultQuantityItem) =>
              item.pid === productId ? { ...item, qty: productQuantity } : item
            )
          }

          return [...prev, { pid: productId, qty: productQuantity }]
        })

        resolve(true)
      })
    },
    [defaultQuantities]
  )

  const getDefaultProductQuantity = useCallback(
    (productId: number, initialQuantity: number = 1): number => {
      const currentDefaultQuantity: number =
        defaultQuantities.find((item: AbDefaultQuantityItem) => item.pid === productId)?.qty ?? initialQuantity

      return currentDefaultQuantity
    },
    [defaultQuantities]
  )

  return {
    defaultQuantities,
    updateDefaultProductQuantity,
    getDefaultProductQuantity
  }
}

export { useAbProductDefaultQuantities }

export default useAbProductDefaultQuantities