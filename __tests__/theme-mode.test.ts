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
* @name: useAbThemeMode - Tests (G9 system mode)
* @file: __tests__/theme-mode.test.ts
* @type: Vitest (happy-dom)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
// 🪝 hook renderer
import { act, renderHook } from '@testing-library/react'
// 🌗 code under test
import {
  AB_THEME_DARK_QUERY,
  AB_THEME_STORAGE_KEY,
  applyAbThemeToDocument,
  isAbThemeMode,
  resolveAbTheme,
  useAbTheme,
  useAbThemeMode,
} from '../useAbTheme'

// 🎭 a flippable prefers-color-scheme
let dark = false // 🌙 current OS value
const listeners = new Set<() => void>() // 👂
const original = window.matchMedia // 💾
beforeEach(() => {
  dark = false // 🌞 reset
  listeners.clear() // 🧹
  window.localStorage.clear() // 🧹
  window.matchMedia = ((query: string) => ({
    get matches() { return query === AB_THEME_DARK_QUERY ? dark : false }, // 📸
    media: query, onchange: null, // 🏷️
    addEventListener: (_: string, fn: () => void) => listeners.add(fn), // 👂
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn), // 🧹
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => true, // 👴
  })) as unknown as typeof window.matchMedia
})
afterEach(() => { window.matchMedia = original }) // ♻️
// 🔀 flip the OS theme
const setOsDark = (value: boolean) => { dark = value; listeners.forEach((fn) => fn()) }
// 🌳 <html>
const html = () => document.documentElement

describe('theme mode helpers', () => {
  it('resolves system against the OS, passes the rest through', () => {
    expect(resolveAbTheme('system', true)).toBe('dark') // 🌙
    expect(resolveAbTheme('system', false)).toBe('light') // 🌞
    expect(resolveAbTheme('dark', false)).toBe('dark') // 🎯
    expect(resolveAbTheme('sepia', true)).toBe('sepia') // 🎨 custom passes through
    expect(isAbThemeMode('system')).toBe(true) // ✅
    expect(isAbThemeMode('sepia')).toBe(false) // ❌
  })
  it('system paints the resolved theme and records the mode', () => {
    applyAbThemeToDocument('system', true) // 🖌️
    expect(html().dataset.theme).toBe('dark') // 🎨 existing [data-theme=dark] CSS works
    expect(html().dataset.themeMode).toBe('system') // 🎚️
    expect(html().classList.contains('dark')).toBe(true) // 🏷️
    expect(html().style.colorScheme).toBe('dark') // 🧭
  })
})

describe('useAbThemeMode (G9)', () => {
  it('follows the OS live while in system, and persists the mode', () => {
    window.localStorage.setItem(AB_THEME_STORAGE_KEY, 'system') // 💾 saved choice
    const { result } = renderHook(() => useAbThemeMode()) // 🪝
    expect(result.current.mode).toBe('system') // 💧 hydrated
    expect(result.current.resolvedTheme).toBe('light') // 🌞
    act(() => setOsDark(true)) // 🌙 OS flips
    expect(result.current.resolvedTheme).toBe('dark') // ✅ live
    expect(html().dataset.theme).toBe('dark') // 🖌️ re-applied
    act(() => result.current.setMode('light')) // 🎯 explicit
    expect(window.localStorage.getItem(AB_THEME_STORAGE_KEY)).toBe('light') // 💾
    expect(html().dataset.theme).toBe('light') // 🖌️ ignores the OS now
    expect(html().dataset.themeMode).toBe('light') // 🎚️
  })
  it('useAbTheme tuple keeps working and accepts system', () => {
    const { result } = renderHook(() => useAbTheme('dark')) // 🪝 old API
    expect(result.current[0]).toBe('dark') // ✅
    act(() => result.current[1]('system')) // 🌗
    expect(result.current[0]).toBe('system') // ✅
    expect(window.localStorage.getItem(AB_THEME_STORAGE_KEY)).toBe('system') // 💾
  })
})
