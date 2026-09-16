'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type BrandLabels = AbLabels

export interface BrandLabelsResult {
  brandLabels: BrandLabels
  brandKeys: Array<string>
  getBrandLabel: (key: string, labels?: BrandLabels) => string
}

export const DEFAULT_BRAND_KEYS: Array<string> = [
  'lyd',
  'lydName',
  'lydDescription',
  'cg',
  'cgName',
  'cgDescription',
  'hexaa',
  'hexaaName',
  'hexaaDescription'
]

const useBrandLabels = (defaultBrandKeys: Array<string> = DEFAULT_BRAND_KEYS, labels?: BrandLabels): BrandLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<BrandLabels>(defaultBrandKeys, labels)

    return {
      brandLabels: result.labels,
      brandKeys: result.keys,
      getBrandLabel: result.getLabel
    }
  }, [defaultBrandKeys, labels])
}

export { useBrandLabels }

export default useBrandLabels