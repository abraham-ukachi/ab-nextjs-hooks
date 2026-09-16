'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type LensLabels = AbLabels

export interface LensLabelsResult {
  lensLabels: LensLabels
  lensKeys: Array<string>
  getLensLabel: (key: string, labels?: LensLabels) => string
}

export const DEFAULT_LENS_KEYS: Array<string> = [
  'clear',
  'blueLightBlocking',
  'photochromic',
  'polarized',
  'mirrored',
  'gradient',
  'tinted',
  'antiReflective',
  'antiScratch',
  'antiFog',
  'uvProtection',
  'waterRepellent',
  'oilRepellent',
  'antiGlare',
  'antiSmudge',
  'antiOil',
  'antiShock',
  'antiBacterial'
]

const useLensLabels = (defaultLensKeys: Array<string> = DEFAULT_LENS_KEYS, labels?: LensLabels): LensLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<LensLabels>(defaultLensKeys, labels)

    return {
      lensLabels: result.labels,
      lensKeys: result.keys,
      getLensLabel: result.getLabel
    }
  }, [defaultLensKeys, labels])
}

export { useLensLabels }

export default useLensLabels