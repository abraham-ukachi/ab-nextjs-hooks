'use client'

import { useCallback, useMemo, useState } from 'react'

export interface AbRequestError {
  status?: number
  name?: string
  message?: string
  details?: Record<string, unknown>
}

export interface AbRequestResponse<T = unknown> {
  data?: T
  meta?: Record<string, unknown>
  error?: AbRequestError | null
}

export interface AbRequestEndpoints {
  fetchAll?: string
  fetchOne?: string
  create?: string
  update?: string
  delete?: string
}

export interface AbRequestParams {
  apiUrl?: string
  entity?: string
  endpoints?: AbRequestEndpoints
  delayMs?: number
  labels?: Record<string, string>
  strings?: Record<string, string>
  stringify?: (params?: any | null) => string
}

export interface AbRequestHookResult<T = unknown> {
  isAllFetching: boolean
  isOneFetching: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  conflictError: AbRequestError
  fetchAll: (params?: any | null) => Promise<AbRequestResponse<T>>
  fetchOne: (id: number, params?: any | null) => Promise<AbRequestResponse<T>>
  create: (userToken: string, newData: Record<string, unknown>) => Promise<AbRequestResponse<T>>
  update: (id: number, updateData: Record<string, unknown>, userToken?: string) => Promise<AbRequestResponse<T>>
  remove: (id: number, userToken?: string) => Promise<AbRequestResponse<T>>
}

export const stringifyAbParams = (params: any | null = null): string => {
  if (!params) return ''

  return `?${new URLSearchParams(params as Record<string, string>).toString()}`
}

const stripLeadingSlash = (endpoint: string = ''): string => endpoint.replace(/^\//, '')

const requestJson = async (url: string, init: RequestInit): Promise<any> => {
  const response = await fetch(new Request(url, init))
  const responseData = await response.json().catch(() => null)

  if (response.ok || response.status === 200) {
    return responseData
  }

  throw { ...(responseData?.error ?? responseData) }
}

const useAbRequest = <T = Record<string, unknown>>(options: AbRequestParams = {}): AbRequestHookResult<T> => {
  const entity = options.entity ?? 'item'
  const apiUrl = options.apiUrl ?? ''
  const delayMs = options.delayMs ?? 0
  const stringify = options.stringify ?? stringifyAbParams

  const endpoints = useMemo(
    () =>
      options.endpoints ?? {
        fetchAll: `api/${entity}s`,
        fetchOne: `api/${entity}s`,
        create: `api/${entity}s`,
        update: `api/${entity}s`,
        delete: `api/${entity}s`
      },
    [options.endpoints, entity]
  )

  const [isAllFetching, setIsAllFetching] = useState(false)
  const [isOneFetching, setIsOneFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const requestUrls = useMemo(
    () => ({
      fetchAll: `${apiUrl}/${stripLeadingSlash(endpoints.fetchAll)}`,
      fetchOne: `${apiUrl}/${stripLeadingSlash(endpoints.fetchOne)}`,
      create: `${apiUrl}/${stripLeadingSlash(endpoints.create)}`,
      update: `${apiUrl}/${stripLeadingSlash(endpoints.update)}`,
      delete: `${apiUrl}/${stripLeadingSlash(endpoints.delete)}`
    }),
    [apiUrl, endpoints]
  )

  const conflictError = useMemo(
    (): AbRequestError => ({
      status: 409,
      name: options.strings?.conflict ?? 'Conflict',
      message: options.strings?.conflictError ?? 'Conflict error',
      details: {
        message: options.strings?.conflictMessage ?? 'Another request is being processed, please wait for it to finish'
      }
    }),
    [options.strings]
  )

  const fetchAll = useCallback(
    async (fetchParams: any = null): Promise<AbRequestResponse<T>> => {
      return new Promise(async (resolve, reject) => {
        if (isAllFetching) {
          reject({ ...conflictError, details: { message: `All ${entity}s are being fetched, please wait for it to finish` } })

          return
        }

        setIsAllFetching(true)

        try {
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          resolve(
            await requestJson(`${requestUrls.fetchAll}${stringify(fetchParams)}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
          )
        } catch (error) {
          reject(error)
        } finally {
          setIsAllFetching(false)
        }
      })
    },
    [isAllFetching, conflictError, entity, delayMs, stringify, requestUrls]
  )

  const fetchOne = useCallback(
    async (id: number, fetchParams: any = null): Promise<AbRequestResponse<T>> => {
      return new Promise(async (resolve, reject) => {
        if (isOneFetching) {
          reject({ ...conflictError, details: { message: `One ${entity} is being fetched, please wait for it to finish` } })

          return
        }

        setIsOneFetching(true)

        try {
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          resolve(
            await requestJson(`${requestUrls.fetchOne}/${id}${stringify(fetchParams)}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
          )
        } catch (error) {
          reject(error)
        } finally {
          setIsOneFetching(false)
        }
      })
    },
    [isOneFetching, conflictError, entity, delayMs, stringify, requestUrls]
  )

  const create = useCallback(
    async (userToken: string, newData: Record<string, unknown>): Promise<AbRequestResponse<T>> => {
      return new Promise(async (resolve, reject) => {
        if (isCreating) {
          reject({ ...conflictError, details: { message: `A ${entity} is being created, please wait for it to finish` } })

          return
        }

        setIsCreating(true)

        try {
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          resolve(
            await requestJson(requestUrls.create, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${userToken}`
              },
              body: JSON.stringify(newData)
            })
          )
        } catch (error) {
          reject(error)
        } finally {
          setIsCreating(false)
        }
      })
    },
    [isCreating, conflictError, entity, delayMs, requestUrls]
  )

  const update = useCallback(
    async (id: number, updateData: Record<string, unknown>, userToken?: string): Promise<AbRequestResponse<T>> => {
      return new Promise(async (resolve, reject) => {
        if (isUpdating) {
          reject({ ...conflictError, details: { message: `This ${entity} is being updated, please wait for it to finish` } })

          return
        }

        setIsUpdating(true)

        try {
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          resolve(
            await requestJson(`${requestUrls.update}/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(userToken ? { Authorization: `Bearer ${userToken}` } : {})
              },
              body: JSON.stringify(updateData)
            })
          )
        } catch (error) {
          reject(error)
        } finally {
          setIsUpdating(false)
        }
      })
    },
    [isUpdating, conflictError, entity, delayMs, requestUrls]
  )

  const remove = useCallback(
    async (id: number, userToken?: string): Promise<AbRequestResponse<T>> => {
      return new Promise(async (resolve, reject) => {
        if (isDeleting) {
          reject({ ...conflictError, details: { message: `This ${entity} is being deleted, please wait for it to finish` } })

          return
        }

        setIsDeleting(true)

        try {
          if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

          resolve(
            await requestJson(`${requestUrls.delete}/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(userToken ? { Authorization: `Bearer ${userToken}` } : {})
              }
            })
          )
        } catch (error) {
          reject(error)
        } finally {
          setIsDeleting(false)
        }
      })
    },
    [isDeleting, conflictError, entity, delayMs, requestUrls]
  )

  return {
    isAllFetching,
    isOneFetching,
    isCreating,
    isUpdating,
    isDeleting,
    conflictError,
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
}

export { useAbRequest, requestJson }