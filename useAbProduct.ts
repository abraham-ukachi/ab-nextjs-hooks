'use client'

import { useProductLabels } from './useAbProductLabels'
import { useProductRequest } from './useAbProductRequest'
import type { ProductLabelsResult } from './useAbProductLabels'
import type { UseProductRequestResponse, UseProductRequestParams } from './useAbProductRequest'

export interface UseProductParamsInterface {
  defaultProductKeys?: Array<string>
  defaultProductRequestParams?: UseProductRequestParams
}

export type UseProductParams = UseProductParamsInterface

export type UseProductResult = ProductLabelsResult & UseProductRequestResponse

const useProduct = (
  defaultProductKeys: Array<string> | null = null,
  defaultProductRequestParams: UseProductRequestParams | null = null
): UseProductResult => {
  return {
    ...useProductLabels(defaultProductKeys ?? undefined),
    ...useProductRequest(defaultProductRequestParams ?? {})
  }
}

export { useProduct }

export default useProduct