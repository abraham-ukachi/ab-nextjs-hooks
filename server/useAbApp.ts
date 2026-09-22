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


// AB server actions (cookie-mutating — live in a dedicated 'use server' module)
import {
  isAppReady,
  isAppHello,
  toggleAppReady,
  toggleAppHello
} from './useAbApp.actions'


// ===== AB APP - TYPES ===== //


// create the ab app context interface as `AbAppContext`
export interface AbAppContext {
  isReady: () => Promise<boolean>
  isHello: () => Promise<boolean>
  toggleReady: (newState?: boolean) => Promise<boolean>
  toggleHello: (newState?: boolean) => Promise<boolean>
}


// re-export server actions for callers that import them from this module
export {
  isAppReady,
  isAppHello,
  toggleAppReady,
  toggleAppHello
}



// ===== useAbApp - AB HOOK ===== //


/**
 * @name useAbApp
 * @description An app hook that wraps the AB App server actions into a friendly,
 *   ready-to-use `AbAppContext` (ready & hello states, each readable & toggleable).
 *   Sync helper — must NOT live under a file-level `'use server'` directive.
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
