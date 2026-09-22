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
* @name: Auth - AB Server Hook
* @file: useAbAuth.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Get the current user (cached in cookies)
*    -|> import useAbAuth from './useAbAuth'
*    -|>
*    -|> const { getUser, isLoggedIn, logout } = useAbAuth({ apiUrl: '...' })
*    -|>
*    -|> // await isLoggedIn() // ==> false
*    -|> // await getUser() // ==> { id: 1, email: '...', token: '...', ... }
*    -|>
*
*   2+|> // Create a user session from a token & logout later
*    -|> const { createUser, logout } = useAbAuth()
*    -|>
*    -|> // await createUser('some-user-token') // ==> true
*    -|> // await logout() // ==> true
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// AB server actions (cookie-mutating — live in a dedicated 'use server' module)
import {
  getAbUserToken,
  createAbUserByToken,
  getAbUser,
  deleteAbUser
} from './useAbAuth.actions'


// ===== AB AUTH - TYPES ===== //


// create an authenticated user interface as `AbUser`
export interface AbUser {
  id: string
  firstname: string
  lastname: string
  username: string
  email: string
  confirmed?: boolean
  blocked?: boolean
  createdAt?: string
  updatedAt?: string
  avatar?: number
  token?: string
}

// create a user (auth) error interface as `AbUserError`
export interface AbUserError {
  status: number
  name: string
  message: string
  details: object
}

// create an accepted user data type as `AbUserData` (i.e. user or `null`)
export type AbUserData = AbUser | null

// create an accepted user error data type as `AbUserErrorData` (i.e. error or `null`)
export type AbUserErrorData = AbUserError | null


// re-export server actions for callers that import them from this module
export {
  getAbUserToken,
  createAbUserByToken,
  getAbUser,
  deleteAbUser
}



// ===== AB AUTH - HOOK TYPES ===== //


// create the `useAbAuth` params interface as `AbAuthParams`
export interface AbAuthParams {
  apiUrl?: string
  fromServer?: boolean
}

// create the `useAbAuth` context interface as `AbAuthContext`
export interface AbAuthContext {
  getUser: () => Promise<AbUserData | AbUserError>
  getToken: () => Promise<string>
  isLoggedIn: () => Promise<boolean>
  createUser: (token: string, userData?: AbUserData, replaceToken?: boolean) => Promise<boolean>
  logout: () => Promise<boolean>
}



// ===== useAbAuth - AB HOOK ===== //


/**
 * @name useAbAuth
 * @description An auth hook that wraps the AB Auth server actions into a friendly,
 *   ready-to-use `AbAuthContext` (get user, token, login, logout, etc.).
 *   Sync helper — must NOT live under a file-level `'use server'` directive.
 *
 * @param { AbAuthParams? } params - Optional params; `apiUrl` & `fromServer`
 *
 * @returns { AbAuthContext }
 */
const useAbAuth = (params: AbAuthParams = {}): AbAuthContext => {

  // create a `userRequest` fn that resolves the current user via `getAbUser`
  const userRequest = (): Promise<AbUserData | AbUserError> => getAbUser(params.fromServer ?? false, params.apiUrl)
  // create a `tokenRequest` fn that reads the user token via `getAbUserToken`
  const tokenRequest = (): Promise<string> => getAbUserToken()
  // create an `isLoggedInRequest` fn that decides if a user token is present
  const isLoggedInRequest = async (): Promise<boolean> => Boolean(await getAbUserToken())

  // return the ready-made ab auth context
  return {
    getUser: userRequest,
    getToken: tokenRequest,
    isLoggedIn: isLoggedInRequest,
    createUser: (token: string, userData?: AbUserData, replaceToken?: boolean) =>
      createAbUserByToken(token, userData ?? null, replaceToken ?? true),
    logout: () => deleteAbUser()
  }

}


// export `useAbAuth` hook as named export
export { useAbAuth }


// export `useAbAuth` hook as default
export default useAbAuth
