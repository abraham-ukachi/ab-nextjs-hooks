'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type ProductLabels = AbLabels

export interface ProductLabelsResult {
  productLabels: ProductLabels
  productKeys: Array<string>
  getProductLabel: (key: string, labels?: ProductLabels) => string
}

export const DEFAULT_PRODUCT_KEYS: Array<string> = ['af099c4', 'af099c4_name', 'af099c4_caption', 'af099c4_description']

const useProductLabels = (
  defaultProductKeys: Array<string> = DEFAULT_PRODUCT_KEYS,
  labels?: ProductLabels
): ProductLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<ProductLabels>(defaultProductKeys, labels)

    return {
      productLabels: result.labels,
      productKeys: result.keys,
      getProductLabel: result.getLabel
    }
  }, [defaultProductKeys, labels])
}

export { useProductLabels }

export default useProductLabels