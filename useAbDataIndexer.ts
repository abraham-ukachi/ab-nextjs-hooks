'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface AbObjectStoreIndexConfig {
  name: string
  keyPath: string | Array<string>
  unique?: boolean
}

export interface AbObjectStoreConfig {
  name: string
  keyPath?: string | null
  autoIncrement?: boolean
  indexes?: Array<AbObjectStoreIndexConfig>
}

export interface AbDataIndexerParams {
  name: string
  version?: number
  stores?: Array<AbObjectStoreConfig>
}

export interface AbDataIndexerResult {
  db: IDBDatabase | null
  isOpen: boolean
  isIndexing: boolean
  error: Error | null
  open: () => void
  close: () => void
  deleteDatabase: () => Promise<void>
  clearStore: (storeName: string) => Promise<void>
  count: (storeName: string) => Promise<number>
  add: (storeName: string, value: Record<string, unknown>) => Promise<IDBValidKey>
  put: (storeName: string, value: Record<string, unknown>) => Promise<IDBValidKey>
  update: (storeName: string, value: Record<string, unknown>) => Promise<IDBValidKey>
  remove: (storeName: string, key: IDBValidKey) => Promise<void>
  get: <T>(storeName: string, key: IDBValidKey) => Promise<T | undefined>
  getAll: <T>(storeName: string, count?: number) => Promise<Array<T>>
  getByIndex: <T>(storeName: string, indexName: string, key: IDBValidKey) => Promise<T | undefined>
}

const storeExists = (db: IDBDatabase, storeName: string): boolean => db.objectStoreNames.contains(storeName)

const useAbDataIndexer = (params: AbDataIndexerParams): AbDataIndexerResult => {
  const { name, version = 1, stores = [] } = params

  const openDbRef = useRef<IDBDatabase | null>(null)
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const open = useCallback(() => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return

    setIsIndexing(true)
    setError(null)

    const request = indexedDB.open(name, version)

    request.onupgradeneeded = () => {
      const database = request.result

      stores.forEach((storeConfig: AbObjectStoreConfig) => {
        if (storeExists(database, storeConfig.name)) return

        const store = database.createObjectStore(storeConfig.name, {
          ...(storeConfig.keyPath ? { keyPath: storeConfig.keyPath } : {}),
          autoIncrement: storeConfig.autoIncrement ?? true
        })

        storeConfig.indexes?.forEach((indexConfig: AbObjectStoreIndexConfig) => {
          if (store.indexNames.contains(indexConfig.name)) return

          store.createIndex(indexConfig.name, indexConfig.keyPath, { unique: indexConfig.unique ?? false })
        })
      })
    }

    request.onsuccess = () => {
      openDbRef.current = request.result
      setDb(request.result)
      setIsOpen(true)
      setIsIndexing(false)
    }

    request.onerror = () => {
      setError(request.error ?? new Error('Failed to open indexedDB database'))
      setIsIndexing(false)
    }

    request.onblocked = () => {
      setError(new Error('indexedDB open request was blocked'))
      setIsIndexing(false)
    }
  }, [name, version, stores])

  const close = useCallback(() => {
    openDbRef.current?.close()
    openDbRef.current = null
    setDb(null)
    setIsOpen(false)
  }, [])

  const deleteDatabase = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
        resolve()

        return
      }

      const rawDbName = db?.name ?? name
      const request = indexedDB.deleteDatabase(rawDbName)

      request.onsuccess = () => {
        openDbRef.current = null
        setDb(null)
        setIsOpen(false)
        resolve()
      }

      request.onerror = () => reject(request.error ?? new Error('Failed to delete indexedDB database'))
    })
  }, [db, name])

  const requestOn = useCallback(
    (storeName: string, mode: IDBTransactionMode): IDBObjectStore | null => {
      if (!db || !storeExists(db, storeName)) return null

      const transaction = db.transaction(storeName, mode)

      return transaction.objectStore(storeName)
    },
    [db]
  )

  const clearStore = useCallback(
    (storeName: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readwrite')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const clearRequest = store.clear()

        clearRequest.onsuccess = () => resolve()
        clearRequest.onerror = () => reject(clearRequest.error ?? new Error('Failed to clear store'))
      })
    },
    [requestOn]
  )

  const count = useCallback(
    (storeName: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readonly')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const countRequest = store.count()

        countRequest.onsuccess = () => resolve(countRequest.result)
        countRequest.onerror = () => reject(countRequest.error ?? new Error('Failed to count store'))
      })
    },
    [requestOn]
  )

  const add = useCallback(
    <T extends IDBValidKey | Record<string, unknown>>(storeName: string, value: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readwrite')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const addRequest = store.add(value as never)

        addRequest.onsuccess = () => resolve(addRequest.result)
        addRequest.onerror = () => reject(addRequest.error ?? new Error('Failed to add record'))
      })
    },
    [requestOn]
  )

  const put = useCallback(
    <T extends IDBValidKey | Record<string, unknown>>(storeName: string, value: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readwrite')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const putRequest = store.put(value as never)

        putRequest.onsuccess = () => resolve(putRequest.result)
        putRequest.onerror = () => reject(putRequest.error ?? new Error('Failed to put record'))
      })
    },
    [requestOn]
  )

  const update = useCallback(
    (storeName: string, value: Record<string, unknown>): Promise<IDBValidKey> => {
      return new Promise(async (resolve, reject) => {
        try {
          const store = requestOn(storeName, 'readwrite')

          if (!store) {
            reject(new Error(`Store '${storeName}' does not exist`))

            return
          }

          const key = store.keyPath ? (value[store.keyPath as string] as IDBValidKey) : undefined

          if (key === undefined) {
            reject(new Error(`Store '${storeName}' requires a keyPath value to update`))

            return
          }

          const existingPromise = await new Promise<unknown>((resolveGet, rejectGet) => {
            const getRequest = store.get(key)

            getRequest.onsuccess = () => resolveGet(getRequest.result)
            getRequest.onerror = () => rejectGet(getRequest.error ?? new Error('Failed to get record'))
          })

          const existing = (existingPromise ?? {}) as Record<string, unknown>
          const updated = { ...existing, ...value }
          const putResult = await put(storeName, updated)

          resolve(putResult)
        } catch (error) {
          reject(error)
        }
      })
    },
    [requestOn, put]
  )

  const remove = useCallback(
    (storeName: string, key: IDBValidKey): Promise<void> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readwrite')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const deleteRequest = store.delete(key)

        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject(deleteRequest.error ?? new Error('Failed to delete record'))
      })
    },
    [requestOn]
  )

  const get = useCallback(
    <T>(storeName: string, key: IDBValidKey): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readonly')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const getRequest = store.get(key)

        getRequest.onsuccess = () => resolve(getRequest.result as T)
        getRequest.onerror = () => reject(getRequest.error ?? new Error('Failed to get record'))
      })
    },
    [requestOn]
  )

  const getAll = useCallback(
    <T>(storeName: string, count?: number): Promise<Array<T>> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readonly')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const getAllRequest = count ? store.getAll(undefined, count) : store.getAll()

        getAllRequest.onsuccess = () => resolve(getAllRequest.result as Array<T>)
        getAllRequest.onerror = () => reject(getAllRequest.error ?? new Error('Failed to get all records'))
      })
    },
    [requestOn]
  )

  const getByIndex = useCallback(
    <T>(storeName: string, indexName: string, key: IDBValidKey): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        const store = requestOn(storeName, 'readonly')

        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        const index = store.index(indexName)
        const indexRequest = index.get(key)

        indexRequest.onsuccess = () => resolve(indexRequest.result as T)
        indexRequest.onerror = () => reject(indexRequest.error ?? new Error('Failed to get record by index'))
      })
    },
    [requestOn]
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return

    open()

    return () => {
      openDbRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    db,
    isOpen,
    isIndexing,
    error,
    open,
    close,
    deleteDatabase,
    clearStore,
    count,
    add,
    put,
    update,
    remove,
    get,
    getAll,
    getByIndex
  }
}

export { useAbDataIndexer }

export default useAbDataIndexer