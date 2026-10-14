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
* @name: useAbMedia (G10)
* @file: useAbMedia.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const isLaptop = useAbMedia('(min-width: 1024px)')
*    -|> const isMobile = useAbMedia('(max-width: 639px)', { defaultValue: true }) // SSR guess
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks (useSyncExternalStore = tear-free, SSR-aware subscriptions)
import { useCallback, useSyncExternalStore } from 'react'

// ⚙️ options for useAbMedia
export interface UseAbMediaOptions {
  // 🖥️ value used on the server AND during hydration (default false) → avoids hydration mismatches
  defaultValue?: boolean
}

// 🔍 safe `matchMedia(query)` lookup: null on the server, in old browsers or for invalid queries
export function getAbMediaQueryList(query: string): MediaQueryList | null {
  // 🚫 no window → server render
  if (typeof window === 'undefined') return null
  // 🚫 no matchMedia → very old browser / bare test env
  if (typeof window.matchMedia !== 'function') return null
  try {
    // 🎯 the real MediaQueryList
    return window.matchMedia(query)
  } catch {
    // 🙈 invalid query string → behave as "no match"
    return null
  }
}

// 📸 one-shot read of a media query (no subscription) — handy outside React
export function matchAbMedia(query: string, fallback = false): boolean {
  // 🔍 look it up
  const list = getAbMediaQueryList(query)
  // ✅ real answer, or the fallback when unavailable
  return list ? list.matches : fallback
}

// 👂 subscribe to a MediaQueryList, supporting the legacy addListener API (Safari < 14)
function listenAbMedia(list: MediaQueryList, onChange: () => void): () => void {
  // 🆕 modern browsers
  if (typeof list.addEventListener === 'function') {
    list.addEventListener('change', onChange) // 👂 listen
    return () => list.removeEventListener('change', onChange) // 🧹 cleanup
  }
  // 👴 legacy Safari
  list.addListener(onChange) // 👂 listen (deprecated API)
  return () => list.removeListener(onChange) // 🧹 cleanup
}

/**
 * 📐 useAbMedia — `true` while the CSS media query matches, live-updated.
 *
 * - 🖥️ SSR-safe: the server (and the hydration pass) see `defaultValue` (false by default),
 *   then the real value is read right after hydration — no mismatch warnings.
 * - 🧯 Never throws: invalid queries / missing `matchMedia` just return `defaultValue`.
 * - ♿ Prefer CSS for pure layout; use this only when BEHAVIOUR depends on the media (e.g. swipe on mobile).
 */
export function useAbMedia(query: string, options: UseAbMediaOptions = {}): boolean {
  // 🏁 SSR / fallback value
  const defaultValue = options.defaultValue ?? false

  // 🔔 subscribe to changes of THIS query
  const subscribe = useCallback((onChange: () => void) => {
    // 🔍 find the list (null on server / invalid query)
    const list = getAbMediaQueryList(query)
    // 🚫 nothing to listen to → no-op unsubscribe
    if (!list) return () => {}
    // 👂 listen + return the cleanup
    return listenAbMedia(list, onChange)
  }, [query])

  // 📸 client snapshot: the current match (a primitive → always cache-safe)
  const getSnapshot = useCallback(() => matchAbMedia(query, defaultValue), [query, defaultValue])

  // 🖥️ server snapshot: the default value
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue])

  // 📦 live boolean
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// 📦 default export
export default useAbMedia
