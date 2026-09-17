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
* @name: Theme - AB Client Hook
* @file: useAbTheme.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the theme hook (keeps theme in `localStorage`)
*    -|> import useAbTheme from './useAbTheme'
*    -|>
*    -|> const [theme, updateTheme] = useAbTheme('dark')
*    -|>
*    -|> updateTheme('dark') // ==> saves "dark" + sets `body[data-theme="dark"]`
*
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


'use client'


// REACT types
// REACT hooks
import { useEffect, useState } from 'react'
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




// ===== THEME - TYPES & CONSTANTS ===== //


// default theme to use when nothing is saved in `localStorage` yet
export const DEFAULT_AB_THEME = 'light'


// shape of the hook result as a tuple: `[theme, updateTheme]`
export type AbThemeResult = [string, (theme: string) => void]


// describe the `useAbTheme` hook signature as `AbThemeInterface`
export interface AbThemeInterface {
  (initialTheme?: string): AbThemeResult
}




// ===== useAbTheme - AB HOOK ===== //


/**
 * @name useAbTheme
 * @description A theme hook that reads the saved theme from `localStorage`, keeps it
 * in state, and persists it (along with `body[data-theme]`) whenever it changes
 *
 * @param { string } initialTheme - The fallback theme used when nothing is stored yet
 *
 * @returns { AbThemeResult }
 */
const useAbTheme: AbThemeInterface = (initialTheme: string = DEFAULT_AB_THEME): AbThemeResult => {

  // note: grab the saved theme once, on the client, before the very first render
  if (typeof window !== 'undefined') {
    initialTheme = window.localStorage.getItem('abTheme') ?? initialTheme
  }

  // create the `theme` state, seeded with `initialTheme` (or the saved one)
  const [theme, setTheme] = useState(initialTheme)

  // persist theme changes: save to `localStorage` & stamp it on the document body
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem('abTheme', theme)
    window.document.body.dataset.theme = theme

  }, [theme])

  // create `updateTheme` as a wrapper over `setTheme`
  const updateTheme = (theme: string): void => {
    setTheme(theme)
  }

  // return the `theme` value & its `updateTheme` setter
  return [theme, updateTheme]

}


// export `useAbTheme` hook as named export
export { useAbTheme }