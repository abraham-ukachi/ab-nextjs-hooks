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
* @name: useAbClipboard (G10)
* @file: useAbClipboard.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const { copy, copied } = useAbClipboard({ resetAfter: 2000 })
*    -|> <button onClick={() => copy('pnpm add ab-nextjs-core')}>{copied ? 'Copied' : 'Copy'}</button>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ⏱️ how long `copied` stays true by default (ms)
export const AB_CLIPBOARD_RESET_MS = 2000

// ⚙️ options for useAbClipboard
export interface UseAbClipboardOptions {
  // ⏱️ ms before `copied` goes back to false (0 or negative = stay true until reset() / next copy)
  resetAfter?: number
}

// 📦 what the hook returns
export interface UseAbClipboardResult {
  // 📋 copy a string; resolves true on success, false on failure (never rejects)
  copy: (text: string) => Promise<boolean>
  // ✅ true right after a successful copy (for "Copied" labels + live regions)
  copied: boolean
  // 💥 last failure (null when the last attempt succeeded or nothing happened yet)
  error: Error | null
  // 🧹 clear `copied` + `error` right away
  reset: () => void
}

// 🧓 legacy fallback: hidden <textarea> + document.execCommand('copy') (http:// pages, old Safari)
function copyAbTextLegacy(text: string): boolean {
  // 🚫 no DOM → server
  if (typeof document === 'undefined' || !document.body) return false
  // 📝 temporary textarea holding the text
  const area = document.createElement('textarea')
  area.value = text // ✍️ the text to copy
  area.setAttribute('readonly', '') // 📱 avoid the iOS keyboard popping up
  area.setAttribute('aria-hidden', 'true') // ♿ never announced
  area.style.position = 'fixed' // 📌 out of the layout flow (no scroll jump)
  area.style.top = '0' // 📌 pinned top
  area.style.left = '-9999px' // 🙈 off-screen
  area.style.opacity = '0' // 🙈 invisible
  // 🎯 remember focus so we can give it back (keyboard users stay where they were)
  const previous = document.activeElement as HTMLElement | null
  document.body.appendChild(area) // ➕ mount
  try {
    area.select() // 🖱️ select the text
    // 📋 deprecated, but still the only sync fallback; returns false when blocked
    return typeof document.execCommand === 'function' ? document.execCommand('copy') : false
  } catch {
    return false // 🙈 blocked
  } finally {
    document.body.removeChild(area) // ➖ unmount
    previous?.focus?.() // 🎯 restore focus
  }
}

/**
 * 📋 copyAbText — copy a string to the clipboard without React.
 * Uses the async Clipboard API when available (secure contexts), otherwise the legacy fallback.
 * Resolves `true` / `false`; never throws.
 */
export async function copyAbText(text: string): Promise<boolean> {
  try {
    // 🆕 async Clipboard API (https / localhost, user-gesture)
    const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined
    if (clipboard && typeof clipboard.writeText === 'function') {
      await clipboard.writeText(text) // 📋 write
      return true // ✅ done
    }
  } catch {
    // 🙈 permission denied / not focused → try the legacy path below
  }
  // 🧓 fallback
  return copyAbTextLegacy(text)
}

/**
 * 📋 useAbClipboard — copy text and get a short-lived `copied` flag.
 *
 * ♿ Pair `copied` with a polite live region (e.g. `<span aria-live="polite">{copied ? 'Copied' : ''}</span>`)
 * so screen readers hear the confirmation.
 * 🧹 The reset timer is cleared on unmount and on every new copy (no setState after unmount).
 */
export function useAbClipboard(options: UseAbClipboardOptions = {}): UseAbClipboardResult {
  // ⏱️ reset delay
  const resetAfter = options.resetAfter ?? AB_CLIPBOARD_RESET_MS
  // ✅ copied flag
  const [copied, setCopied] = useState(false)
  // 💥 last error
  const [error, setError] = useState<Error | null>(null)
  // ⏲️ pending reset timer
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 🟢 mounted flag (ignore results that land after unmount)
  const mounted = useRef(true)

  // 🧹 stop any pending reset
  const clearTimer = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current) // ⏹️ cancel
    timer.current = null // 🧽 forget
  }, [])

  // 🔄 track mount / unmount
  useEffect(() => {
    mounted.current = true // 🟢 (re)mounted (StrictMode runs effects twice)
    return () => { mounted.current = false; clearTimer() } // 🔴 unmounted → no more updates
  }, [clearTimer])

  // 🧹 manual reset
  const reset = useCallback(() => {
    clearTimer() // ⏹️ cancel timer
    setCopied(false) // ❎ not copied
    setError(null) // 🧽 no error
  }, [clearTimer])

  // 📋 copy + flag
  const copy = useCallback(async (text: string) => {
    clearTimer() // ⏹️ a new copy restarts the countdown
    const ok = await copyAbText(text) // 📋 try to copy
    if (!mounted.current) return ok // 🔴 unmounted meanwhile → just report
    setCopied(ok) // ✅ / ❎
    setError(ok ? null : new Error('ab-clipboard: copy failed')) // 💥 remember failures
    // ⏱️ schedule the flag reset
    if (ok && resetAfter > 0) timer.current = setTimeout(() => { timer.current = null; if (mounted.current) setCopied(false) }, resetAfter)
    return ok // 📦 result
  }, [clearTimer, resetAfter])

  // 📦 stable object
  return useMemo(() => ({ copy, copied, error, reset }), [copy, copied, error, reset])
}

// 📦 default export
export default useAbClipboard
