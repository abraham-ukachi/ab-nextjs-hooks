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
* @name: useAbScrollSpy tests (G46)
* @file: __tests__/scroll-spy.test.ts
* @type: Test (Vitest)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// 🪝 hook renderer
import { act, renderHook } from '@testing-library/react'
// 🔭 under test
import { scrollToAbSection, useAbScrollSpy } from '../useAbScrollSpy'

// 🎭 a controllable IntersectionObserver
type Cb = (entries: Array<{ target: Element; isIntersecting: boolean }>) => void
const observers: Array<{ cb: Cb; opts: IntersectionObserverInit; els: Element[]; disconnected: boolean }> = []
class FakeIO {
  rec: (typeof observers)[number]
  constructor(cb: Cb, opts: IntersectionObserverInit) { this.rec = { cb, opts, els: [], disconnected: false }; observers.push(this.rec) } // 📦
  observe(el: Element) { this.rec.els.push(el) } // 👁️
  disconnect() { this.rec.disconnected = true } // 🧹
  unobserve() {} // 🙈
}
// 🔀 fire entries on the live observer
const fire = (changes: Record<string, boolean>) => act(() => {
  const io = observers[observers.length - 1]
  io.cb(Object.entries(changes).map(([id, isIntersecting]) => ({ target: document.getElementById(id)!, isIntersecting })))
})

const IDS = ['overview', 'install', 'packages'] as const // 🗂️ TOC sections
beforeEach(() => {
  observers.length = 0 // 🧹
  ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIO // 🎭
  document.body.innerHTML = IDS.map((id) => `<section id="${id}"></section>`).join('') // 🧱
})
afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks() })

describe('useAbScrollSpy 🔭', () => {
  it('seeds with the first id, observes every section with the rootMargin', () => {
    const { result } = renderHook(() => useAbScrollSpy(IDS, { rootMargin: '-64px 0px -60% 0px' }))
    expect(result.current).toBe('overview') // 🌱 first paint marks something
    expect(observers[0].els.map((e) => e.id)).toEqual([...IDS]) // 👁️ all observed
    expect(observers[0].opts.rootMargin).toBe('-64px 0px -60% 0px') // 📏
  })
  it('the first visible id in order wins, and the last one sticks when nothing is visible', () => {
    const { result } = renderHook(() => useAbScrollSpy(IDS))
    fire({ install: true, packages: true }) // 👀 two visible
    expect(result.current).toBe('install') // 🥇 document order
    fire({ install: false }) // ➖
    expect(result.current).toBe('packages')
    fire({ packages: false }) // 🫥 gap between sections
    expect(result.current).toBe('packages') // 📌 kept, no blink
  })
  it('skips missing ids, disconnects on unmount and does nothing when disabled', () => {
    const { unmount } = renderHook(() => useAbScrollSpy(['overview', 'nope']))
    expect(observers[0].els.map((e) => e.id)).toEqual(['overview']) // 🚫 no throw on a missing id
    unmount()
    expect(observers[0].disconnected).toBe(true) // 🧹
    renderHook(() => useAbScrollSpy(IDS, { enabled: false }))
    expect(observers).toHaveLength(1) // 🔌 no new observer
  })
  it('without IntersectionObserver it returns initialId and never throws', () => {
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver // 👴
    const { result } = renderHook(() => useAbScrollSpy(IDS, { initialId: null }))
    expect(result.current).toBeNull() // 🧭
  })
})

describe('scrollToAbSection ♿', () => {
  const setReduced = (reduce: boolean) => {
    window.matchMedia = ((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => true })) as unknown as typeof window.matchMedia
  }
  it('scrolls smoothly, minus the offset, and updates the hash', () => {
    setReduced(false)
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) // 🎭
    expect(scrollToAbSection('install', { offset: 64 })).toBe(true)
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' })) // 🛝
    expect(location.hash).toBe('#install') // 🔗
  })
  it('is instant under reduced motion, false for an unknown id', () => {
    setReduced(true)
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToAbSection('packages')
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' })) // ♿
    expect(scrollToAbSection('nope')).toBe(false) // 🚫
  })
})
