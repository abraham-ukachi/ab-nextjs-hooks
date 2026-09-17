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
* @name: Product Default Quantities - AB Hook
* @file: useAbProductDefaultQuantities.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Update the default quantity of a product
*    -|> import useAbProductDefaultQuantities from './useAbProductDefaultQuantities'
*    -|>
*    -|> const { updateDefaultProductQuantity, defaultQuantities } = useAbProductDefaultQuantities()
*    -|>
*    -|> // console.log(await updateDefaultProductQuantity(12, 3)) // ==> true
*    -|> // console.log(defaultQuantities) // ==> [{ pid: 12, qty: 3 }]
*    -|>
*
*   2+|> // Read the current default quantity
*    -|> const { getDefaultProductQuantity } = useAbProductDefaultQuantities()
*    -|>
*    -|> // console.log(getDefaultProductQuantity(12)) // ==> 3
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




// ===== PRODUCT DEFAULT QUANTITIES - TYPES & CONSTANTS ===== //


// create a default quantity item type as `AbDefaultQuantityItem`
// note: a single row per product = its pre-selected qty whenever it's added
export interface AbDefaultQuantityItem {
  pid: number
  qty: number
}


// create an array of default quantity items as `AbDefaultQuantities`
export type AbDefaultQuantities = Array<AbDefaultQuantityItem>


// create a product default quantities result interface as `AbProductDefaultQuantitiesResultInterface`
export interface AbProductDefaultQuantitiesResult {
  defaultQuantities: AbDefaultQuantities
  updateDefaultProductQuantity: (productId: number, productQuantity: number) => Promise<boolean>
  getDefaultProductQuantity: (productId: number, initialQuantity?: number) => number
}


// create a product default quantities params interface as `AbProductDefaultQuantitiesParams`
export interface AbProductDefaultQuantitiesParams {
  enableServerQuantities?: boolean
  storageKey?: string
}


// default localStorage key for the default quantities
// note: override it at runtime via `params.storageKey`
const AB_DEFAULT_QUANTITIES_STORAGE_KEY = 'ab_default_quantities'




// ---- PRIVATE HELPERS ----


// read + parse the default quantities from localStorage
// note: guarded for SSR (no `window`) and falls back to `[]` on bad/missing JSON
const getStoredDefaultQuantities = (storageKey: string): AbDefaultQuantities => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbDefaultQuantities) : []
  } catch {
    return []
  }
}




// ===== useAbProductDefaultQuantities - AB HOOK ===== //


/**
 * @name useAbProductDefaultQuantities
 * @description A product default quantities hook backed by localStorage that stores the
 * pre-selected quantity per product and persists it on every change
 *
 * @param { AbProductDefaultQuantitiesParams } params - Hook params; `storageKey` overrides `AB_DEFAULT_QUANTITIES_STORAGE_KEY`
 *
 * @returns { AbProductDefaultQuantitiesResult }
 */
const useAbProductDefaultQuantities = (params: AbProductDefaultQuantitiesParams = {}): AbProductDefaultQuantitiesResult => {

  // resolve the storage key (default = 'ab_default_quantities')
  const storageKey = params.storageKey ?? AB_DEFAULT_QUANTITIES_STORAGE_KEY

  // hydrate the quantities once from localStorage on mount (lazy initial state)
  const [defaultQuantities, setDefaultQuantities] = useState<AbDefaultQuantities>(() =>
    getStoredDefaultQuantities(storageKey)
  )


  // persist the quantities to localStorage whenever they (or the key) change
  // note: skips SSR since there's no `window` on the server
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(storageKey, JSON.stringify(defaultQuantities))
  }, [storageKey, defaultQuantities])


  // upsert the default quantity of a product
  // note: updates the existing row if found, otherwise appends a brand-new one
  const updateDefaultProductQuantity = useCallback(
    (productId: number, productQuantity: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const productFound: boolean = !!defaultQuantities.find((item: AbDefaultQuantityItem) => item.pid === productId)

        setDefaultQuantities((prev: AbDefaultQuantities) => {
          // product already has a default qty => update its `qty`
          if (productFound) {
            return prev.map((item: AbDefaultQuantityItem) =>
              item.pid === productId ? { ...item, qty: productQuantity } : item
            )
          }

          // otherwise create a fresh `{ pid, qty }` entry
          return [...prev, { pid: productId, qty: productQuantity }]
        })

        resolve(true)
      })
    },
    [defaultQuantities]
  )


  // read the default quantity of a product; falls back to `initialQuantity` (default: 1)
  // note: memoized so lookups don't re-create the callback unless the list changes
  const getDefaultProductQuantity = useCallback(
    (productId: number, initialQuantity: number = 1): number => {
      const currentDefaultQuantity: number =
        defaultQuantities.find((item: AbDefaultQuantityItem) => item.pid === productId)?.qty ?? initialQuantity

      return currentDefaultQuantity
    },
    [defaultQuantities]
  )


  // return `defaultQuantities` + all quantities helpers
  return {
    defaultQuantities,
    updateDefaultProductQuantity,
    getDefaultProductQuantity
  }
}


// export `useAbProductDefaultQuantities` hook as named export
export { useAbProductDefaultQuantities }


// export `useAbProductDefaultQuantities` hook as default
export default useAbProductDefaultQuantities