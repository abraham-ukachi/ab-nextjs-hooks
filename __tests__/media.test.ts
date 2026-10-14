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
* @name: useAbMedia + useAbReducedMotion - Tests
* @file: __tests__/media.test.ts
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { afterEach, describe, expect, it, vi } from 'vitest'
// 🪝 hook renderer
import { act, renderHook } from '@testing-library/react'
// 🖨️ server renderer (SSR snapshot check)
import { renderToString } from 'react-dom/server'
// ⚛️ element factory
import { createElement } from 'react'
// 📐 hooks under test
import { matchAbMedia, useAbMedia } from '../useAbMedia'
import { AB_REDUCED_MOTION_QUERY, prefersAbReducedMotionNow, useAbReducedMotion } from '../useAbReducedMotion'

// 🎭 fake MediaQueryList we can flip from the test
function fakeMedia(initial: Record<string, boolean>) {
  const state = { ...initial } // 📦 query → matches
  const listeners = new Map<string, Set<() => void>>() // 👂 per query
  const original = window.matchMedia // 💾 restore later
  // 🔁 our matchMedia
  window.matchMedia = ((query: string) => ({
    get matches() { return state[query] ?? false }, // 📸 live value
    media: query, // 🏷️
    onchange: null, // 🙈 unused
    addEventListener: (_: string, fn: () => void) => { if (!listeners.has(query)) listeners.set(query, new Set()); listeners.get(query)!.add(fn) }, // 👂
    removeEventListener: (_: string, fn: () => void) => { listeners.get(query)?.delete(fn) }, // 🧹
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => true, // 👴 legacy stubs
  })) as unknown as typeof window.matchMedia
  return {
    // 🔀 flip a query and notify listeners
    set(query: string, value: boolean) { state[query] = value; listeners.get(query)?.forEach((fn) => fn()) },
    // 🔢 how many listeners are attached
    count(query: string) { return listeners.get(query)?.size ?? 0 },
    // ♻️ restore
    restore() { window.matchMedia = original },
  }
}

// 🧹 restore spies
afterEach(() => vi.restoreAllMocks())

describe('useAbMedia (G10)', () => {
  it('returns the current match and updates live', () => {
    const media = fakeMedia({ '(min-width: 1024px)': true }) // 🎭 laptop
    const { result } = renderHook(() => useAbMedia('(min-width: 1024px)')) // 🪝
    expect(result.current).toBe(true) // ✅ matches
    act(() => media.set('(min-width: 1024px)', false)) // 📱 resize to mobile
    expect(result.current).toBe(false) // 🔁 updated
    media.restore() // ♻️
  })

  it('unsubscribes on unmount', () => {
    const media = fakeMedia({ q: false }) // 🎭
    const { unmount } = renderHook(() => useAbMedia('q')) // 🪝
    expect(media.count('q')).toBe(1) // 👂 subscribed
    unmount() // 🔚
    expect(media.count('q')).toBe(0) // 🧹 cleaned up
    media.restore() // ♻️
  })

  it('uses defaultValue on the server', () => {
    // 🖥️ a tiny component printing the hook value
    const Probe = () => createElement('span', null, String(useAbMedia('(min-width: 1px)', { defaultValue: true })))
    expect(renderToString(createElement(Probe))).toContain('true') // ✅ server snapshot = default
  })

  it('never throws when matchMedia is missing or the query is invalid', () => {
    const original = window.matchMedia // 💾
    // 🧪 simulate an old browser
    window.matchMedia = undefined as unknown as typeof window.matchMedia
    expect(matchAbMedia('(min-width: 1px)', true)).toBe(true) // 🛟 fallback
    window.matchMedia = (() => { throw new Error('SyntaxError') }) as unknown as typeof window.matchMedia // 💥 invalid query
    const { result } = renderHook(() => useAbMedia('((nope', { defaultValue: false })) // 🪝
    expect(result.current).toBe(false) // 🛟
    window.matchMedia = original // ♻️
  })
})

describe('useAbReducedMotion (G32)', () => {
  it('follows prefers-reduced-motion live', () => {
    const media = fakeMedia({ [AB_REDUCED_MOTION_QUERY]: false }) // 🎭 motion OK
    const { result } = renderHook(() => useAbReducedMotion()) // 🪝
    expect(result.current).toBe(false) // 🏃 full motion
    act(() => media.set(AB_REDUCED_MOTION_QUERY, true)) // ♿ user turns on reduce motion
    expect(result.current).toBe(true) // ✅ updated without reload
    expect(prefersAbReducedMotionNow()).toBe(true) // 📸 one-shot helper agrees
    media.restore() // ♻️
  })

  it('uses the same query string as ab-nextjs-animations', () => {
    expect(AB_REDUCED_MOTION_QUERY).toBe('(prefers-reduced-motion: reduce)') // 🤝
  })
})
