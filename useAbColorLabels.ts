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
* @name: Labels - AB Color Hook
* @file: useAbColorLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the color labels hook
*    -|> import useColorLabels from './useAbColorLabels'
*    -|>
*    -|> const { colorLabels } = useColorLabels()
*    -|>
*    -|> // console.log(colorLabels) // ==> { "gold": "Gold", "gold_black": "Gold Black", ... }
*    -|>
*
*   2+|> // Get the hex colors behind a combined color label
*    -|> const { getHexColors } = useColorLabels()
*    -|>
*    -|> // console.log(getHexColors('gold_black')) // ==> ["#FFD700", "#000000"]
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
import { buildAbLabels } from './helpers/buildAbLabels'
// NEXT.JS components


// AB hooks
import { useAbColorHexes } from './useAbColorHexes'

// AB types
import type { AbLabels, AbLabelsResult } from './helpers/buildAbLabels'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== COLOR LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a color as `ColorLabels`
export type ColorLabels = AbLabels


// create a color labels result interface as `ColorLabelsResult`
// note: it extends the base `AbLabelsResult` and adds the hex helpers
export interface ColorLabelsResult extends AbLabelsResult<ColorLabels> {
  colorLabels: ColorLabels
  colorKeys: Array<string>
  colorHexes: Record<string, string>
  getColorLabel: (key: string, labels?: ColorLabels) => string
  getHexColors: (key: string) => Array<string>
}



// default color keys: every base color, their 2-color combos & every tortoiseshell pairing
// note: combos are snake_case ('<base>_<other>') and are split into hexes later on
// TODO: add more color combos (e.g. 'transparent_black', 'fuchsia_gray'...) as abElements grows
export const DEFAULT_COLOR_KEYS: Array<string> = [
  // --- base (single) colors ---
  'gold',
  'black',
  'silver',
  'brown',
  'blue',
  'red',
  'green',
  'purple',
  'pink',
  'yellow',
  'orange',
  'white',
  'gray',
  'transparent',
  'khaki',
  'beige',
  'fuchsia',
  'tortoiseshell-brown',
  'tortoiseshell-beige',
  'tortoiseshell-pink',

  // --- gold <-> other colors ---
  'gold_black',
  'gold_silver',
  'gold_brown',
  'gold_blue',
  'gold_red',
  'gold_green',
  'gold_purple',
  'gold_pink',
  'gold_yellow',
  'gold_orange',
  'gold_white',
  'gold_gray',
  'gold_transparent',
  'gold_khaki',
  'gold_beige',
  'gold_fuchsia',
  'gold_tortoiseshell-brown',
  'gold_tortoiseshell-beige',
  'gold_tortoiseshell-pink',

  // --- black <-> other colors ---
  'black_gold',
  'black_silver',
  'black_brown',
  'black_blue',
  'black_red',
  'black_green',
  'black_purple',
  'black_pink',
  'black_yellow',
  'black_orange',
  'black_white',
  'black_gray',
  'black_transparent',
  'black_khaki',
  'black_beige',
  'black_fuchsia',
  'black_tortoiseshell-brown',
  'black_tortoiseshell-beige',
  'black_tortoiseshell-pink',

  // --- silver <-> other colors ---
  'silver_gold',
  'silver_black',
  'silver_brown',
  'silver_blue',
  'silver_red',
  'silver_green',
  'silver_purple',
  'silver_pink',
  'silver_yellow',
  'silver_orange',
  'silver_white',
  'silver_gray',
  'silver_transparent',
  'silver_khaki',
  'silver_beige',
  'silver_fuchsia',
  'silver_tortoiseshell-brown',
  'silver_tortoiseshell-beige',
  'silver_tortoiseshell-pink',

  // --- brown <-> other colors ---
  'brown_gold',
  'brown_black',
  'brown_silver',
  'brown_blue',
  'brown_red',
  'brown_green',
  'brown_purple',
  'brown_pink',
  'brown_yellow',
  'brown_orange',
  'brown_white',
  'brown_gray',
  'brown_transparent',
  'brown_khaki',
  'brown_beige',
  'brown_fuchsia',
  'brown_tortoiseshell-brown',
  'brown_tortoiseshell-beige',
  'brown_tortoiseshell-pink',

  // --- blue <-> other colors ---
  'blue_gold',
  'blue_black',
  'blue_silver',
  'blue_brown',
  'blue_red',
  'blue_green',
  'blue_purple',
  'blue_pink',
  'blue_yellow',
  'blue_orange',
  'blue_white',
  'blue_gray',
  'blue_transparent',
  'blue_khaki',
  'blue_beige',
  'blue_fuchsia',
  'blue_tortoiseshell-brown',
  'blue_tortoiseshell-beige',
  'blue_tortoiseshell-pink',

  // --- red <-> other colors ---
  'red_gold',
  'red_black',
  'red_silver',
  'red_brown',
  'red_blue',
  'red_green',
  'red_purple',
  'red_pink',
  'red_yellow',
  'red_orange',
  'red_white',
  'red_gray',
  'red_transparent',
  'red_khaki',
  'red_beige',
  'red_fuchsia',
  'red_tortoiseshell-brown',
  'red_tortoiseshell-beige',
  'red_tortoiseshell-pink',

  // --- green <-> other colors ---
  'green_gold',
  'green_black',
  'green_silver',
  'green_brown',
  'green_blue',
  'green_red',
  'green_purple',
  'green_pink',
  'green_yellow',
  'green_orange',
  'green_white',
  'green_gray',
  'green_transparent',
  'green_khaki',
  'green_beige',
  'green_fuchsia',
  'green_tortoiseshell-brown',
  'green_tortoiseshell-beige',
  'green_tortoiseshell-pink',

  // --- purple <-> other colors ---
  'purple_gold',
  'purple_black',
  'purple_silver',
  'purple_brown',
  'purple_blue',
  'purple_red',
  'purple_green',
  'purple_pink',
  'purple_yellow',
  'purple_orange',
  'purple_white',
  'purple_gray',
  'purple_transparent',
  'purple_khaki',
  'purple_beige',
  'purple_fuchsia',
  'purple_tortoiseshell-brown',
  'purple_tortoiseshell-beige',
  'purple_tortoiseshell-pink',

  // --- pink <-> other colors ---
  'pink_gold',
  'pink_black',
  'pink_silver',
  'pink_brown',
  'pink_blue',
  'pink_red',
  'pink_green',
  'pink_purple',
  'pink_yellow',
  'pink_orange',
  'pink_white',
  'pink_gray',
  'pink_transparent',
  'pink_khaki',
  'pink_beige',
  'pink_fuchsia',
  'pink_tortoiseshell-brown',
  'pink_tortoiseshell-beige',
  'pink_tortoiseshell-pink',

  // --- yellow <-> other colors ---
  'yellow_gold',
  'yellow_black',
  'yellow_silver',
  'yellow_brown',
  'yellow_blue',
  'yellow_red',
  'yellow_green',
  'yellow_purple',
  'yellow_pink',
  'yellow_orange',
  'yellow_white',
  'yellow_gray',
  'yellow_transparent',
  'yellow_khaki',
  'yellow_beige',
  'yellow_fuchsia',
  'yellow_tortoiseshell-brown',
  'yellow_tortoiseshell-beige',
  'yellow_tortoiseshell-pink',

  // --- orange <-> other colors ---
  'orange_gold',
  'orange_black',
  'orange_silver',
  'orange_brown',
  'orange_blue',
  'orange_red',
  'orange_green',
  'orange_purple',
  'orange_pink',
  'orange_yellow',
  'orange_white',
  'orange_gray',
  'orange_transparent',
  'orange_khaki',
  'orange_beige',
  'orange_fuchsia',
  'orange_tortoiseshell-brown',
  'orange_tortoiseshell-beige',
  'orange_tortoiseshell-pink',

  // --- white <-> other colors ---
  'white_gold',
  'white_black',
  'white_silver',
  'white_brown',
  'white_blue',
  'white_red',
  'white_green',
  'white_purple',
  'white_pink',
  'white_yellow',
  'white_orange',
  'white_gray',
  'white_transparent',
  'white_khaki',
  'white_beige',
  'white_fuchsia',
  'white_tortoiseshell-brown',
  'white_tortoiseshell-beige',
  'white_tortoiseshell-pink',

  // --- gray <-> other colors ---
  'gray_gold',
  'gray_black',
  'gray_silver',
  'gray_brown',
  'gray_blue',
  'gray_red',
  'gray_green',
  'gray_purple',
  'gray_pink',
  'gray_yellow',
  'gray_orange',
  'gray_white',
  'gray_transparent',
  'gray_khaki',
  'gray_beige',
  'gray_fuchsia',
  'gray_tortoiseshell-brown',
  'gray_tortoiseshell-beige',
  'gray_tortoiseshell-pink',

  // --- transparent <-> other colors ---
  'transparent_gold',
  'transparent_black',
  'transparent_silver',
  'transparent_brown',
  'transparent_blue',
  'transparent_red',
  'transparent_green',
  'transparent_purple',
  'transparent_pink',
  'transparent_yellow',
  'transparent_orange',
  'transparent_white',
  'transparent_gray',
  'transparent_khaki',
  'transparent_beige',
  'transparent_fuchsia',
  'transparent_tortoiseshell-brown',
  'transparent_tortoiseshell-beige',
  'transparent_tortoiseshell-pink',

  // --- khaki <-> other colors ---
  'khaki_gold',
  'khaki_black',
  'khaki_silver',
  'khaki_brown',
  'khaki_blue',
  'khaki_red',
  'khaki_green',
  'khaki_purple',
  'khaki_pink',
  'khaki_yellow',
  'khaki_orange',
  'khaki_white',
  'khaki_gray',
  'khaki_transparent',
  'khaki_beige',
  'khaki_fuchsia',
  'khaki_tortoiseshell-brown',
  'khaki_tortoiseshell-beige',
  'khaki_tortoiseshell-pink',

  // --- beige <-> other colors ---
  'beige_gold',
  'beige_black',
  'beige_silver',
  'beige_brown',
  'beige_blue',
  'beige_red',
  'beige_green',
  'beige_purple',
  'beige_pink',
  'beige_yellow',
  'beige_orange',
  'beige_white',
  'beige_gray',
  'beige_transparent',
  'beige_khaki',
  'beige_fuchsia',
  'beige_tortoiseshell-brown',
  'beige_tortoiseshell-beige',
  'beige_tortoiseshell-pink',

  // --- fuchsia <-> other colors ---
  'fuchsia_gold',
  'fuchsia_black',
  'fuchsia_silver',
  'fuchsia_brown',
  'fuchsia_blue',
  'fuchsia_red',
  'fuchsia_green',
  'fuchsia_purple',
  'fuchsia_pink',
  'fuchsia_yellow',
  'fuchsia_orange',
  'fuchsia_white',
  'fuchsia_gray',
  'fuchsia_transparent',
  'fuchsia_khaki',
  'fuchsia_beige',
  'fuchsia_tortoiseshell-brown',
  'fuchsia_tortoiseshell-beige',
  'fuchsia_tortoiseshell-pink',

  // --- tortoiseshell-brown <-> other colors ---
  'tortoiseshell-brown_beige',
  'tortoiseshell-brown_fuchsia',
  'tortoiseshell-brown_khaki',
  'tortoiseshell-brown_transparent',
  'tortoiseshell-brown_gray',
  'tortoiseshell-brown_white',
  'tortoiseshell-brown_orange',
  'tortoiseshell-brown_yellow',
  'tortoiseshell-brown_pink',
  'tortoiseshell-brown_purple',
  'tortoiseshell-brown_green',
  'tortoiseshell-brown_red',
  'tortoiseshell-brown_blue',
  'tortoiseshell-brown_brown',
  'tortoiseshell-brown_silver',
  'tortoiseshell-brown_black',
  'tortoiseshell-brown_gold',

  // --- tortoiseshell-gray <-> other colors ---
  'tortoiseshell-gray_beige',
  'tortoiseshell-gray_fuchsia',
  'tortoiseshell-gray_khaki',
  'tortoiseshell-gray_transparent',
  'tortoiseshell-gray_gray',
  'tortoiseshell-gray_white',
  'tortoiseshell-gray_orange',
  'tortoiseshell-gray_yellow',
  'tortoiseshell-gray_pink',
  'tortoiseshell-gray_purple',
  'tortoiseshell-gray_green',
  'tortoiseshell-gray_red',
  'tortoiseshell-gray_blue',
  'tortoiseshell-gray_brown',
  'tortoiseshell-gray_silver',
  'tortoiseshell-gray_black',
  'tortoiseshell-gray_gold',

  // --- tortoiseshell-white <-> other colors ---
  'tortoiseshell-white_beige',
  'tortoiseshell-white_fuchsia',
  'tortoiseshell-white_khaki',
  'tortoiseshell-white_transparent',
  'tortoiseshell-white_gray',
  'tortoiseshell-white_orange',
  'tortoiseshell-white_yellow',
  'tortoiseshell-white_pink',
  'tortoiseshell-white_purple',
  'tortoiseshell-white_green',
  'tortoiseshell-white_red',
  'tortoiseshell-white_blue',
  'tortoiseshell-white_brown',
  'tortoiseshell-white_silver',
  'tortoiseshell-white_black',
  'tortoiseshell-white_gold',

  // --- tortoiseshell-pink <-> other colors ---
  'tortoiseshell-pink_beige',
  'tortoiseshell-pink_fuchsia',
  'tortoiseshell-pink_khaki',
  'tortoiseshell-pink_transparent',
  'tortoiseshell-pink_gray',
  'tortoiseshell-pink_white',
  'tortoiseshell-pink_orange',
  'tortoiseshell-pink_yellow',
  'tortoiseshell-pink_pink',
  'tortoiseshell-pink_purple',
  'tortoiseshell-pink_green',
  'tortoiseshell-pink_red',
  'tortoiseshell-pink_blue',
  'tortoiseshell-pink_brown',
  'tortoiseshell-pink_silver',
  'tortoiseshell-pink_black',
  'tortoiseshell-pink_gold'

]




// ===== useColorLabels - AB HOOK ===== //


/**
 * @name useColorLabels
 * @description A color labels hook that builds a map of label keys for every color &
 * color combination, and exposes the matching hex colors via `useAbColorHexes`
 *
 * @param { Array<string> } defaultColorKeys - The default color keys to use
 * @param { ColorLabels? } labels - Custom color labels to override the humanized ones
 *
 * @returns { ColorLabelsResult }
 */
const useColorLabels = (defaultColorKeys: Array<string> = DEFAULT_COLOR_KEYS, labels?: ColorLabels): ColorLabelsResult => {

  // get the base color hexes & their fetcher from the dedicated hex hook
  const { colorHexes, getHexColors } = useAbColorHexes()

  // build the color labels via memoization, only when keys, labels or hex helpers change
  return useMemo(() => {

    // create the color labels result as `result`
    const result = buildAbLabels<ColorLabels>(defaultColorKeys, labels)

    // return the spread `result` along with `colorLabels`, `colorKeys`, `colorHexes`,
    // `getColorLabel` & `getHexColors`
    return {
      ...result,
      colorLabels: result.labels,
      colorKeys: result.keys,
      colorHexes,
      getColorLabel: result.getLabel,
      getHexColors
    }

  }, [defaultColorKeys, labels, colorHexes, getHexColors])

}


// export `useColorLabels` hook as named export
export { useColorLabels }


// export `useColorLabels` hook as default
export default useColorLabels
