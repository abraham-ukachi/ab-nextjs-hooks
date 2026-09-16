'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type GenderLabels = AbLabels

export interface GenderLabelsResult {
  genderLabels: GenderLabels
  genderKeys: Array<string>
  getGenderLabel: (key: string, labels?: GenderLabels) => string
}

export const DEFAULT_GENDER_KEYS: Array<string> = ['men', 'women', 'unisex', 'kids']

const useGenderLabels = (
  defaultGenderKeys: Array<string> = DEFAULT_GENDER_KEYS,
  labels?: GenderLabels
): GenderLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<GenderLabels>(defaultGenderKeys, labels)

    return {
      genderLabels: result.labels,
      genderKeys: result.keys,
      getGenderLabel: result.getLabel
    }
  }, [defaultGenderKeys, labels])
}

export { useGenderLabels }

export default useGenderLabels