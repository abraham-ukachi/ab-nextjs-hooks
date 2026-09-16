'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type MaterialLabels = AbLabels

export interface MaterialLabelsResult {
  materialLabels: MaterialLabels
  materialKeys: Array<string>
  getMaterialLabel: (key: string, labels?: MaterialLabels) => string
}

export const DEFAULT_MATERIAL_KEYS: Array<string> = [
  'acetate',
  'metal',
  'titanium',
  'wood',
  'plastic',
  'rubber',
  'stainlessSteel',
  'aluminium',
  'carbonFiber',
  'nylon',
  'acetateMetal',
  'acetateTitanium',
  'acetateWood',
  'acetatePlastic',
  'acetateRubber',
  'acetateStainlessSteel',
  'acetateAluminium',
  'acetateCarbonFiber',
  'acetateNylon',
  'metalTitanium',
  'metalWood',
  'metalPlastic',
  'metalRubber',
  'metalStainlessSteel',
  'metalAluminium',
  'metalCarbonFiber',
  'metalNylon',
  'titaniumWood',
  'titaniumPlastic',
  'titaniumRubber',
  'titaniumStainlessSteel',
  'titaniumAluminium',
  'titaniumCarbonFiber',
  'titaniumNylon',
  'woodPlastic',
  'woodRubber',
  'woodStainlessSteel',
  'woodAluminium',
  'woodCarbonFiber',
  'woodNylon',
  'plasticRubber',
  'plasticStainlessSteel'
]

const useMaterialLabels = (
  defaultMaterialKeys: Array<string> = DEFAULT_MATERIAL_KEYS,
  labels?: MaterialLabels
): MaterialLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<MaterialLabels>(defaultMaterialKeys, labels)

    return {
      materialLabels: result.labels,
      materialKeys: result.keys,
      getMaterialLabel: result.getLabel
    }
  }, [defaultMaterialKeys, labels])
}

export { useMaterialLabels }

export default useMaterialLabels