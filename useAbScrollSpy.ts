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
* @name: useAbScrollSpy (G46)
* @file: useAbScrollSpy.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const activeId = useAbScrollSpy(['overview', 'install', 'packages'], { rootMargin: '-64px 0px -60% 0px' })
*    -|> <AbToc items={items} activeId={activeId} />
*    -|> scrollToAbSection('install') // ♿ smooth, or instant under reduced motion
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks
import { useEffect, useRef, useState } from 'react'
// ♿ one-shot reduced-motion check (same query as useAbReducedMotion)
import { prefersAbReducedMotionNow } from './useAbReducedMotion'

/** 🎛️ Options for {@link useAbScrollSpy}. */
export interface UseAbScrollSpyOptions {
  /** 📏 IntersectionObserver rootMargin (e.g. `'-64px 0px -60% 0px'` for a sticky 64px app bar). */
  rootMargin?: string
  /** 🎚️ IntersectionObserver threshold (default `0`). */
  threshold?: number | number[]
  /** 🪟 scroll container (default: the viewport). */
  root?: Element | null
  /** 🔌 turn the spy off without unmounting (default `true`). */
  enabled?: boolean
  /** 🧭 id to report before anything intersects (default: the first id). */
  initialId?: string | null
}

/** 📏 Default margin: ignore the top 64px (sticky app bar) and the bottom 60% (so the section near the top wins). */
export const AB_SCROLL_SPY_ROOT_MARGIN = '-64px 0px -60% 0px'

/**
 * 🔭 useAbScrollSpy — which section of the page is "current" for an "On this page" TOC.
 *
 * - 👀 One IntersectionObserver watches every id; the **first id in document order** that is visible wins.
 * - 📌 When nothing is visible (between two long sections) the last active id is kept, so the rail never blinks.
 * - 🖥️ SSR / no IntersectionObserver: returns `initialId` (default the first id) and never throws.
 */
export function useAbScrollSpy(ids: readonly string[], options: UseAbScrollSpyOptions = {}): string | null {
  // 🎛️ options with defaults
  const { rootMargin = AB_SCROLL_SPY_ROOT_MARGIN, threshold = 0, root = null, enabled = true, initialId } = options
  // 🧭 current id (seeded so the first paint already marks something)
  const [activeId, setActiveId] = useState<string | null>(initialId !== undefined ? initialId : (ids[0] ?? null))
  // 👁️ ids that are on screen right now
  const visible = useRef<Set<string>>(new Set())
  // 🔑 a stable dependency for the id list (arrays are new on every render)
  const key = ids.join('\u0000')

  useEffect(() => {
    // 🚫 off, SSR-like envs or old browsers: keep the seeded value
    if (!enabled || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return
    visible.current = new Set() // 🧹 fresh set per id list
    // 👀 one observer for all sections
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id // 🆔
        if (entry.isIntersecting) visible.current.add(id) // ➕ came in
        else visible.current.delete(id) // ➖ went out
      }
      // 🥇 first visible id in the order the caller gave (= document order for a TOC)
      const first = ids.find((id) => visible.current.has(id))
      if (first) setActiveId(first) // 📌 otherwise keep the last one
    }, { root, rootMargin, threshold })
    // 🔗 observe every element that exists (missing ids are skipped, not errors)
    for (const id of ids) {
      const el = document.getElementById(id) // 🔎
      if (el) observer.observe(el) // 👁️
    }
    return () => observer.disconnect() // 🧹
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for `ids`
  }, [key, enabled, root, rootMargin, String(threshold)])

  return activeId // 🎯
}

/** 🎛️ Options for {@link scrollToAbSection}. */
export interface ScrollToAbSectionOptions {
  /** 📏 pixels to leave above the section (e.g. the sticky app bar height). Default `0`. */
  offset?: number
  /** 🔗 also update the URL hash with `history.replaceState` (no jump). Default `true`. */
  updateHash?: boolean
}

/**
 * 🧭 scrollToAbSection — scrolls to `#id`, **smoothly unless the user prefers reduced motion** (then instant).
 * Returns `false` when the element doesn't exist (or on the server).
 */
export function scrollToAbSection(id: string, options: ScrollToAbSectionOptions = {}): boolean {
  if (typeof document === 'undefined') return false // 🖥️ SSR
  const el = document.getElementById(id) // 🔎
  if (!el) return false // 🚫 unknown id
  const { offset = 0, updateHash = true } = options // 🎛️
  const top = el.getBoundingClientRect().top + window.scrollY - offset // 📏 absolute target
  // ♿ smooth only when motion is welcome
  window.scrollTo({ top, behavior: prefersAbReducedMotionNow() ? 'auto' : 'smooth' })
  if (updateHash && typeof history !== 'undefined') history.replaceState(null, '', `#${id}`) // 🔗
  return true // ✅
}

// 📦 default export
export default useAbScrollSpy
