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
* @name: Colors - AB Brand Hook
* @file: useAbBrandColors.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the brand colors hook
*    -|> import useBrandColors from './useAbBrandColors'
*    -|>
*    -|> const { getBrandColor } = useBrandColors()
*    -|>
*    -|> // console.log(getBrandColor('lyd')) // ==> "#7D7F50" (primary by default)
*    -|>
*
*   2+|> // Get an accent color for a brand
*    -|> // console.log(getBrandColor('lyd', 'accent')) // ==> "#A6B796"
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
import { useMemo } from 'react'
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




// ===== BRAND COLORS - TYPES & CONSTANTS ===== //


// create a brand color value type as `AbBrandColorValue`
// note: `on_accent` = the foreground/text color to sit on top of the accent
export interface AbBrandColorValue {
  primary: string
  accent: string
  on_accent: string
}

// create a brand colors map type as `AbBrandColors` (keyed by brand name)
export type AbBrandColors = Record<string, AbBrandColorValue>

// create the possible color types for a brand as `AbBrandColorType`
export type AbBrandColorType = 'primary' | 'accent' | 'on_accent'


// create a brand colors result interface as `AbBrandColorsResult`
export interface AbBrandColorsResult {
  brandColors: AbBrandColors
  getBrandColor: (key: string, type?: AbBrandColorType, colors?: AbBrandColors) => string
}



// default brand colors for abElements' core brands
// note: every brand holds a `primary`, `accent` & `on_accent` color value
const DEFAULT_BRAND_COLORS: AbBrandColors = {

  // `lesyeuxdoux` (lyd) - olive & sage vibes
  lyd: { primary: '#7D7F50', accent: '#A6B796', on_accent: '#515b4a' },

  // `clary gray` (cg) - warm beige & golden yellow
  cg: { primary: '#BBBAB0', accent: '#F3BA00', on_accent: '#1c1504' },

  // `hexaware` / `hexaa` - soft purple & lavender
  hexaa: { primary: '#9887B2', accent: '#DFCAFF', on_accent: '#443c50' }

}




// ===== useBrandColors - AB HOOK ===== //


/**
 * @name useBrandColors
 * @description A brand colors hook that provides the abElements brand palettes
 * and a getter for fetching a specific color value by brand key & type
 *
 * @returns { AbBrandColorsResult }
 */
const useBrandColors = (): AbBrandColorsResult => {

  // memoize the default brand colors once; this map is static
  const brandColors = useMemo(() => DEFAULT_BRAND_COLORS, [])

  // create the brand color getter, defaulting to `primary` & the memoized colors
  const getBrandColor = (key: string, type: AbBrandColorType = 'primary', colors: AbBrandColors = brandColors): string => {

    // return the requested color value, or `undefined` when the key/type doesn't exist
    // TODO: add a fallback color so we always return something valid
    return colors[key]?.[type]

  }

  // return `brandColors` & `getBrandColor`
  return { brandColors, getBrandColor }

}


// export `useBrandColors` hook as named export
export { useBrandColors }


// export `useBrandColors` hook as default
export default useBrandColors