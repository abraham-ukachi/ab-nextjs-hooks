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
* @name: Theme - AB Client Hook
* @file: useAbTheme.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> // Use the theme hook (keeps theme in `localStorage` under `theme`)
*    -|> import { useAbTheme } from 'ab-nextjs-hooks'
*    -|>
*    -|> const [theme, updateTheme] = useAbTheme('dark')
*    -|>
*    -|> updateTheme('dark') // ==> saves "dark" + sets `<html class="dark" data-theme="dark">`
*
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// ⚛️ React hooks
import { useCallback, useEffect, useState } from 'react'
// 🖥️ live media query (SSR-safe, G10)
import { useAbMedia } from './useAbMedia'


// ===== THEME - TYPES & CONSTANTS ===== //


/** 🌞 Default theme when nothing is saved in `localStorage` yet. */
export const DEFAULT_AB_THEME = 'light'

/**
 * 🔑 Storage key used by `useAbTheme` and by ab-elements-app's no-flash theme script.
 * Value lives on `<html>` as `.light` / `.dark`, `data-theme` and `color-scheme`.
 * Since 0.1.6 the stored value may also be `'system'` (see {@link AbThemeMode}).
 */
export const AB_THEME_STORAGE_KEY = 'theme'

/**
 * 🕰️ Legacy storage key from `useAbTheme` ≤ 0.1.3 (`body[data-theme]` + `abTheme`).
 * Still read once on hydrate and migrated to {@link AB_THEME_STORAGE_KEY}.
 */
export const AB_THEME_LEGACY_STORAGE_KEY = 'abTheme'

/** 🌗 G9/G34: the three user choices. `'system'` follows `prefers-color-scheme`. */
export type AbThemeMode = 'light' | 'dark' | 'system'

/** 🎨 What actually paints the page. */
export type AbResolvedTheme = 'light' | 'dark'

/** 🔍 Media query behind `'system'`. */
export const AB_THEME_DARK_QUERY = '(prefers-color-scheme: dark)'

/** 🗂️ All modes, in toggle order. */
export const AB_THEME_MODES: readonly AbThemeMode[] = ['light', 'dark', 'system'] as const

// 🧾 shape of the hook result as a tuple: `[theme, updateTheme]` (unchanged API)
export type AbThemeResult = [string, (theme: string) => void]

// 🧾 describe the `useAbTheme` hook signature as `AbThemeInterface`
export interface AbThemeInterface {
  (initialTheme?: string): AbThemeResult
}

/** 🧾 Object result of {@link useAbThemeMode}. */
export interface AbThemeModeResult {
  mode: AbThemeMode | string // 🎚️ what the user chose (custom theme names pass through)
  resolvedTheme: AbResolvedTheme | string // 🎨 what paints (system → light/dark)
  setMode: (mode: AbThemeMode | string) => void // ✍️ change + persist
}


/**
 * @name isAbThemeMode
 * @description 🔍 Narrow an unknown string to {@link AbThemeMode}.
 */
export function isAbThemeMode(value: unknown): value is AbThemeMode {
  return value === 'light' || value === 'dark' || value === 'system' // ✅
}


/**
 * @name resolveAbTheme
 * @description 🎨 Turn a mode into what paints: `'system'` → OS preference, others pass through.
 * @param mode - the chosen mode (or a custom theme name)
 * @param prefersDark - current `prefers-color-scheme: dark` match
 */
export function resolveAbTheme(mode: string, prefersDark: boolean): string {
  if (mode === 'system') return prefersDark ? 'dark' : 'light' // 🖥️ follow the OS
  return mode // 🎯 explicit
}


/**
 * @name applyAbThemeToDocument
 * @description 🖌️ Applies the theme the same way ab-elements-app's no-flash script does:
 * class + `data-theme` + `color-scheme` on `<html>`.
 * 🌗 For `'system'`, `data-theme`/class get the RESOLVED value (so existing `.dark` /
 * `[data-theme="dark"]` CSS keeps working) and `data-theme-mode="system"` records the choice.
 * @param theme - mode or theme name
 * @param prefersDark - optional override; read from `matchMedia` when omitted
 */
export function applyAbThemeToDocument(theme: string, prefersDark?: boolean): void {
  if (typeof document === 'undefined') return // 🖥️ SSR no-op
  const root = document.documentElement // 🌳 <html>
  // 🔍 OS preference, only needed for 'system'
  const dark = prefersDark ?? (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(AB_THEME_DARK_QUERY).matches)
  const resolved = resolveAbTheme(theme, dark) // 🎨
  root.dataset.theme = resolved // 🏷️ what paints
  root.dataset.themeMode = theme // 🎚️ what was chosen (light / dark / system / custom)
  root.classList.remove('light', 'dark') // 🧹
  if (resolved === 'light' || resolved === 'dark') root.classList.add(resolved) // ➕
  root.style.colorScheme = resolved // 🧭 native widgets + scrollbars
  // 🧹 drop the legacy body attribute so the two never disagree
  if (document.body?.dataset?.theme !== undefined) delete document.body.dataset.theme
}


/**
 * @name readAbThemeFromStorage
 * @description 📖 Reads the saved theme: `theme` first, then the legacy `abTheme` (and migrates it).
 */
export function readAbThemeFromStorage(fallback: string = DEFAULT_AB_THEME): string {
  if (typeof window === 'undefined') return fallback // 🖥️ SSR
  const saved = window.localStorage.getItem(AB_THEME_STORAGE_KEY) // 🔑
  if (saved) return saved // ✅
  const legacy = window.localStorage.getItem(AB_THEME_LEGACY_STORAGE_KEY) // 🕰️
  if (legacy) {
    window.localStorage.setItem(AB_THEME_STORAGE_KEY, legacy) // 🔁 migrate
    return legacy
  }
  return fallback // 🧭
}




// ===== useAbThemeMode / useAbTheme - AB HOOKS ===== //


/**
 * @name useAbThemeMode
 * @description 🌗 G9: light / dark / system. Reads the saved mode after mount (SSR-safe),
 *   persists it, applies it to `<html>`, and — in `'system'` — follows the OS live.
 * @param initialMode - fallback before hydration / when nothing is saved (default 'light')
 */
export function useAbThemeMode(initialMode: AbThemeMode | string = DEFAULT_AB_THEME): AbThemeModeResult {
  // 🌱 SSR-safe: seed with the prop only, never touch localStorage during render
  const [mode, setModeState] = useState<string>(initialMode)
  // 💧 hydrated yet?
  const [hydrated, setHydrated] = useState(false)
  // 🖥️ live OS preference (false on the server)
  const prefersDark = useAbMedia(AB_THEME_DARK_QUERY)

  // 💧 after mount, read any saved mode once (avoids hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') return // 🖥️
    const saved = readAbThemeFromStorage(initialMode) // 📖
    if (saved !== mode) setModeState(saved) // 🔁
    setHydrated(true) // ✅
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot client hydrate
  }, [])

  // 💾 persist + apply after hydration; re-runs when the OS flips while in 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !hydrated) return // ⏳
    window.localStorage.setItem(AB_THEME_STORAGE_KEY, mode) // 💾
    applyAbThemeToDocument(mode, prefersDark) // 🖌️
  }, [mode, hydrated, prefersDark])

  // ✍️ stable setter
  const setMode = useCallback((next: string) => setModeState(next), [])

  // 📦 result
  return { mode, resolvedTheme: resolveAbTheme(mode, prefersDark), setMode }
}


/**
 * @name useAbTheme
 * @description 🎨 Tuple form kept for back-compat: `[theme, updateTheme]`. `theme` is the
 *   chosen mode (now possibly `'system'`); use {@link useAbThemeMode} for `resolvedTheme`.
 * @param { string } initialTheme - The fallback theme used when nothing is stored yet
 * @returns { AbThemeResult }
 */
const useAbTheme: AbThemeInterface = (initialTheme: string = DEFAULT_AB_THEME): AbThemeResult => {
  const { mode, setMode } = useAbThemeMode(initialTheme) // 🌗 same engine
  return [mode, setMode] // 🧾 unchanged shape
}


// export `useAbTheme` hook as named export
export { useAbTheme }
