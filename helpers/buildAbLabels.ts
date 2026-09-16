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
* @name: Labels Builder - AB Helper
* @file: buildAbLabels.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Build a labels map out of some default keys
*    -|> import { buildAbLabels } from './helpers/buildAbLabels'
*    -|>
*    -|> const { labels, keys, getLabel } = buildAbLabels(['userName', 'first_name'])
*    -|>
*    -|> // console.log(labels.userName) // ==> "user name"
*    -|> // console.log(getLabel('first_name')) // ==> "First Name"
*    -|>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// REACT types
// REACT hooks
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
import { humanizeKey } from './humanizeKeys'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== AB LABELS - TYPES & CONSTANTS ===== //


// a generic map of labels, keyed by their machine-friendly identifiers
export type AbLabels = Record<string, string>


// the `buildAbLabels` result; exposes the built `labels`, their `keys` & a `getLabel` getter
export interface AbLabelsResult<T extends AbLabels = AbLabels> {
  labels: T
  keys: Array<string>
  getLabel: (key: string, labels?: T) => string
}




// ===== buildAbLabels - AB HOOK ===== //


/**
 * @name buildAbLabels
 * @description Builds a `labels` map out of the given `defaultKeys`, falling back to a
 * humanized version of each key (e.g. `user_id` => "User Id") when no custom label is set
 *
 * @param { Array<string> } defaultKeys - The list of label keys to build
 * @param { T? } labels - Optional custom labels that override the humanized ones
 *
 * @returns { AbLabelsResult<T> } the labels map, its keys & a `getLabel` getter
 */
const buildAbLabels = <T extends AbLabels>(defaultKeys: Array<string>, labels?: T): AbLabelsResult<T> => {
  // clone the default keys so we never mutate the caller's array
  const keys: Array<string> = [...defaultKeys]

  // create the labels result map as `result`
  const result: Record<string, string> = {}

  // loop through every key & set its label, falling back to a humanized one
  keys.forEach((key: string) => {
    // use the custom label when present, otherwise humanize the raw key
    result[key] = labels?.[key] ?? humanizeKey(key)
  })

  // create the `getLabel` getter, defaulting to the freshly built `result`
  // [4dbsmaster]: tell me about it :)
  const getLabel = (key: string, currentLabels: T = result as T): string => currentLabels[key]

  // return the `labels`, their `keys` & the `getLabel` getter
  return { labels: result as T, keys, getLabel }
}


// export `buildAbLabels` as named export
export { buildAbLabels }