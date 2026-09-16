'use client'

import { useMemo } from 'react'
import { humanizeKey } from './helpers/humanizeKeys'
import { useBrandLabels } from './useAbBrandLabels'
import { useCollectionLabels } from './useAbCollectionLabels'
import { usePriceLabels } from './useAbPriceLabels'
import { useColorLabels } from './useAbColorLabels'
import { useShapeLabels } from './useAbShapeLabels'
import { useGenderLabels } from './useAbGenderLabels'
import { useMaterialLabels } from './useAbMaterialLabels'
import { useLensLabels } from './useAbLensLabels'
import { useBridgeLabels } from './useAbBridgeLabels'
import { useBranchLabels } from './useAbBranchLabels'
import type { BrandLabels } from './useAbBrandLabels'
import type { CollectionLabels } from './useAbCollectionLabels'
import type { PriceLabels } from './useAbPriceLabels'
import type { ColorLabels } from './useAbColorLabels'
import type { ShapeLabels } from './useAbShapeLabels'
import type { GenderLabels } from './useAbGenderLabels'
import type { MaterialLabels } from './useAbMaterialLabels'
import type { LensLabels } from './useAbLensLabels'
import type { BridgeLabels } from './useAbBridgeLabels'
import type { BranchLabels } from './useAbBranchLabels'

export interface AbFilterOptionLabels {
  brand: BrandLabels
  collection: CollectionLabels
  price: PriceLabels
  colors: ColorLabels
  shapes: ShapeLabels
  gender: GenderLabels
  materials: MaterialLabels
  lensSizes: LensLabels
  bridgeSizes: BridgeLabels
  branchSizes: BranchLabels
}

export interface AbFilterLabels extends Partial<Record<string, string | AbFilterOptionLabels>> {
  options?: AbFilterOptionLabels
}

export interface AbFilterLabelsResult {
  filterLabels: AbFilterLabels
  filterKeys: Array<string>
  getFilterLabel: (key: string, labels?: AbFilterLabels) => string
  getFilterOptionLabel: (filter: string, option: string, labels?: AbFilterLabels) => string
  getBrandLabel: (key: string, labels?: BrandLabels) => string
  getCollectionLabel: (key: string, labels?: CollectionLabels) => string
  getPriceLabel: (key: string, labels?: PriceLabels) => string
  getColorLabel: (key: string, labels?: ColorLabels) => string
  getShapeLabel: (key: string, labels?: ShapeLabels) => string
  getGenderLabel: (key: string, labels?: GenderLabels) => string
  getMaterialLabel: (key: string, labels?: MaterialLabels) => string
  getLensLabel: (key: string, labels?: LensLabels) => string
  getBridgeLabel: (key: string, labels?: BridgeLabels) => string
  getBranchLabel: (key: string, labels?: BranchLabels) => string
}

export const DEFAULT_FILTER_KEYS: Array<string> = [
  'brand',
  'collection',
  'price',
  'colors',
  'shapes',
  'gender',
  'materials',
  'lensSize',
  'bridgeSize',
  'branchSize'
]

const useFilterLabels = (defaultFilterKeys: Array<string> = DEFAULT_FILTER_KEYS): AbFilterLabelsResult => {
  const { brandLabels, getBrandLabel } = useBrandLabels()
  const { collectionLabels, getCollectionLabel } = useCollectionLabels()
  const { priceLabels, getPriceLabel } = usePriceLabels()
  const { colorLabels, getColorLabel } = useColorLabels()
  const { shapeLabels, getShapeLabel } = useShapeLabels()
  const { genderLabels, getGenderLabel } = useGenderLabels()
  const { materialLabels, getMaterialLabel } = useMaterialLabels()
  const { lensLabels, getLensLabel } = useLensLabels()
  const { bridgeLabels, getBridgeLabel } = useBridgeLabels()
  const { branchLabels, getBranchLabel } = useBranchLabels()

  return useMemo(() => {
    const filterKeys: Array<string> = [...defaultFilterKeys]
    const filterLabels: AbFilterLabels = {}

    filterKeys.forEach((key: string) => {
      filterLabels[key] = humanizeKey(key)
    })

    const optionLabels: AbFilterOptionLabels = {
      brand: brandLabels,
      collection: collectionLabels,
      price: priceLabels,
      colors: colorLabels,
      shapes: shapeLabels,
      gender: genderLabels,
      materials: materialLabels,
      lensSizes: lensLabels,
      bridgeSizes: bridgeLabels,
      branchSizes: branchLabels
    }

    filterLabels.options = optionLabels

    const getFilterLabel = (key: string, labels: AbFilterLabels = filterLabels): string => labels[key] as string

    const getFilterOptionLabel = (filter: string, option: string, labels?: AbFilterLabels): string => {
      const filterOptionLabel: string = (labels?.['options']?.[filter]?.[option] as string) ?? option

      return filterOptionLabel
    }

    return {
      filterLabels,
      filterKeys,
      getFilterLabel,
      getFilterOptionLabel,
      getBrandLabel,
      getCollectionLabel,
      getPriceLabel,
      getColorLabel,
      getShapeLabel,
      getGenderLabel,
      getMaterialLabel,
      getLensLabel,
      getBridgeLabel,
      getBranchLabel
    }
  }, [
    defaultFilterKeys,
    brandLabels,
    collectionLabels,
    priceLabels,
    colorLabels,
    shapeLabels,
    genderLabels,
    materialLabels,
    lensLabels,
    bridgeLabels,
    branchLabels,
    getBrandLabel,
    getCollectionLabel,
    getPriceLabel,
    getColorLabel,
    getShapeLabel,
    getGenderLabel,
    getMaterialLabel,
    getLensLabel,
    getBridgeLabel,
    getBranchLabel
  ])
}

export { useFilterLabels }

export default useFilterLabels