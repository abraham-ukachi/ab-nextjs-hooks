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
* @name: abThemeScript (no-flash theme)
* @file: abThemeScript.ts
* @type: Server-safe helper (plain string, no React)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> // app/layout.tsx (server component)
*    -|> import { abThemeScript } from 'ab-nextjs-hooks/abThemeScript'
*    -|> <head><script dangerouslySetInnerHTML={{ __html: abThemeScript }} /></head>
*    -|> // or: getAbThemeScript({ defaultTheme: 'system' })
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚠️ NO 'use client': this file is imported by server layouts. It only builds a string.

/** 🎛️ Options for {@link getAbThemeScript}. */
export interface AbThemeScriptOptions {
  /** 🌞 mode used when nothing is saved: `'light'`, `'dark'` or `'system'` (default `'light'`, like useAbTheme). */
  defaultTheme?: string
  /** 🔑 storage key (default `'theme'`, the same as `AB_THEME_STORAGE_KEY`). */
  storageKey?: string
  /** 🕰️ legacy key read (and migrated) when the main key is empty (default `'abTheme'`). */
  legacyStorageKey?: string
}

// 🔑 kept in sync with useAbTheme.ts (a test asserts they match; importing it would pull in 'use client')
const STORAGE_KEY = 'theme' // 🔑 AB_THEME_STORAGE_KEY
const LEGACY_KEY = 'abTheme' // 🕰️ AB_THEME_LEGACY_STORAGE_KEY
const DARK_QUERY = '(prefers-color-scheme: dark)' // 🌙 AB_THEME_DARK_QUERY

/**
 * 🌗 getAbThemeScript — the inline pre-paint script for `<head>`, so the first paint already has the right
 * theme (no light flash for dark users). It applies the theme **exactly** like `applyAbThemeToDocument`:
 * `<html class="light|dark" data-theme="…" data-theme-mode="…" style="color-scheme:…">`.
 *
 * - 💾 reads `localStorage[storageKey]`, then the legacy key (and migrates it), then `defaultTheme`
 * - 🖥️ `'system'` resolves with `prefers-color-scheme`
 * - 🛡️ wrapped in try/catch: blocked storage (Safari private mode, sandboxed iframes) falls back to the OS scheme
 * - 🔒 values are JSON-encoded, so options can't break out of the script
 */
export function getAbThemeScript(options: AbThemeScriptOptions = {}): string {
  const { defaultTheme = 'light', storageKey = STORAGE_KEY, legacyStorageKey = LEGACY_KEY } = options // 🎛️
  const j = (v: string): string => JSON.stringify(v).replace(/</g, '\\u003c') // 🔒 safe inside <script>
  // 🧾 minified on purpose: it ships inline in every HTML response
  return `(function(){var d=document.documentElement,m;function a(t){var r=t==='system'?(matchMedia(${j(DARK_QUERY)}).matches?'dark':'light'):t;d.dataset.theme=r;d.dataset.themeMode=t;d.classList.remove('light','dark');if(r==='light'||r==='dark')d.classList.add(r);d.style.colorScheme=r}try{var s=localStorage,k=${j(storageKey)},l=${j(legacyStorageKey)};m=s.getItem(k);if(!m){m=s.getItem(l);if(m)s.setItem(k,m)}a(m||${j(defaultTheme)})}catch(e){a('system')}})()`
}

/** 🌗 The default no-flash script (`defaultTheme: 'light'`, key `theme`). */
export const abThemeScript: string = getAbThemeScript()

// 📦 default export
export default abThemeScript
