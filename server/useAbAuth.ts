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



// ===== AB AUTH - TYPES & CONSTANTS ===== //


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

// --- COOKIE CONSTANTS ---

// cookie name used to persist the user token
const TOKEN_COOKIE = 'ab_user_token'

// cookie name used to persist (a cached copy of) the user data
const DATA_COOKIE = 'ab_user_data'

// cookie lifetime in milliseconds (= 7 days)
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7



// ===== AB AUTH - SERVER ACTIONS ===== //


// read the current user token, via the `ab_user_token` cookie
/**
 * @name getAbUserToken
 * @description A server action that reads & returns the current user token from
 *   the `ab_user_token` cookie (or an empty string when there's none)
 *
 * @returns { Promise<string> }
 */
export const getAbUserToken = async (): Promise<string> => {
  let userToken = ''

  try {
    const cookieStore = await cookies()

    // only grab the value when the token cookie actually exists
    if (cookieStore.has(TOKEN_COOKIE)) {
      userToken = cookieStore.get(TOKEN_COOKIE)?.value ?? ''
    }
  } catch {
    return userToken
  }

  // return the (may-be-empty) user token
  return userToken
}

// fetch a fresh copy of the user data from the API, using the given token
/**
 * @name fetchAbUserData
 * @description Fetches the current user data straight from the API's `/api/users/me`
 *   endpoint; returns an `AbUserError` when the request goes sideways
 *
 * @param { string } userToken - The bearer token used to authenticate the request
 * @param { string? } apiUrl - The API base URL; required, else returns a 400 error
 *
 * @returns { Promise<AbUserData | AbUserError> }
 */
const fetchAbUserData = async (userToken: string, apiUrl?: string): Promise<AbUserData | AbUserError> => {
  // no `apiUrl`? bail out with a 400 'Bad Request' error
  if (!apiUrl) {
    return { status: 400, name: 'Bad Request', message: 'No apiUrl provided. Pass one to useAbAuth or getAbUser', details: {} }
  }

  // craft the `/api/users/me` request URL
  const meRequestUrl = `${apiUrl}/api/users/me`

  // build the 'me' request, with the user token as bearer auth
  const meRequest = new Request(meRequestUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json'
    }
  })

  // send the request & parse the response JSON
  const meResponse = await fetch(meRequest)
  const userData = await meResponse.json()

  // hmm, an error came back -> return it as-is
  if ('error' in userData) {
    return userData.error
  }

  // all good -> return the user data, with the token attached
  return { ...userData, token: userToken }
}

// create a logged-in user session, by persisting the given token (and cached data)
/**
 * @name createAbUserByToken
 * @description A server action that stores a user token (and optionally a cached
 *   copy of the user data) in cookies, creating a logged-in user session
 *
 * @param { string } token - The user token to persist
 * @param { AbUserData? } userData - Optional user data to cache in a cookie
 * @param { boolean? } replaceToken - Replace an existing token? (default: true)
 *
 * @returns { Promise<boolean> }
 */
export const createAbUserByToken = async (token: string, userData: AbUserData = null, replaceToken: boolean = true): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()
    const hasToken = cookieStore.has(TOKEN_COOKIE)

    // an existing token is the boss unless we're allowed to replace it
    if (hasToken && !replaceToken) return result

    // persist the new token
    cookieStore.set(TOKEN_COOKIE, token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
    })

    // persist (a cached copy of) the user data, when provided
    // cache user on the server only (httpOnly) — never expose full user JSON to JS
    if (userData) {
      const safeUser = { ...userData }
      delete (safeUser as { token?: string }).token
      cookieStore.set(DATA_COOKIE, JSON.stringify(safeUser), {
        path: '/',
        sameSite: 'strict',
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
      })
    }

    result = true
  } catch {
    return result
  }

  // return whether the session was created
  return result
}

// resolve the current user, from cookies or (fresh) from the API
/**
 * @name getAbUser
 * @description A server action that resolves the current user, either from a
 *   cached cookie or (when `fromServer` is true) straight from the API
 *
 * @param { boolean? } fromServer - Fetch fresh user data from the API? (default: false)
 * @param { string? } apiUrl - The API base URL to hit when `fromServer` is true
 *
 * @returns { Promise<AbUserData | AbUserError> }
 */
export const getAbUser = async (fromServer: boolean = false, apiUrl?: string): Promise<AbUserData | AbUserError> => {
  let userData: AbUserData = null
  let hasToken = false
  let hasUserData = false
  let userToken = ''

  try {
    const cookieStore = await cookies()

    hasToken = cookieStore.has(TOKEN_COOKIE)
    hasUserData = cookieStore.has(DATA_COOKIE)

    // no token, no party
    if (!hasToken) return userData

    userToken = cookieStore.get(TOKEN_COOKIE)?.value ?? ''

    // fetch fresh user data from the API, or fall back to the cached copy
    if (fromServer) {
      return fetchAbUserData(userToken, apiUrl)
    } else if (hasUserData) {
      const dataCookie = cookieStore.get(DATA_COOKIE)
      if (dataCookie?.value) {
        userData = JSON.parse(dataCookie.value) as AbUserData
      }
    }
  } catch {
    return userData
  }

  // return the user data, with the token attached
  if (!userData) return userData
  return { ...userData, token: userToken }
}

// log the user out, by deleting the token & cached user data cookies
/**
 * @name deleteAbUser
 * @description A server action that logs the user out by deleting the user token
 *   & cached user data cookies
 *
 * @returns { Promise<boolean> }
 */
export const deleteAbUser = async (): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()

    // wipe both the token & user-data cookies
    cookieStore.delete(TOKEN_COOKIE)
    cookieStore.delete(DATA_COOKIE)

    result = true
  } catch {
    return result
  }

  // return whether the logout succeeded
  return result
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
 *   ready-to-use `AbAuthContext` (get user, token, login, logout, etc.)
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