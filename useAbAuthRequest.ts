'use client'

import { useCallback, useMemo, useState } from 'react'

export interface RegisterParams {
  firstname: string
  lastname: string
  username: string
  email: string
  password: string
}

export interface LoginParams {
  identifier: string
  password: string
}

export interface LogoutParams {
  redirectUrl: string
}

export interface ForgotPasswordParams {
  email: string
}

export interface ResetPasswordParams {
  password: string
  passwordConfirmation: string
  code: string
}

export type RegisterPayload = RegisterParams

export type LoginPayload = LoginParams

export type ForgotPasswordPayload = ForgotPasswordParams

export type ResetPasswordPayload = ResetPasswordParams

export type UseAuthRequestParams = (RegisterParams & LoginParams & ForgotPasswordParams & ResetPasswordParams) | null

export interface AbUserData {
  id?: number
  email?: string
  username?: string
  firstname?: string
  lastname?: string
  token?: string
}

export type LoginSuccessResponse = {
  jwt: string
  user: AbUserData
}

export type LoginFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}

export type RegisterSuccessResponse = {
  jwt: string
  user: AbUserData
}

export type RegisterFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}

export type ForgotPasswordSuccessResponse = {
  ok: boolean
}

export type ForgotPasswordFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}

export type ResetPasswordSuccessResponse = {
  jwt: string
  user: AbUserData
}

export type ResetPasswordFailedResponse = {
  data: object
  error: { status: number; name: string; message: string; details: object }
}

export type LogoutResponse = {
  ok: boolean
  message: string
}

export type UseAuthRequestResponse = {
  isFetching: boolean
  login: (params?: LoginParams | null) => Promise<LoginSuccessResponse | LoginFailedResponse>
  register: (params?: RegisterParams | null) => Promise<RegisterSuccessResponse | RegisterFailedResponse>
  forgotPassword: (params?: ForgotPasswordParams | null) => Promise<ForgotPasswordSuccessResponse | ForgotPasswordFailedResponse>
  resetPassword: (params?: ResetPasswordParams | null) => Promise<ResetPasswordSuccessResponse | ResetPasswordFailedResponse>
  logout: (params?: LogoutParams | null) => Promise<LogoutResponse>
}

const AB_AUTH_ENDPOINTS = {
  login: 'api/auth/local',
  register: 'api/auth/local/register',
  forgotPassword: 'api/auth/forgot-password',
  resetPassword: 'api/auth/reset-password'
}

const useAuthRequest = (params: UseAuthRequestParams = null, apiUrl: string = ''): UseAuthRequestResponse => {
  const [isFetching, setIsFetching] = useState(false)

  const loginRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.login}`, [apiUrl])
  const registerRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.register}`, [apiUrl])
  const forgotPasswordRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.forgotPassword}`, [apiUrl])
  const resetPasswordRequestUrl = useMemo(() => `${apiUrl}/${AB_AUTH_ENDPOINTS.resetPassword}`, [apiUrl])

  const login = useCallback(
    async ({ identifier, password }: LoginParams = null): Promise<LoginSuccessResponse | LoginFailedResponse> => {
      return new Promise(async (resolve, reject) => {
        setIsFetching(true)

        const payload: LoginPayload = {
          identifier: identifier || params?.identifier,
          password: password || params?.password
        }

        const request = new Request(loginRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        try {
          const response = await fetch(request)
          const responseData = await response.json()

          setIsFetching(false)

          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            reject(responseData)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    [loginRequestUrl, params?.identifier, params?.password]
  )

  const register = useCallback(
    async ({
      firstname,
      lastname,
      username,
      email,
      password
    }: RegisterParams = null): Promise<RegisterSuccessResponse | RegisterFailedResponse> => {
      return new Promise(async (resolve, reject) => {
        setIsFetching(true)

        const payload: RegisterPayload = {
          firstname: firstname || params?.firstname,
          lastname: lastname || params?.lastname,
          username: username || params?.username,
          email: email || params?.email,
          password: password || params?.password
        }

        const request = new Request(registerRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        try {
          const response = await fetch(request)
          const responseData = await response.json()

          setIsFetching(false)

          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            reject(responseData)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    [registerRequestUrl, params?.firstname, params?.lastname, params?.username, params?.email, params?.password]
  )

  const forgotPassword = useCallback(
    async ({ email }: ForgotPasswordParams = null): Promise<ForgotPasswordSuccessResponse | ForgotPasswordFailedResponse> => {
      return new Promise(async (resolve, reject) => {
        setIsFetching(true)

        const payload: ForgotPasswordPayload = {
          email: email || params?.email
        }

        const request = new Request(forgotPasswordRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        try {
          const response = await fetch(request)
          const responseData = await response.json()

          setIsFetching(false)

          if (response.ok) {
            resolve(responseData)
          } else {
            reject(responseData)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    [forgotPasswordRequestUrl, params?.email]
  )

  const resetPassword = useCallback(
    async ({
      password,
      passwordConfirmation,
      code
    }: ResetPasswordParams = null): Promise<ResetPasswordSuccessResponse | ResetPasswordFailedResponse> => {
      return new Promise(async (resolve, reject) => {
        setIsFetching(true)

        const payload: ResetPasswordPayload = {
          password: password || params?.password,
          passwordConfirmation: passwordConfirmation || params?.passwordConfirmation,
          code: code || params?.code
        }

        const request = new Request(resetPasswordRequestUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        try {
          const response = await fetch(request)
          const responseData = await response.json()

          setIsFetching(false)

          if (response.ok || response.status === 200) {
            resolve(responseData)
          } else {
            reject(responseData)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    [resetPasswordRequestUrl, params?.password, params?.passwordConfirmation, params?.code]
  )

  const logout = useCallback(async (): Promise<LogoutResponse> => {
    return new Promise((resolve) => {
      setIsFetching(true)

      try {
        resolve({ ok: true, message: 'Logged out successfully' })
      } finally {
        setIsFetching(false)
      }
    })
  }, [])

  return {
    isFetching,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout
  }
}

export { useAuthRequest }

export default useAuthRequest