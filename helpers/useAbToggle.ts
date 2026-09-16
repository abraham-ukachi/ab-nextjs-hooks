/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
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
* @name: Toggle - AB Hook
* @file: useAbToggle.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Toggle a boolean-ish value
*    -|> import useAbToggle from './helpers/useAbToggle'
*    -|>
*    -|> const [value, toggle] = useAbToggle(false)
*    -|>
*    -|> toggle(true) // ==> `value` is now `true`
*    -|> toggle() // ==> `value` is now `false` (inverted)
*    -|>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// REACT types
// REACT hooks
import { useCallback, useState } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== AB TOGGLE - TYPES & CONSTANTS ===== //


// the possible values of an ab toggle; `null` means "no value chosen yet"
export type AbToggleValue = boolean | null


// the `toggle` callback signature; takes an optional next value to set
export type AbToggleCallback = (value?: AbToggleValue) => void


// the ab toggle hook result; a `[value, toggle]` tuple, just like useState
export type UseAbToggleResult = [AbToggleValue, AbToggleCallback]




// ===== useAbToggle - AB HOOK ===== //


/**
 * @name useAbToggle
 * @description A toggle hook that manages a boolean (or null) value and exposes a
 * `toggle` callback able to set a specific value or invert the current one
 *
 * @param { AbToggleValue } initialValue - The initial toggle value, defaults to `null`
 *
 * @returns { UseAbToggleResult } a `[value, toggle]` tuple
 */
const useAbToggle = (initialValue: AbToggleValue = null): UseAbToggleResult => {
  // keep track of the current toggle `value`
  const [value, setValue] = useState<AbToggleValue>(initialValue)

  // memoize the `toggle` callback so it stays stable across re-renders
  // note: an explicit value wins; otherwise we just invert the current one
  const toggle = useCallback((newValue?: AbToggleValue): void => {
    setValue((current: AbToggleValue) => (newValue !== undefined ? newValue : !current))
  }, [])

  // return the current `value` & the stable `toggle` callback
  return [value, toggle]
}


// export `useAbToggle` hook as named export
export { useAbToggle }