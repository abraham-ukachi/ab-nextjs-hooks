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
* @name: Labels - AB Bridge Hook
* @file: useAbBridgeLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use bridge labels hook
*    -|> import useBridgeLabels from './useAbBridgeLabels'
*    -|>
*    -|> const { bridgeLabels } = useBridgeLabels()
*    -|>
*    -|> // console.log(bridgeLabels) // ==> { "saddleBridge": "Saddle Bridge", ... }
*    -|>
*
*   2+|> // Get a bridge label
*    -|> const { getBridgeLabel } = useBridgeLabels()
*    -|>
*    -|> // console.log(getBridgeLabel('keyholeBridge')) // ==> "Keyhole Bridge"
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


// AB types
import type { AbLabels } from './helpers/buildAbLabels'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== BRIDGE LABELS - TYPES & CONSTANTS ===== //


// create a set of label types for a bridge as `BridgeLabels`
export type BridgeLabels = AbLabels


// create a bridge labels result interface as `BridgeLabelsResult`
export interface BridgeLabelsResult {
  bridgeLabels: BridgeLabels
  bridgeKeys: Array<string>
  getBridgeLabel: (key: string, labels?: BridgeLabels) => string
}


// default bridge keys
// TODO: add more bridge keys (e.g. 'floatingBridge', 'deepCurvedBridge')
export const DEFAULT_BRIDGE_KEYS: Array<string> = [

  // base bridge fits
  'adjustableNosePads',
  'saddleBridge',
  'keyholeBridge',
  'doubleBridge',
  'singleBridge',
  'doubleNoseBridge',
  'tripleBridge',

  // single-style nose combos
  'saddleNoseBridge',
  'keyholeNoseBridge',

  // double combos
  'doubleKeyholeBridge',
  'doubleSaddleBridge',
  'doubleKeyholeNoseBridge',
  'doubleSaddleNoseBridge',

  // triple combos
  'tripleKeyholeBridge',
  'tripleSaddleBridge',
  'tripleKeyholeNoseBridge',
  'tripleSaddleNoseBridge'

]




// ===== useBridgeLabels - AB HOOK ===== //


/**
 * @name useBridgeLabels
 * @description A bridge labels hook that builds a map of label keys for an eyewear bridge
 *
 * @param { Array<string> } defaultBridgeKeys - The default bridge keys to use
 * @param { BridgeLabels? } labels - Custom bridge labels to override the humanized ones
 *
 * @returns { BridgeLabelsResult }
 */
const useBridgeLabels = (
  defaultBridgeKeys: Array<string> = DEFAULT_BRIDGE_KEYS,
  labels?: BridgeLabels
): BridgeLabelsResult => {

  // build the bridge labels via memoization, only when keys or labels change
  return useMemo(() => {

    // create the bridge labels result as `result`
    const result = buildAbLabels<BridgeLabels>(defaultBridgeKeys, labels)

    // return `bridgeLabels`, `bridgeKeys` & `getBridgeLabel`
    return {
      bridgeLabels: result.labels,
      bridgeKeys: result.keys,
      getBridgeLabel: result.getLabel
    }

  }, [defaultBridgeKeys, labels])

}


// export `useBridgeLabels` hook as named export
export { useBridgeLabels }


// export `useBridgeLabels` hook as default
export default useBridgeLabels