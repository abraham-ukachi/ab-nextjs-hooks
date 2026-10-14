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
* @name: useAbSwipe - Tests
* @file: __tests__/swipe.test.tsx
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
// ⚛️ React (classic JSX runtime in this package → React must be in scope)
import React, { useRef } from 'react'
// 🙊 keep the classic-runtime import alive for the linter
void React
// 🖼️ DOM renderer
import { cleanup, render } from '@testing-library/react'
// 👆 hook + pure helpers under test
import { getAbSwipeLogical, resolveAbSwipe, useAbSwipe, type UseAbSwipeOptions } from '../useAbSwipe'

// 🧹 unmount between tests (no vitest globals → RTL can't auto-cleanup)
afterEach(() => cleanup())

// 🧪 test harness: a div wired to useAbSwipe
function Harness(props: { options: UseAbSwipeOptions; dir?: string }) {
  const ref = useRef<HTMLDivElement>(null) // 🎯
  useAbSwipe(ref, props.options) // 👆
  return (
    // 📦 swipe zone
    <div ref={ref} dir={props.dir} data-testid="zone">
      {/* 🙈 ignored child (like the install box) */}
      <pre data-ab-swipe-ignore="">pnpm add …</pre>
    </div>
  )
}

// 👆 fire a full gesture (down → move → up)
function drag(el: Element, from: [number, number], to: [number, number], pointerType = 'touch') {
  const base = { pointerId: 1, isPrimary: true, pointerType, bubbles: true } // 🆔
  el.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: from[0], clientY: from[1] })) // 👇
  el.dispatchEvent(new PointerEvent('pointermove', { ...base, clientX: to[0], clientY: to[1] })) // 👉
  el.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: to[0], clientY: to[1] })) // 👆
}

describe('resolveAbSwipe (pure)', () => {
  it('accepts a 48px horizontal drag and rejects 40px slow drags', () => {
    expect(resolveAbSwipe({ dx: -48, dy: 5, dt: 400 })).toBe('left') // ✅ threshold reached
    expect(resolveAbSwipe({ dx: 60, dy: 0, dt: 400 })).toBe('right') // ✅
    expect(resolveAbSwipe({ dx: -40, dy: 0, dt: 400 })).toBeNull() // 🐢 too short + slow
  })
  it('accepts a quick flick above the minimum distance', () => {
    expect(resolveAbSwipe({ dx: -20, dy: 0, dt: 30 })).toBe('left') // ⚡ 0.66 px/ms
    expect(resolveAbSwipe({ dx: -10, dy: 0, dt: 5 })).toBeNull() // 🤏 under 16px
  })
  it('axis lock: vertical travel is ignored for axis x', () => {
    expect(resolveAbSwipe({ dx: 50, dy: 80, dt: 300 })).toBeNull() // 📜 that's a scroll
    expect(resolveAbSwipe({ dx: 5, dy: -80, dt: 300 }, { axis: 'y' })).toBe('up') // ↕️ when asked
  })
  it('maps physical to logical directions, flipped in RTL', () => {
    expect(getAbSwipeLogical('left', 'ltr')).toBe('next') // ⏭️
    expect(getAbSwipeLogical('right', 'ltr')).toBe('prev') // ⏮️
    expect(getAbSwipeLogical('left', 'rtl')).toBe('prev') // 🌍 flipped
    expect(getAbSwipeLogical('right', 'rtl')).toBe('next') // 🌍 flipped
    expect(getAbSwipeLogical('up')).toBeNull() // ↕️ no meaning
  })
})

describe('useAbSwipe (G32)', () => {
  it('calls onLeft + onNext for a left swipe', () => {
    const onLeft = vi.fn(); const onNext = vi.fn(); const onPrev = vi.fn() // 📣
    const { getByTestId } = render(<Harness {...({ options: { onLeft, onNext, onPrev } })} />) // 🖼️
    drag(getByTestId('zone'), [200, 100], [100, 104]) // 👈 100px left
    expect(onLeft).toHaveBeenCalledTimes(1) // ✅
    expect(onNext).toHaveBeenCalledTimes(1) // ✅ LTR → next
    expect(onPrev).not.toHaveBeenCalled() // 🚫
    expect(onNext.mock.calls[0][0]).toMatchObject({ direction: 'left', logical: 'next', dx: -100 }) // 📦 payload
  })

  it('flips next/prev in RTL', () => {
    const onNext = vi.fn(); const onPrev = vi.fn() // 📣
    const { getByTestId } = render(<Harness {...({ options: { onNext, onPrev, dir: 'rtl' } })} />) // 🌍
    drag(getByTestId('zone'), [200, 100], [100, 100]) // 👈
    expect(onPrev).toHaveBeenCalledTimes(1) // ✅ RTL left = prev
    expect(onNext).not.toHaveBeenCalled() // 🚫
  })

  it('ignores vertical drags, mouse drags and [data-ab-swipe-ignore] zones', () => {
    const onSwipe = vi.fn() // 📣
    const { getByTestId, container } = render(<Harness {...({ options: { onSwipe } })} />) // 🖼️
    drag(getByTestId('zone'), [100, 100], [110, 300]) // 📜 vertical scroll
    drag(getByTestId('zone'), [200, 100], [50, 100], 'mouse') // 🖱️ mouse not allowed by default
    drag(container.querySelector('pre')!, [200, 100], [50, 100]) // 🙈 started in the install box
    expect(onSwipe).not.toHaveBeenCalled() // ✅ none counted
  })

  it('accepts mouse drags when asked and can be disabled', () => {
    const onSwipe = vi.fn() // 📣
    const view = render(<Harness {...({ options: { onSwipe, pointerTypes: ['mouse'] } })} />) // 🖱️ opt-in
    drag(view.getByTestId('zone'), [200, 100], [50, 100], 'mouse') // 👈
    expect(onSwipe).toHaveBeenCalledTimes(1) // ✅
    view.rerender(<Harness {...({ options: { onSwipe, pointerTypes: ['mouse'], enabled: false } })} />) // 🔌 off
    drag(view.getByTestId('zone'), [200, 100], [50, 100], 'mouse') // 👈
    expect(onSwipe).toHaveBeenCalledTimes(1) // ✅ unchanged
  })
})
