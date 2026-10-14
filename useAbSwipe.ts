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
* @name: useAbSwipe (G32)
* @file: useAbSwipe.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const ref = useRef<HTMLDivElement>(null)
*    -|> useAbSwipe(ref, { onNext: next, onPrev: prev, threshold: 48 }) // + CSS touch-action: pan-y
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks + types
import { useEffect, useRef, type RefObject } from 'react'

// 🧭 physical swipe directions
export type AbSwipeDirection = 'left' | 'right' | 'up' | 'down'
// 🔁 logical (reading-order aware) directions
export type AbSwipeLogical = 'next' | 'prev'
// 📏 which axis we care about
export type AbSwipeAxis = 'x' | 'y' | 'both'
// 🖱️ pointer kinds that may swipe
export type AbSwipePointerType = 'touch' | 'pen' | 'mouse'

// 🙈 drags that START inside an element matching this selector are ignored (install box, sliders…)
export const AB_SWIPE_IGNORE_SELECTOR = '[data-ab-swipe-ignore]'
// 📏 default distance threshold in px (brief: 48px)
export const AB_SWIPE_THRESHOLD = 48
// ⚡ default flick velocity in px/ms (a fast short flick also counts)
export const AB_SWIPE_VELOCITY = 0.35
// 🤏 a flick still needs at least this many px (avoids accidental taps)
export const AB_SWIPE_MIN_FLICK = 16
// 🔒 px of movement before the axis is locked
export const AB_SWIPE_LOCK_THRESHOLD = 8

// 📦 what every callback receives
export interface AbSwipeEvent {
  // 🧭 physical direction
  direction: AbSwipeDirection
  // 🔁 logical direction for horizontal swipes (null for vertical ones)
  logical: AbSwipeLogical | null
  // ↔️ horizontal travel in px (negative = left)
  dx: number
  // ↕️ vertical travel in px (negative = up)
  dy: number
  // ⚡ speed along the main axis in px/ms
  velocity: number
  // 🖱️ which pointer did it
  pointerType: string
}

// ⚙️ options
export interface UseAbSwipeOptions {
  // ⬅️ finger moved left
  onLeft?: (event: AbSwipeEvent) => void
  // ➡️ finger moved right
  onRight?: (event: AbSwipeEvent) => void
  // ⬆️ finger moved up (only when axis is 'y' or 'both')
  onUp?: (event: AbSwipeEvent) => void
  // ⬇️ finger moved down (only when axis is 'y' or 'both')
  onDown?: (event: AbSwipeEvent) => void
  // ⏭️ go forward in reading order (LTR: swipe left · RTL: swipe right)
  onNext?: (event: AbSwipeEvent) => void
  // ⏮️ go back in reading order (LTR: swipe right · RTL: swipe left)
  onPrev?: (event: AbSwipeEvent) => void
  // 📣 any recognised swipe
  onSwipe?: (event: AbSwipeEvent) => void
  // 📏 distance threshold in px (default 48)
  threshold?: number
  // ⚡ flick velocity in px/ms (default 0.35)
  velocity?: number
  // 🤏 minimum flick distance in px (default 16)
  minFlickDistance?: number
  // 📐 axis to track (default 'x': vertical drags are left to page scrolling)
  axis?: AbSwipeAxis
  // 🖱️ pointer types that may swipe (default touch + pen; add 'mouse' for desktop drags)
  pointerTypes?: AbSwipePointerType[]
  // 🙈 CSS selector of drag-start zones to ignore (default `[data-ab-swipe-ignore]`)
  ignore?: string
  // 🌍 text direction for onNext/onPrev ('auto' = computed `direction` of the element)
  dir?: 'ltr' | 'rtl' | 'auto'
  // 🔌 turn the whole thing off
  enabled?: boolean
}

// 📏 the numeric thresholds used by resolveAbSwipe
export interface AbSwipeThresholds {
  threshold?: number
  velocity?: number
  minFlickDistance?: number
  axis?: AbSwipeAxis
}

/**
 * 🧮 resolveAbSwipe — pure decision: was this gesture a swipe, and which way?
 * Returns null for taps, slow short drags and off-axis movement.
 */
export function resolveAbSwipe(
  move: { dx: number; dy: number; dt: number }, // 📦 travel + duration (ms)
  options: AbSwipeThresholds = {}, // ⚙️ thresholds
): AbSwipeDirection | null {
  // ⚙️ resolve defaults
  const threshold = options.threshold ?? AB_SWIPE_THRESHOLD
  const velocity = options.velocity ?? AB_SWIPE_VELOCITY
  const minFlick = options.minFlickDistance ?? AB_SWIPE_MIN_FLICK
  const axis = options.axis ?? 'x'
  // 📏 absolute travel per axis
  const ax = Math.abs(move.dx)
  const ay = Math.abs(move.dy)
  // 🧭 dominant axis of THIS gesture
  const horizontal = ax > ay
  // 🚫 off-axis gestures don't count
  if (axis === 'x' && !horizontal) return null
  if (axis === 'y' && horizontal) return null
  // 📏 distance along the dominant axis
  const distance = horizontal ? ax : ay
  // ⚡ speed (guard against dt = 0)
  const speed = distance / Math.max(move.dt, 1)
  // ✅ long enough, or a quick flick that moved a little
  const accepted = distance >= threshold || (speed >= velocity && distance >= minFlick)
  // 🚫 too small
  if (!accepted) return null
  // 🧭 physical direction from the sign
  if (horizontal) return move.dx < 0 ? 'left' : 'right'
  return move.dy < 0 ? 'up' : 'down'
}

// 🔁 map a physical direction to reading order (vertical → null)
export function getAbSwipeLogical(direction: AbSwipeDirection, dir: 'ltr' | 'rtl' = 'ltr'): AbSwipeLogical | null {
  // ↕️ vertical swipes have no reading-order meaning
  if (direction === 'up' || direction === 'down') return null
  // ⬅️ in LTR, content moves left to reveal the NEXT item (flipped in RTL)
  const forward = dir === 'rtl' ? 'right' : 'left'
  // 🔁 next / prev
  return direction === forward ? 'next' : 'prev'
}

// 🌍 read the element's text direction (computed, so `dir` on any ancestor counts)
function readAbDirection(element: Element): 'ltr' | 'rtl' {
  try {
    // 🎨 computed style respects inherited dir="rtl"
    return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr'
  } catch {
    return 'ltr' // 🛟 default
  }
}

/**
 * 👆 useAbSwipe — recognise horizontal (or vertical) swipes on an element with Pointer Events.
 *
 * - 🔒 Axis lock: once the finger moves 8px, the gesture is locked to its axis; a vertical drag
 *   on an `axis: 'x'` swipe is abandoned so the page can scroll.
 * - 🙈 Drags that start inside `[data-ab-swipe-ignore]` (or your `ignore` selector) are skipped.
 * - 🌍 `onNext` / `onPrev` follow the text direction (RTL flips them).
 * - 📱 Set `touch-action: pan-y` on the element (for `axis: 'x'`) so the browser keeps vertical scrolling
 *   but lets you handle horizontal moves.
 * - ♿ A swipe must never be the only way: always offer buttons too.
 */
export function useAbSwipe<T extends HTMLElement>(ref: RefObject<T | null>, options: UseAbSwipeOptions = {}): void {
  // 🧷 latest options (handlers can change every render without re-binding listeners)
  const latest = useRef(options)
  // 🔄 keep it fresh after every commit
  useEffect(() => { latest.current = options })

  // 🔌 the only thing that re-binds listeners: on/off
  const enabled = options.enabled ?? true

  useEffect(() => {
    // 🎯 the element
    const element = ref.current
    // 🚫 nothing to bind / disabled
    if (!element || !enabled) return

    // 🧠 gesture state
    let active = false // 👆 tracking a gesture?
    let pointerId = -1 // 🆔 which pointer
    let startX = 0 // ↔️ start x
    let startY = 0 // ↕️ start y
    let startT = 0 // ⏱️ start time
    let locked: 'x' | 'y' | null = null // 🔒 locked axis
    let pointerType = '' // 🖱️ kind

    // 🧹 forget the current gesture
    const stop = () => { active = false; pointerId = -1; locked = null }

    // 👇 a finger / pen touched down
    const onDown = (event: PointerEvent) => {
      const opts = latest.current // ⚙️
      if (!event.isPrimary) return // ✌️ ignore multi-touch extras
      const allowed = opts.pointerTypes ?? ['touch', 'pen'] // 🖱️ allowed kinds
      if (!allowed.includes(event.pointerType as AbSwipePointerType)) return // 🚫 e.g. mouse
      const target = event.target as Element | null // 🎯 where it started
      if (target?.closest?.(opts.ignore ?? AB_SWIPE_IGNORE_SELECTOR)) return // 🙈 ignored zone
      active = true // ✅ start tracking
      pointerId = event.pointerId // 🆔
      startX = event.clientX // ↔️
      startY = event.clientY // ↕️
      startT = event.timeStamp || Date.now() // ⏱️
      locked = null // 🔓
      pointerType = event.pointerType // 🖱️
    }

    // 👉 moving
    const onMove = (event: PointerEvent) => {
      if (!active || event.pointerId !== pointerId || locked) return // 🚫 not ours / already locked
      const dx = event.clientX - startX // ↔️
      const dy = event.clientY - startY // ↕️
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AB_SWIPE_LOCK_THRESHOLD) return // 🤏 too early to tell
      locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y' // 🔒 decide the axis once
      const axis = latest.current.axis ?? 'x' // 📐 wanted axis
      if ((axis === 'x' && locked === 'y') || (axis === 'y' && locked === 'x')) stop() // 📜 let the page scroll
    }

    // 👆 lifted
    const onUp = (event: PointerEvent) => {
      if (!active || event.pointerId !== pointerId) return // 🚫 not ours
      const opts = latest.current // ⚙️
      const dx = event.clientX - startX // ↔️
      const dy = event.clientY - startY // ↕️
      const dt = (event.timeStamp || Date.now()) - startT // ⏱️
      stop() // 🧹 gesture over
      // 🧮 decide
      const direction = resolveAbSwipe({ dx, dy, dt }, opts)
      if (!direction) return // 🚫 not a swipe
      // 🌍 reading direction
      const dir = opts.dir && opts.dir !== 'auto' ? opts.dir : readAbDirection(element)
      // 🔁 logical meaning
      const logical = getAbSwipeLogical(direction, dir)
      // ⚡ speed along the main axis
      const distance = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy)
      // 📦 event payload
      const swipe: AbSwipeEvent = { direction, logical, dx, dy, velocity: distance / Math.max(dt, 1), pointerType }
      // 📣 physical callbacks
      if (direction === 'left') opts.onLeft?.(swipe)
      if (direction === 'right') opts.onRight?.(swipe)
      if (direction === 'up') opts.onUp?.(swipe)
      if (direction === 'down') opts.onDown?.(swipe)
      // 🔁 logical callbacks
      if (logical === 'next') opts.onNext?.(swipe)
      if (logical === 'prev') opts.onPrev?.(swipe)
      // 📣 catch-all
      opts.onSwipe?.(swipe)
    }

    // 🛑 the browser took over (scrolling, alert…) → drop the gesture
    const onCancel = (event: PointerEvent) => { if (event.pointerId === pointerId) stop() }

    // 👂 bind (passive: we never call preventDefault → scrolling stays smooth)
    element.addEventListener('pointerdown', onDown, { passive: true })
    element.addEventListener('pointermove', onMove, { passive: true })
    element.addEventListener('pointerup', onUp, { passive: true })
    element.addEventListener('pointercancel', onCancel, { passive: true })
    // 🧹 unbind
    return () => {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onCancel)
    }
  }, [ref, enabled])
}

// 📦 default export
export default useAbSwipe
