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
* @name: Key Humanizer - AB Helper
* @file: humanizeKeys.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Humanize a machine-friendly key
*    -|> import { humanizeKey } from './helpers/humanizeKeys'
*    -|>
*    -|> // console.log(humanizeKey('userFirstName')) // ==> "User First Name"
*    -|> // console.log(humanizeKey('first_name')) // ==> "First Name"
*    -|> // console.log(humanizeKey('user-id')) // ==> "User Id"
*    -|>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// ===== KEY HUMANIZER - AB HELPER ===== //


/**
 * @name humanizeKey
 * @description Converts a machine-friendly key (`userFirstName`, `user_first_name` or
 * `user-first-name`) into a readable, title-cased label like "User First Name"
 *
 * @param { string } key - The raw key to humanize
 *
 * @returns { string } the humanized, title-cased label
 */
const humanizeKey = (key: string): string => {
  // split the key into words, handling camelCase, snake_case & kebab-case
  // TODO: also handle `dot.case` & `slash/case` separators
  const words = key
    // 1. separate camelCase boundaries into their own words
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // 2. turn snake_case & kebab-case separators into plain spaces
    .replace(/[-_]/g, ' ')
    // 3. collapse any repeated/extra whitespace into a single space
    .replace(/\s+/g, ' ')
    .trim()
    // 4. split into a list of individual `words`
    .split(' ')

  // capitalize the first letter of each word & join them back together
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}


// export `humanizeKey` as named export
export { humanizeKey }