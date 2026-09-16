import { cookies } from 'next/headers'

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

export interface AbUserError {
  status: number
  name: string
  message: string
  details: object
}

export type AbUserData = AbUser | null

export type AbUserErrorData = AbUserError | null

const TOKEN_COOKIE = 'ab_user_token'

const DATA_COOKIE = 'ab_user_data'

const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

export const getAbUserToken = async (): Promise<string> => {
  let userToken = ''

  try {
    const cookieStore = await cookies()

    if (cookieStore.has(TOKEN_COOKIE)) {
      userToken = cookieStore.get(TOKEN_COOKIE).value
    }
  } catch {
    return userToken
  }

  return userToken
}

const fetchAbUserData = async (userToken: string, apiUrl?: string): Promise<AbUserData | AbUserError> => {
  if (!apiUrl) {
    return { status: 400, name: 'Bad Request', message: 'No apiUrl provided. Pass one to useAbAuth or getAbUser', details: {} }
  }

  const meRequestUrl = `${apiUrl}/api/users/me`

  const meRequest = new Request(meRequestUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json'
    }
  })

  const meResponse = await fetch(meRequest)
  const userData = await meResponse.json()

  if ('error' in userData) {
    return userData.error
  }

  return { ...userData, token: userToken }
}

export const createAbUserByToken = async (token: string, userData: AbUserData = null, replaceToken: boolean = true): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()
    const hasToken = cookieStore.has(TOKEN_COOKIE)

    if (hasToken && !replaceToken) return result

    cookieStore.set(TOKEN_COOKIE, token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
    })

    if (userData) {
      cookieStore.set(DATA_COOKIE, JSON.stringify(userData), {
        path: '/',
        sameSite: 'strict',
        secure: true,
        expires: new Date(Date.now() + COOKIE_MAX_AGE_MS)
      })
    }

    result = true
  } catch {
    return result
  }

  return result
}

export const getAbUser = async (fromServer: boolean = false, apiUrl?: string): Promise<AbUserData | AbUserError> => {
  let userData: AbUserData = null
  let hasToken = false
  let hasUserData = false
  let userToken = ''

  try {
    const cookieStore = await cookies()

    hasToken = cookieStore.has(TOKEN_COOKIE)
    hasUserData = cookieStore.has(DATA_COOKIE)

    if (!hasToken) return userData

    userToken = cookieStore.get(TOKEN_COOKIE).value

    if (fromServer) {
      return fetchAbUserData(userToken, apiUrl)
    } else if (hasUserData) {
      userData = JSON.parse(cookieStore.get(DATA_COOKIE).value)
    }
  } catch {
    return userData
  }

  return { ...userData, token: userToken }
}

export const deleteAbUser = async (): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()

    cookieStore.delete(TOKEN_COOKIE)
    cookieStore.delete(DATA_COOKIE)

    result = true
  } catch {
    return result
  }

  return result
}

export interface AbAuthParams {
  apiUrl?: string
  fromServer?: boolean
}

export interface AbAuthContext {
  getUser: () => Promise<AbUserData | AbUserError>
  getToken: () => Promise<string>
  isLoggedIn: () => Promise<boolean>
  createUser: (token: string, userData?: AbUserData, replaceToken?: boolean) => Promise<boolean>
  logout: () => Promise<boolean>
}

const useAbAuth = (params: AbAuthParams = {}): AbAuthContext => {
  const userRequest = (): Promise<AbUserData | AbUserError> => getAbUser(params.fromServer ?? false, params.apiUrl)
  const tokenRequest = (): Promise<string> => getAbUserToken()
  const isLoggedInRequest = async (): Promise<boolean> => Boolean(await getAbUserToken())

  return {
    getUser: userRequest,
    getToken: tokenRequest,
    isLoggedIn: isLoggedInRequest,
    createUser: (token: string, userData?: AbUserData, replaceToken?: boolean) =>
      createAbUserByToken(token, userData ?? null, replaceToken ?? true),
    logout: () => deleteAbUser()
  }
}

export { useAbAuth }

export default useAbAuth