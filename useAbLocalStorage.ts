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
* @name: useAbLocalStorage (G10)
* @file: useAbLocalStorage.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const [seen, setSeen, removeSeen] = useAbLocalStorage<boolean>('ab-welcome-seen', false)
*    -|> setSeen(true) // ==> stored as JSON, synced across tabs
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

// 🧠 in-memory fallback per key, used when storage refuses writes (shared by every hook instance)
const abLocalStorageMemory = new Map<string, string | null>()

// 🔔 same-tab change event (the native `storage` event only fires in OTHER tabs)
export const AB_LOCAL_STORAGE_EVENT = 'ab-local-storage'

// ⚙️ options
export interface UseAbLocalStorageOptions<T> {
  // ✍️ value → string (default JSON.stringify)
  serialize?: (value: T) => string
  // 📖 string → value (default JSON.parse)
  deserialize?: (raw: string) => T
}

// 📦 the hook result: [value, set, remove]
export type UseAbLocalStorageResult<T> = readonly [T, (next: T | ((prev: T) => T)) => void, () => void]

// 🛡️ get localStorage or null (throws in sandboxed iframes / blocked cookies / SSR)
export function getAbLocalStorage(): Storage | null {
  try {
    // 🚫 no window → server
    if (typeof window === 'undefined') return null
    // 🗄️ the property access itself can throw (SecurityError)
    return window.localStorage ?? null
  } catch {
    // 🙈 blocked
    return null
  }
}

// 📖 safe read: any failure → null
export function readAbLocalStorage(key: string): string | null {
  try { return getAbLocalStorage()?.getItem(key) ?? null } catch { return null } // 🛟
}

// ✍️ safe write (null = remove): returns false when storage refused it (quota, private mode…)
export function writeAbLocalStorage(key: string, raw: string | null): boolean {
  try {
    const storage = getAbLocalStorage() // 🗄️
    if (!storage) return false // 🚫 none
    if (raw === null) storage.removeItem(key) // 🧹 remove
    else storage.setItem(key, raw) // ✍️ set
    return true // ✅
  } catch {
    return false // 🙈 refused
  }
}

/**
 * 🗄️ useAbLocalStorage — a `useState`-like hook backed by localStorage.
 * Never throws: a broken / blocked storage just keeps the value in memory.
 * SSR-safe (server snapshot = initialValue) and synced across tabs + hook instances.
 */
export function useAbLocalStorage<T>(key: string, initialValue: T, options: UseAbLocalStorageOptions<T> = {}): UseAbLocalStorageResult<T> {
  // 🔧 (de)serializers
  const serialize = options.serialize ?? JSON.stringify
  const deserialize = options.deserialize ?? (JSON.parse as (raw: string) => T)
  // 🧊 snapshot cache box (useSyncExternalStore needs a stable value per raw string)
  const [cache] = useState<{ raw?: string | null; value?: T; filled: boolean }>(() => ({ filled: false }))

  // 📖 current raw string (memory fallback wins for this key)
  const readRaw = useCallback((): string | null => (abLocalStorageMemory.has(key) ? abLocalStorageMemory.get(key)! : readAbLocalStorage(key)), [key])

  // 📸 client snapshot
  const getSnapshot = useCallback((): T => {
    const raw = readRaw() // 📖
    if (cache.filled && cache.raw === raw && raw !== null) return cache.value as T // 🧊 cached
    if (raw === null) return initialValue // 🏁 nothing stored → initial
    let value: T // 📦 parsed
    try { value = deserialize(raw) } catch { return initialValue } // 🛟 corrupt JSON → initial
    cache.raw = raw; cache.value = value; cache.filled = true // 🧊 store
    return value // 📦
  }, [readRaw, deserialize, cache, initialValue])

  // 📸 server snapshot = initial value
  const getServerSnapshot = useCallback((): T => initialValue, [initialValue])

  // 🔔 subscribe to cross-tab + same-tab changes
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window === 'undefined') return () => {} // 🖥️ server
    // 🪟 other tabs
    const onStorage = (event: StorageEvent) => { if (event.key === null || event.key === key) onChange() }
    // 📣 this tab
    const onLocal = (event: Event) => { if ((event as CustomEvent<string>).detail === key) onChange() }
    window.addEventListener('storage', onStorage) // 👂
    window.addEventListener(AB_LOCAL_STORAGE_EVENT, onLocal) // 👂
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(AB_LOCAL_STORAGE_EVENT, onLocal) } // 🧹
  }, [key])

  // 📦 the value
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // 📣 notify same-tab listeners
  const notify = useCallback(() => {
    try { window.dispatchEvent(new CustomEvent(AB_LOCAL_STORAGE_EVENT, { detail: key })) } catch { /* 🙈 no window */ }
  }, [key])

  // ✍️ setter (value or updater)
  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const prev = getSnapshot() // 📖 current
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next // 🧮
    let raw: string // 🧾
    try { raw = serialize(resolved) } catch { return } // 🛟 unserializable → ignore
    // ✍️ storage first; on refusal keep it in memory
    if (writeAbLocalStorage(key, raw)) abLocalStorageMemory.delete(key); else abLocalStorageMemory.set(key, raw)
    notify() // 📣
  }, [getSnapshot, serialize, key, notify])

  // 🧹 remove → back to initial
  const remove = useCallback(() => {
    if (writeAbLocalStorage(key, null)) abLocalStorageMemory.delete(key); else abLocalStorageMemory.set(key, null) // 🧹
    notify() // 📣
  }, [key, notify])

  // 📦 stable tuple
  return useMemo(() => [value, setValue, remove] as const, [value, setValue, remove])
}

// 📦 default export
export default useAbLocalStorage
