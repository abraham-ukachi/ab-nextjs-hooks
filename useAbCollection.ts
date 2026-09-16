'use client'

import { useCollectionLabels } from './useAbCollectionLabels'
import { useCollectionRequest } from './useAbCollectionRequest'
import type { CollectionLabelsResult } from './useAbCollectionLabels'
import type { UseCollectionRequestResponse, UseCollectionRequestParams } from './useAbCollectionRequest'

export type UseCollectionResult = CollectionLabelsResult & UseCollectionRequestResponse

const useCollection = (
  defaultCollectionKeys: Array<string> | null = null,
  defaultCollectionRequestParams: UseCollectionRequestParams | null = null
): UseCollectionResult => {
  return {
    ...useCollectionLabels(defaultCollectionKeys ?? undefined),
    ...useCollectionRequest(defaultCollectionRequestParams ?? {})
  }
}

export { useCollection }

export default useCollection