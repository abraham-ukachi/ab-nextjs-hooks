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
* @name: useAbReducedMotion (G32)
* @file: useAbReducedMotion.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> const reduced = useAbReducedMotion()
*    -|> const duration = reduced ? 0 : 280 // ♿ no slide, instant cross-fade
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// 📐 the generic media-query hook (same subscription + SSR rules)
import { matchAbMedia, useAbMedia } from './useAbMedia'

// ♿ the standard reduced-motion media query (same string as ab-nextjs-animations' AB_FADE_REDUCED_MOTION_QUERY)
export const AB_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// 📸 one-shot check outside React (false on the server)
export function prefersAbReducedMotionNow(): boolean {
  // 🔍 read the query once
  return matchAbMedia(AB_REDUCED_MOTION_QUERY, false)
}

/**
 * ♿ useAbReducedMotion — `true` when the user asked the OS/browser to reduce motion.
 *
 * - 🔁 Live: flips as soon as the OS setting changes (no reload).
 * - 🖥️ SSR / hydration value is `false` → pair it with a CSS `@media (prefers-reduced-motion: reduce)`
 *   rule so the very first paint is already calm.
 */
export function useAbReducedMotion(): boolean {
  // 📐 subscribe to the reduced-motion query
  return useAbMedia(AB_REDUCED_MOTION_QUERY)
}

// 📦 default export
export default useAbReducedMotion
