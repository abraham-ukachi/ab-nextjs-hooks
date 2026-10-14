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
* @name: useAbLocalStorage - Tests
* @file: __tests__/local-storage.test.ts
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
// 🗄️ hook under test
import { useAbLocalStorage, readAbLocalStorage, writeAbLocalStorage } from '../useAbLocalStorage'

// 🧹 reset between tests
afterEach(() => { vi.restoreAllMocks(); window.localStorage.clear() })

describe('useAbLocalStorage (G10)', () => {
  it('returns the initial value, then persists JSON', () => {
    const { result } = renderHook(() => useAbLocalStorage('k1', { n: 1 })) // 🪝
    expect(result.current[0]).toEqual({ n: 1 }) // 🏁 initial
    act(() => result.current[1]({ n: 2 })) // ✍️
    expect(result.current[0]).toEqual({ n: 2 }) // ✅ state
    expect(window.localStorage.getItem('k1')).toBe('{"n":2}') // ✅ stored
  })

  it('supports updater functions and remove()', () => {
    const { result } = renderHook(() => useAbLocalStorage('k2', 0)) // 🪝
    act(() => result.current[1]((p) => p + 5)) // 🧮
    expect(result.current[0]).toBe(5) // ✅
    act(() => result.current[2]()) // 🧹
    expect(result.current[0]).toBe(0) // ✅ back to initial
    expect(window.localStorage.getItem('k2')).toBeNull() // ✅ removed
  })

  it('syncs two hook instances in the same tab', () => {
    const a = renderHook(() => useAbLocalStorage('k3', 'x')) // 🅰️
    const b = renderHook(() => useAbLocalStorage('k3', 'x')) // 🅱️
    act(() => a.result.current[1]('y')) // ✍️
    expect(b.result.current[0]).toBe('y') // 🔁 synced
  })

  it('reacts to other tabs (storage event)', () => {
    const { result } = renderHook(() => useAbLocalStorage('k4', 'a')) // 🪝
    act(() => { window.localStorage.setItem('k4', '"b"'); window.dispatchEvent(new StorageEvent('storage', { key: 'k4' })) }) // 🪟
    expect(result.current[0]).toBe('b') // ✅
  })

  it('corrupt JSON falls back to the initial value', () => {
    window.localStorage.setItem('k5', '{oops') // 💥
    const { result } = renderHook(() => useAbLocalStorage('k5', 7)) // 🪝
    expect(result.current[0]).toBe(7) // 🛟
  })

  it('never throws when getItem / setItem throw (keeps the value in memory)', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => { throw new Error('SecurityError') }) // 💥 get
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError') }) // 💥 set
    const { result } = renderHook(() => useAbLocalStorage('k6', 'init')) // 🪝
    expect(result.current[0]).toBe('init') // 🏁
    act(() => result.current[1]('mem')) // ✍️ no throw
    expect(result.current[0]).toBe('mem') // 🧠 memory fallback
    expect(readAbLocalStorage('k6')).toBeNull() // 🛟 safe read
    expect(writeAbLocalStorage('k6', 'x')).toBe(false) // 🛟 safe write
  })

  it('never throws when the localStorage getter itself throws', () => {
    const desc = Object.getOwnPropertyDescriptor(window, 'localStorage')! // 📌 keep
    Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { throw new Error('blocked') } }) // 💥
    try {
      const { result } = renderHook(() => useAbLocalStorage('k7', 1)) // 🪝
      act(() => result.current[1](2)) // ✍️
      expect(result.current[0]).toBe(2) // 🧠
    } finally {
      Object.defineProperty(window, 'localStorage', desc) // ↩️ restore
    }
  })
})
