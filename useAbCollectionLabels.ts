'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type CollectionLabels = AbLabels

export interface CollectionLabelsResult {
  collectionLabels: CollectionLabels
  collectionKeys: Array<string>
  getCollectionLabel: (key: string, labels?: CollectionLabels) => string
}

export const DEFAULT_COLLECTION_KEYS: Array<string> = [
  'nuance',
  'charisme',
  'caractere',
  'experience',
  'cosmopolite',
  'lesyeuxdoux',
  'lesyeuxdouxsolaires',
  'lesyeuxdouxadolescents',
  'titane',
  'acetate',
  'essentials',
  'trends',
  'classics',
  'sunglasses',
  'premium',
  'fashion',
  'vintage',
  'athletic',
  'kids',
  'luxury',
  'modern',
  'clearance',
  'custom',
  'safety',
  'accessories'
]

const useCollectionLabels = (
  defaultCollectionKeys: Array<string> = DEFAULT_COLLECTION_KEYS,
  labels?: CollectionLabels
): CollectionLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<CollectionLabels>(defaultCollectionKeys, labels)

    return {
      collectionLabels: result.labels,
      collectionKeys: result.keys,
      getCollectionLabel: result.getLabel
    }
  }, [defaultCollectionKeys, labels])
}

export { useCollectionLabels }

export default useCollectionLabels