'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type ShapeLabels = AbLabels

export interface ShapeLabelsResult {
  shapeLabels: ShapeLabels
  shapeKeys: Array<string>
  getShapeLabel: (key: string, labels?: ShapeLabels) => string
}

export const DEFAULT_SHAPE_KEYS: Array<string> = [
  'butterfly',
  'catEye',
  'oval',
  'rectangle',
  'round',
  'square',
  'wayfarer',
  'hexagonal',
  'aviator',
  'browline',
  'geometric',
  'rimless',
  'semiRimless',
  'roundRectangle',
  'roundSquare',
  'shield'
]

const useShapeLabels = (defaultShapeKeys: Array<string> = DEFAULT_SHAPE_KEYS, labels?: ShapeLabels): ShapeLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<ShapeLabels>(defaultShapeKeys, labels)

    return {
      shapeLabels: result.labels,
      shapeKeys: result.keys,
      getShapeLabel: result.getLabel
    }
  }, [defaultShapeKeys, labels])
}

export { useShapeLabels }

export default useShapeLabels