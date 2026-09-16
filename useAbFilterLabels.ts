/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-hooks
* @name: Labels - AB Filter Hook
* @file: useAbFilterLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use filter labels hook
*    -|> import useFilterLabels from './useAbFilterLabels'
*    -|>
*    -|> const { filterLabels } = useFilterLabels()
*    -|>
*    -|> // console.log(filterLabels) // ==> { "brand": "Brand", "options": { "brand": {...}, ... } }
*    -|>
*
*   2+|> // Get a filter's option label
*    -|> const { getFilterOptionLabel } = useFilterLabels()
*    -|>
*    -|> // console.log(getFilterOptionLabel('shapes', 'catEye')) // ==> "Cat Eye"
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// REACT types
// REACT hooks
import { useMemo } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB hooks
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
// AB types
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
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== FILTER LABELS - TYPES & CONSTANTS ===== //


// create an `AbFilterOptionLabels` interface; this is the `options` sub-map that
// groups every sub-hook's labels by filter name, e.g. `options.shapes['catEye']`
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


// create an `AbFilterLabels` interface that carries humanized top-level filter
// keys (ex: 'colors' => 'Colors') plus the nested `options` sub-map above
export interface AbFilterLabels extends Partial<Record<string, string | AbFilterOptionLabels>> {
  options?: AbFilterOptionLabels
}


// create a filter labels result interface; exposes the filter labels/keys, the
// top-level getter, the `options` getter & every delegated sub-hook getter
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


// default filter keys
// TODO: add more filter keys (e.g. 'brandName', 'frameSize')
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




// ===== useFilterLabels - AB HOOK ===== //


/**
 * @name useFilterLabels
 * @description A composite filter labels hook that builds a map of filter keys AND
 *              an `options` sub-map pulling labels from every sub-label hook
 *
 * @param { Array<string> } defaultFilterKeys - The default filter keys to use
 *
 * @returns { AbFilterLabelsResult }
 */
const useFilterLabels = (defaultFilterKeys: Array<string> = DEFAULT_FILTER_KEYS): AbFilterLabelsResult => {

  // grab each sub-hook's labels & getter; these are delegated to the consumer
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


  // build the filter labels via memoization, only when the keys or any sub-label changes
  return useMemo(() => {

    // clone the default filter keys into `filterKeys` (mutating a prop is a no-no)
    const filterKeys: Array<string> = [...defaultFilterKeys]

    // create the empty `filterLabels` map that'll hold top-level keys + `options`
    const filterLabels: AbFilterLabels = {}

    // loop through each filter key & humanize it; ex: 'colors' => 'Colors'
    filterKeys.forEach((key: string) => {
      filterLabels[key] = humanizeKey(key)
    })

    // build the `options` sub-map, grouping every sub-hook's labels by filter name
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

    // attach the `options` sub-map to the main `filterLabels`
    filterLabels.options = optionLabels

    // create the top-level filter label getter; falls back to whatever is stored per filter key
    const getFilterLabel = (key: string, labels: AbFilterLabels = filterLabels): string => labels[key] as string

    // create the nested getter that resolves a single option inside a filter's `options` map;
    // note: falls back to the raw `option` key when nothing is found
    const getFilterOptionLabel = (filter: string, option: string, labels?: AbFilterLabels): string => {
      const filterOptionLabel: string = (labels?.['options']?.[filter as keyof AbFilterOptionLabels]?.[option] as string) ?? option

      // return the resolved option label (or the raw key fallback)
      return filterOptionLabel
    }

    // return `filterLabels`, `filterKeys`, both getters & every delegated sub-hook getter
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


// export `useFilterLabels` hook as named export
export { useFilterLabels }


// export `useFilterLabels` hook as default
export default useFilterLabels