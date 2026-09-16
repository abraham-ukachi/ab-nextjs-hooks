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
* @name: Confetti - AB Client Hook
* @file: useAbConfetti.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the confetti hook
*    -|> import useAbConfetti from './useAbConfetti'
*    -|>
*    -|> const { pop, updateCount, updateSpread, updatePosition } = useAbConfetti()
*    -|>
*    -|> pop() // ==> burst some confetti (w/ the current settings)
*    -|>
*    -|> updateCount(100).updateSpread(120).pop() // ==> tweak & pop :)
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
import { useState } from 'react'
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




// ===== CONFETTI - TYPES & CONSTANTS ===== //


// confetti type that pops a simple, uniform burst every time
export const BASIC_CONFETTI = 'basic'


// confetti type that randomizes count, spread, position & angle on every pop
export const RANDOM_CONFETTI = 'random'


// default part of the page (element/section) where the confetti should show
export const DEFAULT_CONFETTI_PART = 'main'


// options passed down to the underlying `popConfetti` function
export interface AbConfettiOptions {
  count?: number
  spread?: number
  position?: { x?: number; y?: number }
  angle?: number
}


// signature of an external confetti popper (pops & tells if it actually fired)
export type AbPopConfetti = (options: AbConfettiOptions, part: string) => boolean


// what any confetti hook gives back: a `pop` plus a bunch of `update*` helpers
export interface AbConfettiResult {
  pop: () => boolean
  updateCount: (count: number, multiplier?: number) => AbConfettiResult
  updateSpread: (spread: number, multiplier?: number) => AbConfettiResult
  updatePosition: (position: { x?: number; y?: number }) => AbConfettiResult
}


// alias `AbConfettiResult` as `ConfettiResult`
export type ConfettiResult = AbConfettiResult




// ===== CONFETTI - HELPERS ===== //


// generate a random float within `[min, max]` (used by the random confetti type)
// TODO 1: consider a seeded RNG for deterministic tests
const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min




// ===== useAbConfetti - AB HOOK ===== //


/**
 * @name useAbConfetti
 * @description A confetti hook that pops confetti on a given part of the page, with
 * optional randomness (`'basic'` vs `'random'`), and lets you tweak the count, spread
 * & position before / after each pop
 *
 * @param { string } confettiType - The confetti style (`BASIC_CONFETTI` or `RANDOM_CONFETTI`)
 * @param { string } confettiPart - The part where the confetti shows (`'main'`, `'aside'`, ...)
 * @param { AbPopConfetti } popConfetti - The actual confetti popper; defaults to a no-op
 *
 * @returns { AbConfettiResult }
 */
const useAbConfetti = (
  confettiType: string = BASIC_CONFETTI,
  confettiPart: string = DEFAULT_CONFETTI_PART,
  popConfetti: AbPopConfetti = (): boolean => false
): AbConfettiResult => {

  // default confetti amount
  const [count, setCount] = useState<number>(50)

  // default confetti spread (in px)
  const [spread, setSpread] = useState<number>(70)

  // default confetti position (as a percentage of the viewport; slightly below center)
  const [position, setPosition] = useState<{ x?: number; y?: number }>({ y: 0.6 })

  // pop confetti once, w/ the current settings
  const pop = (): boolean => {

    // for random bursts: randomize everything a bit before popping
    if (confettiType === RANDOM_CONFETTI) {
      return popConfetti(
        {
          count: randomInRange(count, count * 2),
          spread: randomInRange(spread - 20, spread),
          position,
          angle: randomInRange(55, 125)
        },
        confettiPart
      )
    }

    // otherwise, pop a plain burst w/ the current count, spread & position
    return popConfetti({ count, spread, position }, confettiPart)
  }

  // update `count` (optionally scaled by a multiplier), then hand back the API for chaining
  const updateCount = (newCount: number, multiplier: number = 1): AbConfettiResult => {
    setCount(newCount + newCount * multiplier)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  // update `spread` (optionally scaled by a multiplier), then hand back the API for chaining
  const updateSpread = (newSpread: number, multiplier: number = 1): AbConfettiResult => {
    setSpread(newSpread + newSpread * multiplier)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  // update `position`, then hand back the API for chaining
  const updatePosition = (newPosition: { x?: number; y?: number }): AbConfettiResult => {
    setPosition(newPosition)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  // return the full confetti API: `pop`, `updateCount`, `updateSpread` & `updatePosition`
  return { pop, updateCount, updateSpread, updatePosition }

}


// export `useAbConfetti` hook as named export
export { useAbConfetti }