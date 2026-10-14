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
* @name: useAbClipboard - Tests
* @file: __tests__/clipboard.test.ts
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
// 📋 hook under test
import { copyAbText, useAbClipboard } from '../useAbClipboard'

// 💾 the real clipboard descriptor (restored after each test)
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

// 🎭 install a fake navigator.clipboard
function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } }) // 📋
}

// 🧹 restore everything
afterEach(() => {
  vi.useRealTimers() // ⏱️
  vi.restoreAllMocks() // 🧽
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard) // ♻️
})

describe('useAbClipboard (G10)', () => {
  it('copies, flips `copied`, then resets after the delay', async () => {
    vi.useFakeTimers() // ⏱️ control time
    const writeText = vi.fn(async () => {}) // 📋 succeeds
    mockClipboard(writeText) // 🎭
    const { result } = renderHook(() => useAbClipboard({ resetAfter: 1500 })) // 🪝
    let ok = false // 📦
    await act(async () => { ok = await result.current.copy('pnpm add ab-nextjs-core') }) // 📋
    expect(ok).toBe(true) // ✅ resolved true
    expect(writeText).toHaveBeenCalledWith('pnpm add ab-nextjs-core') // ✅ exact text
    expect(result.current.copied).toBe(true) // ✅ flag on
    act(() => { vi.advanceTimersByTime(1500) }) // ⏩
    expect(result.current.copied).toBe(false) // 🔁 flag off
  })

  it('reports failures without throwing', async () => {
    mockClipboard(async () => { throw new Error('NotAllowedError') }) // 💥 denied
    // 🧓 legacy fallback also fails
    ;(document as unknown as { execCommand: () => boolean }).execCommand = () => false
    const { result } = renderHook(() => useAbClipboard()) // 🪝
    let ok = true // 📦
    await act(async () => { ok = await result.current.copy('x') }) // 📋
    expect(ok).toBe(false) // ❎
    expect(result.current.copied).toBe(false) // ❎
    expect(result.current.error).toBeInstanceOf(Error) // 💥 surfaced
  })

  it('falls back to execCommand when the Clipboard API is missing', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }) // 🚫 no API
    const exec = vi.fn(() => true) // 🧓 fallback works
    ;(document as unknown as { execCommand: typeof exec }).execCommand = exec
    await expect(copyAbText('hello')).resolves.toBe(true) // ✅
    expect(exec).toHaveBeenCalledWith('copy') // ✅ used the legacy path
    expect(document.querySelector('textarea')).toBeNull() // 🧹 temp textarea removed
  })

  it('reset() clears the flag right away', async () => {
    mockClipboard(async () => {}) // ✅
    const { result } = renderHook(() => useAbClipboard({ resetAfter: 0 })) // 🪝 never auto-reset
    await act(async () => { await result.current.copy('y') }) // 📋
    expect(result.current.copied).toBe(true) // ✅
    act(() => result.current.reset()) // 🧹
    expect(result.current.copied).toBe(false) // ✅
  })
})
