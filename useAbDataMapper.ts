'use client'

import { useMemo } from 'react'

export interface AbMetaPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface AbMeta {
  pagination?: AbMetaPagination
  [key: string]: unknown
}

export type AbMapper<T = Record<string, unknown>> = (item: Record<string, unknown>) => T

export interface AbDataMapperParams {
  resultsKey?: string
  metaKey?: string
  totalKey?: string
  mapper?: AbMapper
}

export interface AbDataMapperResult<T> {
  mapped: Array<T>
  meta: AbMeta | null
  total: number
}

export const stringifyParams = (params: Record<string, unknown> | null = null, prefix: string = '?'): string => {
  if (!params) return ''

  return `${prefix}${new URLSearchParams(params as Record<string, string>).toString()}`
}

export const getAbMetaPagination = (meta: AbMeta | null | undefined, fallbackPage: number = 1): AbMetaPagination => {
  const pagination = meta?.pagination

  return {
    page: pagination?.page ?? fallbackPage,
    pageSize: pagination?.pageSize ?? 0,
    pageCount: pagination?.pageCount ?? 0,
    total: pagination?.total ?? 0
  }
}

const mapAbData = <T = Record<string, unknown>>(
  data: unknown,
  params: AbDataMapperParams = {}
): AbDataMapperResult<T> => {
  const { resultsKey = 'results', metaKey = 'meta', totalKey = 'total', mapper } = params

  if (!data || typeof data !== 'object') {
    return { mapped: [], meta: null, total: 0 }
  }

  const rawRecord = data as Record<string, unknown>
  const rawResults = (rawRecord[resultsKey] ?? rawRecord.data ?? []) as Array<Record<string, unknown>>
  const meta = (rawRecord[metaKey] as AbMeta | undefined) ?? null
  const total = (rawRecord[totalKey] as number | undefined) ?? getAbMetaPagination(meta).total ?? rawResults.length

  const mapped = (mapper ? rawResults.map((item) => mapper(item)) : rawResults) as Array<T>

  return { mapped, meta, total }
}

const useAbDataMapper = <T = Record<string, unknown>>(
  data: unknown,
  params: AbDataMapperParams = {}
): AbDataMapperResult<T> => {
  return useMemo(() => mapAbData<T>(data, params), [data, params])
}

export { useAbDataMapper, mapAbData }

export default useAbDataMapper