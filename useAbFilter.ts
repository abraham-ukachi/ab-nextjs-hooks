'use client'

import { useFilterLabels } from './useAbFilterLabels'
import { useFilterRequest } from './useAbFilterRequest'
import type { AbFilterLabelsResult } from './useAbFilterLabels'
import type { UseFilterRequestResponse, UseFilterRequestParams } from './useAbFilterRequest'

export type UseFilterResult = AbFilterLabelsResult & UseFilterRequestResponse

const useFilter = (
  defaultFilterKeys: Array<string> | null = null,
  defaultFilterRequestParams: UseFilterRequestParams | null = null
): UseFilterResult => {
  return {
    ...useFilterLabels(defaultFilterKeys ?? undefined),
    ...useFilterRequest(defaultFilterRequestParams ?? {})
  }
}

export { useFilter }

export default useFilter