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
* @name: Auth Request - AB Client Hook
* @file: useAbAuthRequest.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // login an existing user
*    -|> import useAuthRequest from './useAbAuthRequest'
*    -|>
*    -|> const { login } = useAuthRequest()
*    -|>
*    -|> // await login({ identifier: 'abraham@laplateforme.io', password: '...' })
*    -|>
*
*   2+|> // register a brand new user
*    -|> const { register } = useAuthRequest()
*    -|>
*    -|> // await register({ firstname: 'Abraham', lastname: 'Ukachi', ... })
*    -|>
*
*   3+|> // reset a forgotten password
*    -|> const { forgotPassword, resetPassword } = useAuthRequest()
*    -|>
*    -|> // await forgotPassword({ email: 'abraham@laplateforme.io' })
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
import { useCallback, useMemo, useState } from 'react'
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








// ===== AUTH REQUEST - TYPES & CONSTANTS ===== //


// params needed to register a new user, as `RegisterParams`
export interface RegisterParams {
  firstname: string
  lastname: string
  username: string
  email: string
  password: string
}


// params needed to login an existing user, as `LoginParams`
export interface LoginParams {
  identifier: string
  password: string
}


// params needed to logout the current session, as `LogoutParams`
export interface LogoutParams {
  redirectUrl: string
}


// params needed to request a password reset link, as `ForgotPasswordParams`
export interface ForgotPasswordParams {
  email: string
}


// params needed to actually reset the password w/ a code, as `ResetPasswordParams`
export interface ResetPasswordParams {
  password: string
  passwordConfirmation: string
  code: string
}


// create a register payload alias from `RegisterParams`
export type RegisterPayload = RegisterParams


// create a login payload alias from `LoginParams`
export type LoginPayload = LoginParams


// create a forgot-password payload alias from `ForgotPasswordParams`
export type ForgotPasswordPayload = ForgotPasswordParams


// create a reset-password payload alias from `ResetPasswordParams`
export type ResetPasswordPayload = ResetPasswordParams


// union of every auth param, so we can prefill defaults on the hook itself
// create `UseAuthRequestParams` as everything (or `null`)
export type UseAuthRequestParams = (RegisterParams & LoginParams & ForgotPasswordParams & ResetPasswordParams) | null


// create the lightweight user data shape as `AbUserData`
// note: these mirror the Strapi `users-permissions` user fields
export interface AbUserData {
  id?: number
  email?: string
  username?: string
  firstname?: string
  lastname?: string
  token?: string
}


// create a login success response as `LoginSuccessResponse`
export type LoginSuccessResponse = {
  jwt: string
  user: AbUserData
}


// create a login failed response as `LoginFailedResponse`
export type LoginFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}


// create a register success response as `RegisterSuccessResponse`
export type RegisterSuccessResponse = {
  jwt: string
  user: AbUserData
}


// create a register failed response as `RegisterFailedResponse`
export type RegisterFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}


// create a forgot-password success response as `ForgotPasswordSuccessResponse`
export type ForgotPasswordSuccessResponse = {
  ok: boolean
}


// create a forgot-password failed response as `ForgotPasswordFailedResponse`
export type ForgotPasswordFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}


// create a reset-password success response as `ResetPasswordSuccessResponse`
export type ResetPasswordSuccessResponse = {
  jwt: string
  user: AbUserData
}


// create a reset-password failed response as `ResetPasswordFailedResponse`
export type ResetPasswordFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}


// create a logout response as `LogoutResponse`
export type LogoutResponse = {
  ok: boolean
  message: string
}


// create the hook result interface as `UseAuthRequestResponse`
export type UseAuthRequestResponse = {
  isFetching: boolean
  login: (params?: LoginParams | null) => Promise<LoginSuccessResponse | LoginFailedResponse>
  register: (params?: RegisterParams | null) => Promise<RegisterSuccessResponse | RegisterFailedResponse>
  forgotPassword: (params?: ForgotPasswordParams | null) => Promise<ForgotPasswordSuccessResponse | ForgotPasswordFailedResponse>
  resetPassword: (params?: ResetPasswordParams | null) => Promise<ResetPasswordSuccessResponse | ResetPasswordFailedResponse>
  logout: (params?: LogoutParams | null) => Promise<LogoutResponse>
}


// ===== AB AUTH ENDPOINTS ===== //


// the auth endpoints we hit on the Strapi backend
// log a user in via the `/local` provider
const AB_AUTH_ENDPOINTS = {
  login: 'api/auth/local',
  // register a new user via the `/local/register` provider
  register: 'api/auth/local/register',
  // ask the server to email a password reset link
  forgotPassword: 'api/auth/forgot-password',
  // actually reset the password w/ the emailed code
  resetPassword: 'api/auth/reset-password'
}








// ===== useAuthRequest - AB HOOK ===== //


/**
 * @name useAuthRequest
 * @description A client-side auth hook that logs in, registers, resets passwords
 * and logs out via Strapi's `/api/auth` endpoints
 *
 * @param { UseAuthRequestParams } params - Prefilled auth params to fall back on
 * @param { string } apiUrl - The base API url to hit, empty by default
 *
 * @returns { UseAuthRequestResponse }
 */
const useAuthRequest = (params: UseAuthRequestParams = null, apiUrl: string = ''): UseAuthRequestResponse => {

  // keep a flag that tells the UI when a request is in flight
  const [isFetching, setIsFetching] = useState(false)


  // memoize the full request urls, so they only rebuild when `apiUrl` changes
  const loginRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.login}`, [apiUrl])
  const registerRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.register}`, [apiUrl])
  const forgotPasswordRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.forgotPassword}`, [apiUrl])
  const resetPasswordRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.resetPassword}`, [apiUrl])


  // build the `login` callback
  const login = useCallback(
    async (loginParams: LoginParams | null = null): Promise<LoginSuccessResponse | LoginFailedResponse> => {
      // return a promise so the caller can `await` the outcome
      return new Promise(async (resolve, reject) => {
        // signal the UI that we're fetching
        setIsFetching(true)


        // merge the passed values with the prefilled params
        const payload: LoginPayload = {
          identifier: (loginParams?.identifier || params?.identifier) ?? '',
          password: (loginParams?.password || params?.password) ?? ''
        }

        // create the POST request to the login endpoint
        const request = new Request(loginRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        // fire the request & handle the outcome
        try {
          const response = await fetch(request)
          const responseData = await response.json()

          // done fetching
          setIsFetching(false)


          // resolve `responseData` on success...
          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            // ...or reject it on failure, so `AbRequestError`-ish
            // handling can happen on the caller's side
            reject(responseData)
          }
        } catch (error) {
          // note: network errors surface as plain `AbRequestError`s here
          reject(error)
        }
      })
    },
    [loginRequestUrl, params?.identifier, params?.password]
  )


  // build the `register` callback
  const register = useCallback(
    async (registerParams: RegisterParams | null = null): Promise<RegisterSuccessResponse | RegisterFailedResponse> => {
      // return a promise so the caller can `await` the outcome
      return new Promise(async (resolve, reject) => {
        // signal the UI that we're fetching
        setIsFetching(true)


        // merge the passed values with the prefilled params
        const payload: RegisterPayload = {
          firstname: (registerParams?.firstname || params?.firstname) ?? '',
          lastname: (registerParams?.lastname || params?.lastname) ?? '',
          username: (registerParams?.username || params?.username) ?? '',
          email: (registerParams?.email || params?.email) ?? '',
          password: (registerParams?.password || params?.password) ?? ''
        }

        // create the POST request to the register endpoint
        const request = new Request(registerRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        // fire the request & handle the outcome
        try {
          const response = await fetch(request)
          const responseData = await response.json()

          // done fetching
          setIsFetching(false)


          // resolve `responseData` on success...
          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            // ...or reject it on failure
            reject(responseData)
          }
        } catch (error) {
          // note: network errors surface as plain `AbRequestError`s here
          reject(error)
        }
      })
    },
    [registerRequestUrl, params?.firstname, params?.lastname, params?.username, params?.email, params?.password]
  )


  // build the `forgotPassword` callback
  const forgotPassword = useCallback(
    async (forgotPasswordParams: ForgotPasswordParams | null = null): Promise<ForgotPasswordSuccessResponse | ForgotPasswordFailedResponse> => {
      // return a promise so the caller can `await` the outcome
      return new Promise(async (resolve, reject) => {
        // signal the UI that we're fetching
        setIsFetching(true)


        // merge the passed email w/ the prefilled one
        const payload: ForgotPasswordPayload = {
          email: (forgotPasswordParams?.email || params?.email) ?? ''
        }

        // create the POST request to the forgot-password endpoint
        const request = new Request(forgotPasswordRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        // fire the request & handle the outcome
        try {
          const response = await fetch(request)
          const responseData = await response.json()

          // done fetching
          setIsFetching(false)


          // resolve `responseData` when the request succeeds
          if (response.ok) {
            resolve(responseData)
          } else {
            // ...or reject it on failure
            reject(responseData)
          }
        } catch (error) {
          // note: network errors surface as plain `AbRequestError`s here
          reject(error)
        }
      })
    },
    [forgotPasswordRequestUrl, params?.email]
  )


  // build the `resetPassword` callback
  const resetPassword = useCallback(
    async (resetPasswordParams: ResetPasswordParams | null = null): Promise<ResetPasswordSuccessResponse | ResetPasswordFailedResponse> => {
      // return a promise so the caller can `await` the outcome
      return new Promise(async (resolve, reject) => {
        // signal the UI that we're fetching
        setIsFetching(true)


        // merge the passed values w/ the prefilled ones
        const payload: ResetPasswordPayload = {
          password: (resetPasswordParams?.password || params?.password) ?? '',
          passwordConfirmation: (resetPasswordParams?.passwordConfirmation || params?.passwordConfirmation) ?? '',
          code: (resetPasswordParams?.code || params?.code) ?? ''
        }

        // create the POST request to the reset-password endpoint
        const request = new Request(resetPasswordRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        // fire the request & handle the outcome
        try {
          const response = await fetch(request)
          const responseData = await response.json()

          // done fetching
          setIsFetching(false)


          // resolve `responseData` on success...
          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            // ...or reject it on failure
            reject(responseData)
          }
        } catch (error) {
          // note: network errors surface as plain `AbRequestError`s here
          reject(error)
        }
      })
    },
    [resetPasswordRequestUrl, params?.password, params?.passwordConfirmation, params?.code]
  )


  // build the `logout` callback
  // [4dbsmaster]: tell me about it :) — no backend roundtrip, pure client-side
  const logout = useCallback(async (): Promise<LogoutResponse> => {
    // resolve immediately, since logging out is just a local affair
    return new Promise((resolve) => {
      setIsFetching(true)

      try {
        resolve({ ok: true, message: 'Logged out successfully' })
      } finally {
        // always flip `isFetching` off, whatever happens
        setIsFetching(false)
      }
    })
  }, [])


  // return `isFetching`, `login`, `register`, `forgotPassword`, `resetPassword` & `logout`
  return {
    isFetching,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout
  }
}


// export `useAuthRequest` hook as named export
export { useAuthRequest }


// export `useAuthRequest` hook as default
export default useAuthRequest