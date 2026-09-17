/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
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
* @name: Data Indexer - AB insertable native IndexedDB hook
* @file: useAbDataIndexer.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // open a db w/ a couple of stores & add a record to one of them
*    -|> import useAbDataIndexer from './useAbDataIndexer'
*    -|>
*    -|> const indexer = useAbDataIndexer({
*    -|>   name: 'myAppDb',
*    -|>   version: 1,
*    -|>   stores: [{ name: 'items', keyPath: 'id' }]
*    -|> })
*    -|>
*    -|> // await indexer.add('items', { id: 1, label: 'ab' })
*    -|> // const rows = await indexer.getByIndex('items', 'by-label', 'ab')
*    -|>
*
*   2+|> // wipe the whole database when done w/ it
*    -|> await indexer.deleteDatabase()
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
import { useCallback, useEffect, useRef, useState } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== DATA INDEXER - TYPES & CONSTANTS ===== //


// create the config type for an object store's index as `AbObjectStoreIndexConfig`
export interface AbObjectStoreIndexConfig {
  // the index's name (used when querying via `getByIndex`)
  name: string
  // the key (or array of keys) the index is built on
  keyPath: string | Array<string>
  // whether indexed values must be unique; `false` by default
  unique?: boolean
}


// create the config type for an object store as `AbObjectStoreConfig`
export interface AbObjectStoreConfig {
  // the store's name
  name: string
  // the primary key path; omitted/null = key-less store
  keyPath?: string | null
  // auto-generate keys; defaults to `true` when no keyPath is set
  autoIncrement?: boolean
  // optional indexes to create on the store (via the upgrade path)
  indexes?: Array<AbObjectStoreIndexConfig>
}


// create the hook's input params as `AbDataIndexerParams`
export interface AbDataIndexerParams {
  // the database name
  name: string
  // the database version; bump it to trigger an upgrade
  version?: number
  // object stores (w/ optional indexes) to create on upgrade
  stores?: Array<AbObjectStoreConfig>
}


// create the hook's full result as `AbDataIndexerResult`
export interface AbDataIndexerResult {
  // the raw `IDBDatabase` instance (`null` until opened, after close/delete)
  db: IDBDatabase | null
  // whether the db is currently open
  isOpen: boolean
  // whether an open/upgrade request is still in flight
  isIndexing: boolean
  // the last error (open failure, blocked request, ...), if any
  error: Error | null

  // note: `open`/`close`/`deleteDatabase` manage the db lifecycle;
  // the rest are CRUD/utility methods that act on a single store
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


// helper that checks whether a store exists in the given db
const storeExists = (db: IDBDatabase, storeName: string): boolean => db.objectStoreNames.contains(storeName)





// ===== USEABDATAINDEXER - AB HOOK ===== //


/**
 * @name useAbDataIndexer
 * @description A generic native-IndexedDB hook that opens (and upgrades) a
 *  database, then exposes lifecycle helpers + CRUD/utility methods for it
 *
 * @param { AbDataIndexerParams } params - The db name, version & store configs
 *
 * @returns { AbDataIndexerResult }
 */
const useAbDataIndexer = (params: AbDataIndexerParams): AbDataIndexerResult => {
  // destructure the params w/ sensible defaults (`version` = 1, `stores` = none)
  const { name, version = 1, stores = [] } = params

  // keep a ref to the raw db (outlives re-renders & disconnects from state)
  const openDbRef = useRef<IDBDatabase | null>(null)
  // the db instance, synced to state so components re-render on change
  const [db, setDb] = useState<IDBDatabase | null>(null)
  // whether the db is open (or was just opened)
  const [isOpen, setIsOpen] = useState(false)
  // whether an `open`/upgrade request is still in flight
  const [isIndexing, setIsIndexing] = useState(false)
  // the last error encountered, if any
  const [error, setError] = useState<Error | null>(null)


  /**
   * @name open
   * @description Opens the indexedDB database (`name` @ `version`). On a fresh
   *  db or a version bump, `onupgradeneeded` (re)creates the configured stores
   *  & indexes. NO-OP in non-browser (SSR) contexts.
   *
   * @returns { void }
   */
  const open = useCallback(() => {
    // SSR guard: indexedDB only exists in the browser
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return

    // mark us as indexing & clear any stale error before we begin
    setIsIndexing(true)
    setError(null)

    // fire the open request for `name` @ `version`
    const request = indexedDB.open(name, version)

    // --- upgrade path: create stores & indexes when the db is born/versioned up ---
    request.onupgradeneeded = () => {
      const database = request.result

      // loop over every configured store
      stores.forEach((storeConfig: AbObjectStoreConfig) => {
        // skip stores that already exist (don't clobber the schema)
        if (storeExists(database, storeConfig.name)) return

        // create the store w/ an optional keyPath & auto-incrementing keys
        const store = database.createObjectStore(storeConfig.name, {
          ...(storeConfig.keyPath ? { keyPath: storeConfig.keyPath } : {}),
          autoIncrement: storeConfig.autoIncrement ?? true
        })

        // build each index (skipping the ones already present)
        storeConfig.indexes?.forEach((indexConfig: AbObjectStoreIndexConfig) => {
          if (store.indexNames.contains(indexConfig.name)) return

          // note: `unique: false` is the default unless the config says otherwise
          store.createIndex(indexConfig.name, indexConfig.keyPath, { unique: indexConfig.unique ?? false })
        })
      })
    }

    // --- success: cache the db & flip the state flags ---
    request.onsuccess = () => {
      openDbRef.current = request.result
      setDb(request.result)
      setIsOpen(true)
      setIsIndexing(false)
    }

    // --- failure: surface the request error ---
    request.onerror = () => {
      setError(request.error ?? new Error('Failed to open indexedDB database'))
      setIsIndexing(false)
    }

    // --- blocked: another open connection is holding the old version ---
    request.onblocked = () => {
      setError(new Error('indexedDB open request was blocked'))
      setIsIndexing(false)
    }
  }, [name, version, stores])


  /**
   * @name close
   * @description Closes the currently-open db (if any) and resets the state.
   *
   * @returns { void }
   */
  const close = useCallback(() => {
    // close the underlying db connection
    openDbRef.current?.close()
    // drop the ref & reset the state to "closed"
    openDbRef.current = null
    setDb(null)
    setIsOpen(false)
  }, [])


  /**
   * @name deleteDatabase
   * @description Deletes the whole database (by its actual name, falling back
   *  to the configured `name`). Resolves once the delete request succeeds.
   *
   * @returns { Promise<void> }
   */
  const deleteDatabase = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // SSR guard: nothing to delete outside the browser
      if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
        // note: resolve silently on the server
        resolve()

        return
      }

      // prefer the actual db name (it may differ from the configured `name`)
      const rawDbName = db?.name ?? name
      // fire the delete request
      const request = indexedDB.deleteDatabase(rawDbName)

      // success: drop the ref & reset all state flags
      request.onsuccess = () => {
        openDbRef.current = null
        setDb(null)
        setIsOpen(false)
        resolve()
      }

      // failure: reject w/ the request error
      request.onerror = () => reject(request.error ?? new Error('Failed to delete indexedDB database'))
    })
  }, [db, name])


  // `requestOn` is an internal helper that grabs a store (or `null`) for a txn
  const requestOn = useCallback(
    (storeName: string, mode: IDBTransactionMode): IDBObjectStore | null => {
      // guard: no open db or unknown store => `null`
      if (!db || !storeExists(db, storeName)) return null

      // start a transaction on that store w/ the given mode
      const transaction = db.transaction(storeName, mode)

      // return the store object the transaction points to
      return transaction.objectStore(storeName)
    },
    [db]
  )


  /**
   * @name clearStore
   * @description Removes every record from a store.
   *
   * @param { string } storeName - The store's name
   *
   * @returns { Promise<void> }
   */
  const clearStore = useCallback(
    (storeName: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readwrite` store (or `null`)
        const store = requestOn(storeName, 'readwrite')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // clear the whole store
        const clearRequest = store.clear()

        // resolve/reject w/ the request outcome
        clearRequest.onsuccess = () => resolve()
        clearRequest.onerror = () => reject(clearRequest.error ?? new Error('Failed to clear store'))
      })
    },
    [requestOn]
  )


  /**
   * @name count
   * @description Counts the records in a store.
   *
   * @param { string } storeName - The store's name
   *
   * @returns { Promise<number> } - The number of records
   */
  const count = useCallback(
    (storeName: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readonly` store (or `null`)
        const store = requestOn(storeName, 'readonly')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // run the count request
        const countRequest = store.count()

        // resolve w/ the result (handles the `onsuccess`/`onerror` outcome)
        countRequest.onsuccess = () => resolve(countRequest.result)
        countRequest.onerror = () => reject(countRequest.error ?? new Error('Failed to count store'))
      })
    },
    [requestOn]
  )


  /**
   * @name add
   * @description Adds a brand-new record to a store. Fails (w/ a constraint
   *  error) if the primary key already exists.
   *
   * @param { string } storeName - The store's name
   * @param { T } value - The record to add
   *
   * @returns { Promise<IDBValidKey> } - The generated/used primary key
   */
  const add = useCallback(
    <T extends IDBValidKey | Record<string, unknown>>(storeName: string, value: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readwrite` store (or `null`)
        const store = requestOn(storeName, 'readwrite')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // add the record (throws on duplicate primary keys)
        const addRequest = store.add(value as never)

        // resolve w/ the new key / reject on failure
        addRequest.onsuccess = () => resolve(addRequest.result)
        addRequest.onerror = () => reject(addRequest.error ?? new Error('Failed to add record'))
      })
    },
    [requestOn]
  )


  /**
   * @name put
   * @description Inserts or overwrites a record by its primary key (upsert).
   *
   * @param { string } storeName - The store's name
   * @param { T } value - The record to put
   *
   * @returns { Promise<IDBValidKey> } - The record's primary key
   */
  const put = useCallback(
    <T extends IDBValidKey | Record<string, unknown>>(storeName: string, value: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readwrite` store (or `null`)
        const store = requestOn(storeName, 'readwrite')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // put the record (create or overwrite)
        const putRequest = store.put(value as never)

        // resolve w/ the key / reject on failure
        putRequest.onsuccess = () => resolve(putRequest.result)
        putRequest.onerror = () => reject(putRequest.error ?? new Error('Failed to put record'))
      })
    },
    [requestOn]
  )


  /**
   * @name update
   * @description Merges `value` into the existing record (read-merge-write):
   *  the current record is read via its keyPath, then put back after spreading.
   *
   * @param { string } storeName - The store's name
   * @param { Record<string, unknown> } value - The partial record to merge in
   *
   * @returns { Promise<IDBValidKey> } - The updated record's primary key
   */
  const update = useCallback(
    (storeName: string, value: Record<string, unknown>): Promise<IDBValidKey> => {
      return new Promise(async (resolve, reject) => {
        try {
          // ask our helper for a `readwrite` store (or `null`)
          const store = requestOn(storeName, 'readwrite')

          // reject early if the store doesn't exist
          if (!store) {
            reject(new Error(`Store '${storeName}' does not exist`))

            return
          }

          // pull the primary key out of the record via the store's keyPath
          const key = store.keyPath ? (value[store.keyPath as string] as IDBValidKey) : undefined

          // reject if there's no keyPath value to update on
          if (key === undefined) {
            reject(new Error(`Store '${storeName}' requires a keyPath value to update`))

            return
          }

          // read the existing record first (so we can merge into it)
          const existingPromise = await new Promise<unknown>((resolveGet, rejectGet) => {
            const getRequest = store.get(key)

            // resolve w/ the fetched record / reject on failure
            getRequest.onsuccess = () => resolveGet(getRequest.result)
            getRequest.onerror = () => rejectGet(getRequest.error ?? new Error('Failed to get record'))
          })

          // merge the new fields into the existing record (default to `{}`)
          const existing = (existingPromise ?? {}) as Record<string, unknown>
          const updated = { ...existing, ...value }
          // re-put the merged record & resolve w/ its key
          const putResult = await put(storeName, updated)

          resolve(putResult)
        } catch (error) {
          // forward any unexpected error
          reject(error)
        }
      })
    },
    [requestOn, put]
  )


  /**
   * @name remove
   * @description Deletes a single record from a store by its primary key.
   *
   * @param { string } storeName - The store's name
   * @param { IDBValidKey } key - The record's primary key
   *
   * @returns { Promise<void> }
   */
  const remove = useCallback(
    (storeName: string, key: IDBValidKey): Promise<void> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readwrite` store (or `null`)
        const store = requestOn(storeName, 'readwrite')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // delete the record
        const deleteRequest = store.delete(key)

        // resolve/reject w/ the request outcome
        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject(deleteRequest.error ?? new Error('Failed to delete record'))
      })
    },
    [requestOn]
  )


  /**
   * @name get
   * @description Fetches a single record from a store by its primary key.
   *
   * @param { string } storeName - The store's name
   * @param { IDBValidKey } key - The record's primary key
   *
   * @returns { Promise<T | undefined> } - The record or `undefined`
   */
  const get = useCallback(
    <T>(storeName: string, key: IDBValidKey): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readonly` store (or `null`)
        const store = requestOn(storeName, 'readonly')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // fetch the record
        const getRequest = store.get(key)

        // resolve w/ the record (or `undefined`) / reject on failure
        getRequest.onsuccess = () => resolve(getRequest.result as T)
        getRequest.onerror = () => reject(getRequest.error ?? new Error('Failed to get record'))
      })
    },
    [requestOn]
  )


  /**
   * @name getAll
   * @description Fetches every record in a store (optionally limiting the count).
   *
   * @param { string } storeName - The store's name
   * @param { number? } count - Optional max number of records to return
   *
   * @returns { Promise<Array<T>> } - The records (empty array if none)
   */
  const getAll = useCallback(
    <T>(storeName: string, count?: number): Promise<Array<T>> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readonly` store (or `null`)
        const store = requestOn(storeName, 'readonly')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // pass `count` along when provided, otherwise fetch everything
        const getAllRequest = count ? store.getAll(undefined, count) : store.getAll()

        // resolve w/ the records / reject on failure
        getAllRequest.onsuccess = () => resolve(getAllRequest.result as Array<T>)
        getAllRequest.onerror = () => reject(getAllRequest.error ?? new Error('Failed to get all records'))
      })
    },
    [requestOn]
  )


  /**
   * @name getByIndex
   * @description Fetches a single record from a store via a named index.
   *
   * @param { string } storeName - The store's name
   * @param { string } indexName - The index to query
   * @param { IDBValidKey } key - The index value to match
   *
   * @returns { Promise<T | undefined> } - The record or `undefined`
   */
  const getByIndex = useCallback(
    <T>(storeName: string, indexName: string, key: IDBValidKey): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        // ask our helper for a `readonly` store (or `null`)
        const store = requestOn(storeName, 'readonly')

        // reject early if the store doesn't exist
        if (!store) {
          reject(new Error(`Store '${storeName}' does not exist`))

          return
        }

        // grab the index & query it w/ the given key
        const index = store.index(indexName)
        const indexRequest = index.get(key)

        // resolve w/ the record (or `undefined`) / reject on failure
        indexRequest.onsuccess = () => resolve(indexRequest.result as T)
        indexRequest.onerror = () => reject(indexRequest.error ?? new Error('Failed to get record by index'))
      })
    },
    [requestOn]
  )


  // auto-open the db once on mount, and close it again on unmount
  useEffect(() => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return

    // kick off the open request
    open()

    // cleanup: close the db when the component unmounts
    return () => {
      openDbRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // expose the db instance, state flags & all lifecycle/crud methods
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


// export `useAbDataIndexer` hook as named export
export { useAbDataIndexer }


// export `useAbDataIndexer` hook as default
export default useAbDataIndexer