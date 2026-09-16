'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type PriceLabels = AbLabels

export interface PriceLabelsResult {
  priceLabels: PriceLabels
  priceKeys: Array<string>
  getPriceLabel: (key: string, labels?: PriceLabels) => string
}

export const DEFAULT_PRICE_KEYS: Array<string> = [
  'extraCheap',
  'tooCheap',
  'veryCheap',
  'cheap',
  'affordable',
  'veryExpensive',
  'tooExpensive',
  'extraExpensive'
]

const usePriceLabels = (defaultPriceKeys: Array<string> = DEFAULT_PRICE_KEYS, labels?: PriceLabels): PriceLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<PriceLabels>(defaultPriceKeys, labels)

    return {
      priceLabels: result.labels,
      priceKeys: result.keys,
      getPriceLabel: result.getLabel
    }
  }, [defaultPriceKeys, labels])
}

export { usePriceLabels }

export default usePriceLabels