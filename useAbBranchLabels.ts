'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type BranchLabels = AbLabels

export interface BranchLabelsResult {
  branchLabels: BranchLabels
  branchKeys: Array<string>
  getBranchLabel: (key: string, labels?: BranchLabels) => string
}

export const DEFAULT_BRANCH_KEYS: Array<string> = [
  'flexible',
  'adjustable',
  'springHinge',
  'clipOn',
  'magnetic',
  'folding',
  'removable',
  'detachable',
  'interchangeable',
  'convertible',
  'reversible',
  'retractable',
  'rotating',
  'swappable',
  'swiveling',
  'foldable',
  'bendable',
  'twistable'
]

const useBranchLabels = (
  defaultBranchKeys: Array<string> = DEFAULT_BRANCH_KEYS,
  labels?: BranchLabels
): BranchLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<BranchLabels>(defaultBranchKeys, labels)

    return {
      branchLabels: result.labels,
      branchKeys: result.keys,
      getBranchLabel: result.getLabel
    }
  }, [defaultBranchKeys, labels])
}

export { useBranchLabels }

export default useBranchLabels