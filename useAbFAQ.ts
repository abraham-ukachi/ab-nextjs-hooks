'use client'

import { useFaqRequest } from './useAbFaqRequest'
import type { UseFaqRequestResponse, UseFaqRequestParams } from './useAbFaqRequest'

export type UseFaqResult = UseFaqRequestResponse

const useFaq = (defaultFaqRequestParams: UseFaqRequestParams | null = null): UseFaqResult => {
  return {
    ...useFaqRequest(defaultFaqRequestParams ?? {})
  }
}

export { useFaq }

export default useFaq