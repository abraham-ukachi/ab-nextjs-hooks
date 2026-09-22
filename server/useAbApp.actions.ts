'use server'

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
* @name: App - AB Server Actions
* @file: useAbApp.actions.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// NEXT.JS hooks
import { cookies } from 'next/headers'


// ===== AB APP - COOKIE CONSTANTS ===== //


// cookie name used to persist the app's 'ready' state
const COOKIE_READY = 'AB_APP_READY'

// cookie name used to persist the app's 'hello' state
const COOKIE_HELLO = 'AB_APP_HELLO'

// cookie lifetime in milliseconds (= 7 days)
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7



// ===== AB APP - SERVER ACTIONS ===== //


/**
 * @name isAppReady
 * @description A server action that reads the `AB_APP_READY` cookie and reports
 *   whether the app was marked as 'ready' or not
 *
 * @returns { Promise<boolean> }
 */
export const isAppReady = async (): Promise<boolean> => {
  let result = false

  // try reading the cookie; fall back to `false` on any failure
  try {
    const cookieStore = await cookies()
    const ready = cookieStore.get(COOKIE_READY)

    // only a literal 'true' value counts as ready
    if (ready?.value === 'true') result = true
  } catch {
    return result
  }

  // return the final 'ready' result
  return result
}

/**
 * @name toggleAppReady
 * @description A server action that toggles the app's 'ready' state, or sets it
 *   to a given state when `newReadyState` is provided
 *
 * @param { boolean? } newReadyState - Desired ready state; toggles when not provided
 *
 * @returns { Promise<boolean> }
 */
export const toggleAppReady = async (newReadyState?: boolean): Promise<boolean> => {
  let result = false

  try {
    // figure out the next state: explicit value, else invert the current one
    const ready = newReadyState !== undefined ? newReadyState : !(await isAppReady())
    const cookieStore = await cookies()

    // persist the new ready state in the cookie
    cookieStore.set(COOKIE_READY, String(ready), {
      path: '/',
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
    })

    result = ready
  } catch {
    return result
  }

  // return the ('new') ready state
  return result
}

/**
 * @name isAppHello
 * @description A server action that reads the `AB_APP_HELLO` cookie and reports
 *   whether the app was greeted / 'hello'd or not
 *
 * @returns { Promise<boolean> }
 */
export const isAppHello = async (): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()
    const hello = cookieStore.get(COOKIE_HELLO)

    // only a literal 'true' value counts as hello
    if (hello?.value === 'true') result = true
  } catch {
    return result
  }

  // return the final 'hello' result
  return result
}

/**
 * @name toggleAppHello
 * @description A server action that toggles the app's 'hello' state, or sets it
 *   to a given state when `newHelloState` is provided
 *
 * @param { boolean? } newHelloState - Desired hello state; toggles when not provided
 *
 * @returns { Promise<boolean> }
 */
export const toggleAppHello = async (newHelloState?: boolean): Promise<boolean> => {
  let result = false

  try {
    const hello = newHelloState !== undefined ? newHelloState : !(await isAppHello())
    const cookieStore = await cookies()

    // persist the new hello state in the cookie
    cookieStore.set(COOKIE_HELLO, String(hello), {
      path: '/',
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
    })

    result = hello
  } catch {
    return result
  }

  // return the ('new') hello state
  return result
}
