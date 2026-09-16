'use client'

import { useAbRequest } from './helpers/useAbRequest'
import type { AbRequestResponse } from './helpers/useAbRequest'

export interface FaqPagination {
  withCount?: boolean
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}

export interface FaqParams {
  sort?: 'asc' | 'desc'
  pagination?: FaqPagination
  fields?: string
  filters?: object
  locale?: string
}

export interface FaqMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface FaqResponseError {
  status: number
  name: string
  message: string
  details: object
}

export interface FaqData {
  id: number
  question: string
  answer: string
  locale?: string
}

export type FaqResponse = AbRequestResponse<Array<FaqData>>

export interface UseFaqRequestParams {
  apiUrl?: string
  strings?: Record<string, string>
  delayMs?: number
}

export interface UseFaqRequestResponse {
  isAllFaqsFetching: boolean
  fetchAllFaqs: (params?: FaqParams | null) => Promise<FaqResponse>
}

const useFaqRequest = (params: UseFaqRequestParams = {}): UseFaqRequestResponse => {
  const request = useAbRequest<Array<FaqData>>({
    entity: 'faq',
    apiUrl: params.apiUrl,
    delayMs: params.delayMs,
    strings: params.strings
  })

  return {
    isAllFaqsFetching: request.isAllFetching,
    fetchAllFaqs: request.fetchAll
  }
}

export { useFaqRequest }

export default useFaqRequest