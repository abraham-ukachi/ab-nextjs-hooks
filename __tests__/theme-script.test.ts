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
* @name: abThemeScript tests
* @file: __tests__/theme-script.test.ts
* @type: Test (Vitest)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { beforeEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🌗 under test
import { abThemeScript, getAbThemeScript } from '../abThemeScript'
// 🎯 the reference implementation it must mirror
import { AB_THEME_DARK_QUERY, AB_THEME_LEGACY_STORAGE_KEY, AB_THEME_STORAGE_KEY, applyAbThemeToDocument } from '../useAbTheme'

// 🌙 OS scheme switch
const setDark = (dark: boolean) => {
  window.matchMedia = ((q: string) => ({ matches: dark && q === AB_THEME_DARK_QUERY, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => true })) as unknown as typeof window.matchMedia
}
// 📸 what <html> looks like
const snap = () => { const d = document.documentElement; return { cls: d.className, theme: d.dataset.theme, mode: d.dataset.themeMode, scheme: d.style.colorScheme } }
const reset = () => { const d = document.documentElement; d.className = ''; delete d.dataset.theme; delete d.dataset.themeMode; d.style.colorScheme = '' }
// ▶️ run an inline script like the browser would
const run = (src: string) => new Function(src)()

beforeEach(() => { localStorage.clear(); reset(); setDark(false) })

describe('abThemeScript 🌗', () => {
  it('uses the same keys and query as useAbTheme', () => {
    expect(AB_THEME_STORAGE_KEY).toBe('theme'); expect(AB_THEME_LEGACY_STORAGE_KEY).toBe('abTheme') // 🔑
    expect(abThemeScript).toContain(JSON.stringify(AB_THEME_DARK_QUERY)) // 🌙
  })
  it.each([
    ['saved dark', 'dark', false], ['saved light', 'light', true], ['saved system (OS dark)', 'system', true], ['saved system (OS light)', 'system', false],
  ] as const)('%s: paints exactly like applyAbThemeToDocument', (_n, saved, osDark) => {
    setDark(osDark); localStorage.setItem('theme', saved)
    applyAbThemeToDocument(saved, osDark); const want = snap(); reset() // 🎯 reference
    run(abThemeScript)
    expect(snap()).toEqual(want) // ✅ identical <html>
  })
  it('falls back to defaultTheme, and migrates the legacy key', () => {
    run(abThemeScript); expect(snap().theme).toBe('light') // 🌞 default
    reset(); setDark(true); run(getAbThemeScript({ defaultTheme: 'system' })); expect(snap()).toMatchObject({ theme: 'dark', mode: 'system' }) // 🖥️
    reset(); localStorage.setItem('abTheme', 'dark'); run(abThemeScript)
    expect(snap().theme).toBe('dark'); expect(localStorage.getItem('theme')).toBe('dark') // 🔁 migrated
  })
  it('blocked storage falls back to the OS scheme instead of throwing', () => {
    setDark(true)
    const orig = Object.getOwnPropertyDescriptor(window, 'localStorage')!
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('SecurityError') } }) // 🛡️
    try { run(abThemeScript) } finally { Object.defineProperty(window, 'localStorage', orig) }
    expect(snap()).toMatchObject({ theme: 'dark', mode: 'system' }) // 🌙
  })
  it('options are JSON-encoded (no script break-out) and the file is server-safe', () => {
    expect(getAbThemeScript({ storageKey: '</script><b>' })).not.toContain('</script>') // 🔒
    expect(readFileSync(join(__dirname, '../abThemeScript.ts'), 'utf8')).not.toMatch(/^'use client'/m) // 🖥️ importable from a server layout
  })
})
