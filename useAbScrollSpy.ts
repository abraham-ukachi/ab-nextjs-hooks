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
*    -|> // 📏 core 0.1.6 panes: the page never scrolls, so spy on the main pane
*    -|> const { mainScrollElement } = useAbPage(); useAbScrollSpy(ids, { root: mainScrollElement }); scrollToAbSection('install', { container: mainScrollElement })
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
  /** 🪟 scroll container (default: the viewport). With core 0.1.6 panes pass `useAbPage().mainScrollElement` (G55). */
  root?: Element | null
  /** 🔚 at the bottom of the root the **last** id wins, even if it can't reach the top (default `true`). */
  lastAtBottom?: boolean
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
 * - 🔚 When the root (or the page) is scrolled to the bottom, the last id wins: short last sections still light up.
 * - 🖥️ SSR / no IntersectionObserver: returns `initialId` (default the first id) and never throws.
 */
export function useAbScrollSpy(ids: readonly string[], options: UseAbScrollSpyOptions = {}): string | null {
  // 🎛️ options with defaults
  const { rootMargin = AB_SCROLL_SPY_ROOT_MARGIN, threshold = 0, root = null, enabled = true, initialId, lastAtBottom = true } = options
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
    // 🔚 is the scroller at its bottom? (1px slack for sub-pixel layouts)
    const atBottom = (): boolean => {
      if (!lastAtBottom || ids.length === 0) return false
      if (root) return root.scrollHeight > root.clientHeight && root.scrollTop + root.clientHeight >= root.scrollHeight - 1 // 📜 pane
      const d = document.documentElement // 🪟 page
      return d.scrollHeight > window.innerHeight && window.scrollY + window.innerHeight >= d.scrollHeight - 1
    }
    // 🥇 pick: last id at the bottom, else the first visible id (else keep the last one)
    const pick = (): void => {
      const last = ids[ids.length - 1]
      if (atBottom() && last && document.getElementById(last)) { setActiveId(last); return } // 🔚
      const first = ids.find((id) => visible.current.has(id)) // 🥇 caller order = document order
      if (first) setActiveId(first) // 📌 otherwise keep the last one
    }
    // 👀 one observer for all sections
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id // 🆔
        if (entry.isIntersecting) visible.current.add(id) // ➕ came in
        else visible.current.delete(id) // ➖ went out
      }
      pick() // 🥇
    }, { root, rootMargin, threshold })
    // 🔚 the bottom isn't an intersection change, so listen to the scroller too (passive)
    const target: EventTarget = root ?? window
    target.addEventListener('scroll', pick, { passive: true })
    // 🔗 observe every element that exists (missing ids are skipped, not errors)
    for (const id of ids) {
      const el = document.getElementById(id) // 🔎
      if (el) observer.observe(el) // 👁️
    }
    return () => { observer.disconnect(); target.removeEventListener('scroll', pick) } // 🧹
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for `ids`
  }, [key, enabled, root, rootMargin, String(threshold), lastAtBottom])

  return activeId // 🎯
}

/** 🎛️ Options for {@link scrollToAbSection}. */
export interface ScrollToAbSectionOptions {
  /** 📏 pixels to leave above the section (e.g. the sticky app bar height). Default `0`. */
  offset?: number
  /** 📜 the scroll container (e.g. `useAbPage().mainScrollElement`, the panes main, G55). Default: the window. */
  container?: Element | null
  /** @deprecated 0.1.7: use `container` (same thing; kept as an alias). */
  root?: Element | null
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
  const root = options.container ?? options.root ?? null // 📜 `container` wins over the old `root`
  const behavior: ScrollBehavior = prefersAbReducedMotionNow() ? 'auto' : 'smooth' // ♿ smooth only when motion is welcome
  if (root) {
    // 📜 custom scroll container (e.g. the core panes main): scroll IT, not the window
    const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset // 📏 inside root
    root.scrollTo({ top, behavior })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset // 📏 absolute target
    window.scrollTo({ top, behavior })
  }
  if (updateHash && typeof history !== 'undefined') history.replaceState(null, '', `#${id}`) // 🔗
  return true // ✅
}

// 📦 default export
export default useAbScrollSpy
