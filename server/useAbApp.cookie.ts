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
* @name: App - Cookie lifetime helpers (G11)
* @file: server/useAbApp.cookie.ts
* @type: TypeScript (server-safe, sync)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> toggleAppHello(true, { maxAge: AB_APP_COOKIE_MAX_AGE.oneYear }) // 🍪 Welcome v6: remember 'seen' for 1 year
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// ⚠️ No 'use server' here on purpose: a 'use server' file may only export async
//    functions, and these are sync values/helpers shared by the actions + tests.

// ⏱️ handy lifetimes, in SECONDS (the cookie `Max-Age` unit)
export const AB_APP_COOKIE_MAX_AGE = {
  oneWeek: 60 * 60 * 24 * 7, // 📅 7 days, the historical default
  oneYear: 60 * 60 * 24 * 365, // 🗓️ 365 days, what Welcome v6 uses
} as const

// 🧭 default lifetime when a caller passes nothing (unchanged = non-breaking)
export const AB_APP_COOKIE_DEFAULT_MAX_AGE = AB_APP_COOKIE_MAX_AGE.oneWeek

// ⚙️ options accepted by toggleAppReady / toggleAppHello
export interface AbAppCookieOptions {
  // ⏱️ cookie lifetime in seconds; must be a finite number > 0, else the default is used
  maxAge?: number
}

/**
 * @name resolveAbAppCookieMaxAge
 * @description Turn the caller's `maxAge` into a safe whole number of seconds.
 * @param { AbAppCookieOptions | undefined } options - caller options
 * @returns { number } seconds
 */
export function resolveAbAppCookieMaxAge(options?: AbAppCookieOptions): number {
  const raw = options?.maxAge // 🔍 what the caller asked for
  // 🧯 reject NaN / Infinity / ≤ 0 / non-numbers (server actions receive untrusted input)
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return AB_APP_COOKIE_DEFAULT_MAX_AGE
  return Math.floor(raw) // ✂️ Max-Age is an integer
}
