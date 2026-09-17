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
* @name: App - AB Server Hook
* @file: useAbApp.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Check if the app is ready, then toggle it
*    -|> import useAbApp from './useAbApp'
*    -|>
*    -|> const { isReady, toggleReady } = useAbApp()
*    -|>
*    -|> // await isReady() // ==> false
*    -|> // await toggleReady(true) // ==> true
*    -|>
*
*   2+|> // Wave hello to the app (and toggle it back)
*    -|> const { isHello, toggleHello } = useAbApp()
*    -|>
*    -|> // await toggleHello(true) // ==> true
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
import { cookies } from 'next/headers'
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components



// ===== AB APP - TYPES & CONSTANTS ===== //


// create the ab app context interface as `AbAppContext`
export interface AbAppContext {
  isReady: () => Promise<boolean>
  isHello: () => Promise<boolean>
  toggleReady: (newState?: boolean) => Promise<boolean>
  toggleHello: (newState?: boolean) => Promise<boolean>
}

// --- COOKIE CONSTANTS ---

// cookie name used to persist the app's 'ready' state
const COOKIE_READY = 'AB_APP_READY'

// cookie name used to persist the app's 'hello' state
const COOKIE_HELLO = 'AB_APP_HELLO'

// cookie lifetime in milliseconds (= 7 days)
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7



// ===== AB APP - SERVER ACTIONS ===== //


// check if the app is 'ready', by reading the `AB_APP_READY` cookie
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

// toggle (or force-set) the app's 'ready' state, via the `AB_APP_READY` cookie
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

// check if the app has 'hello'd, by reading the `AB_APP_HELLO` cookie
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

// toggle (or force-set) the app's 'hello' state, via the `AB_APP_HELLO` cookie
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



// ===== useAbApp - AB HOOK ===== //


/**
 * @name useAbApp
 * @description An app hook that wraps the AB App server actions into a friendly,
 *   ready-to-use `AbAppContext` (ready & hello states, each readable & toggleable)
 *
 * @returns { AbAppContext }
 */
const useAbApp = (): AbAppContext => {

  // return the ready-made ab app context
  return {
    isReady: () => isAppReady(),
    isHello: () => isAppHello(),
    toggleReady: (newState?: boolean) => toggleAppReady(newState),
    toggleHello: (newState?: boolean) => toggleAppHello(newState)
  }

}


// export `useAbApp` hook as named export
export { useAbApp }


// export `useAbApp` hook as default
export default useAbApp