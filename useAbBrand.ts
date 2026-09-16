'use client'

import { useBrandLabels } from './useAbBrandLabels'
import { useBrandRequest } from './useAbBrandRequest'
import { useBrandColors } from './useAbBrandColors'
import type { BrandLabelsResult } from './useAbBrandLabels'
import type { UseBrandRequestResponse, UseBrandRequestParams } from './useAbBrandRequest'
import type { AbBrandColorsResult } from './useAbBrandColors'

export type UseBrandResult = BrandLabelsResult & UseBrandRequestResponse & AbBrandColorsResult

const useBrand = (
  defaultBrandKeys: Array<string> | null = null,
  defaultBrandRequestParams: UseBrandRequestParams | null = null
): UseBrandResult => {
  return {
    ...useBrandLabels(defaultBrandKeys ?? undefined),
    ...useBrandRequest(defaultBrandRequestParams ?? {}),
    ...useBrandColors()
  }
}

export { useBrand }

export default useBrand