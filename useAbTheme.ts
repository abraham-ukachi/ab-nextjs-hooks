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
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
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


// REACT types
// REACT hooks
import { useEffect, useState } from 'react'
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




// ===== THEME - TYPES & CONSTANTS ===== //


/** Default theme when nothing is saved in `localStorage` yet. */
export const DEFAULT_AB_THEME = 'light'

/**
 * Storage key used by `useAbTheme` and by ab-elements-app's no-flash theme script.
 * Value lives on `<html>` as `.light` / `.dark`, `data-theme` and `color-scheme`.
 */
export const AB_THEME_STORAGE_KEY = 'theme'

/**
 * Legacy storage key from `useAbTheme` ≤ 0.1.3 (`body[data-theme]` + `abTheme`).
 * Still read once on hydrate and migrated to {@link AB_THEME_STORAGE_KEY}.
 */
export const AB_THEME_LEGACY_STORAGE_KEY = 'abTheme'


// shape of the hook result as a tuple: `[theme, updateTheme]`
export type AbThemeResult = [string, (theme: string) => void]


// describe the `useAbTheme` hook signature as `AbThemeInterface`
export interface AbThemeInterface {
  (initialTheme?: string): AbThemeResult
}


/**
 * Applies the theme the same way ab-elements-app's no-flash script does:
 * class + `data-theme` + `color-scheme` on `<html>`.
 */
export function applyAbThemeToDocument(theme: string): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.remove('light', 'dark')
  if (theme === 'light' || theme === 'dark') root.classList.add(theme)
  root.style.colorScheme = theme
  // drop the legacy body attribute so the two never disagree
  if (document.body?.dataset?.theme !== undefined) delete document.body.dataset.theme
}


/**
 * Reads the saved theme: `theme` first, then the legacy `abTheme` (and migrates it).
 */
export function readAbThemeFromStorage(fallback: string = DEFAULT_AB_THEME): string {
  if (typeof window === 'undefined') return fallback
  const saved = window.localStorage.getItem(AB_THEME_STORAGE_KEY)
  if (saved) return saved
  const legacy = window.localStorage.getItem(AB_THEME_LEGACY_STORAGE_KEY)
  if (legacy) {
    window.localStorage.setItem(AB_THEME_STORAGE_KEY, legacy)
    return legacy
  }
  return fallback
}




// ===== useAbTheme - AB HOOK ===== //


/**
 * @name useAbTheme
 * @description A theme hook that reads the saved theme from `localStorage` (`theme`),
 * keeps it in state, and persists it on `<html>` (class + `data-theme` + `color-scheme`)
 * whenever it changes — matching ab-elements-app's no-flash script.
 *
 * Migration: values previously stored as `abTheme` (and stamped on `body[data-theme]`)
 * are read once and rewritten under `theme`.
 *
 * @param { string } initialTheme - The fallback theme used when nothing is stored yet
 *
 * @returns { AbThemeResult }
 */
const useAbTheme: AbThemeInterface = (initialTheme: string = DEFAULT_AB_THEME): AbThemeResult => {

  // SSR-safe: seed with the prop only — never touch localStorage during render
  const [theme, setTheme] = useState(initialTheme)
  const [hydrated, setHydrated] = useState(false)

  // after mount, read any saved theme once (avoids hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = readAbThemeFromStorage(initialTheme)
    if (saved !== theme) setTheme(saved)
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot client hydrate
  }, [])

  // persist theme changes after hydration
  useEffect(() => {
    if (typeof window === 'undefined' || !hydrated) return

    window.localStorage.setItem(AB_THEME_STORAGE_KEY, theme)
    applyAbThemeToDocument(theme)
  }, [theme, hydrated])

  const updateTheme = (next: string): void => {
    setTheme(next)
  }

  return [theme, updateTheme]
}


// export `useAbTheme` hook as named export
export { useAbTheme }
