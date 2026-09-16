import { cookies } from 'next/headers'

export interface AbAppContext {
  isReady: () => Promise<boolean>
  isHello: () => Promise<boolean>
  toggleReady: (newState?: boolean) => Promise<boolean>
  toggleHello: (newState?: boolean) => Promise<boolean>
}

const COOKIE_READY = 'AB_APP_READY'

const COOKIE_HELLO = 'AB_APP_HELLO'

const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

export const isAppReady = async (): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()
    const ready = cookieStore.get(COOKIE_READY)

    if (ready?.value === 'true') result = true
  } catch {
    return result
  }

  return result
}

export const toggleAppReady = async (newReadyState?: boolean): Promise<boolean> => {
  let result = false

  try {
    const ready = newReadyState !== undefined ? newReadyState : !(await isAppReady())
    const cookieStore = await cookies()

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

  return result
}

export const isAppHello = async (): Promise<boolean> => {
  let result = false

  try {
    const cookieStore = await cookies()
    const hello = cookieStore.get(COOKIE_HELLO)

    if (hello?.value === 'true') result = true
  } catch {
    return result
  }

  return result
}

export const toggleAppHello = async (newHelloState?: boolean): Promise<boolean> => {
  let result = false

  try {
    const hello = newHelloState !== undefined ? newHelloState : !(await isAppHello())
    const cookieStore = await cookies()

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

  return result
}

const useAbApp = (): AbAppContext => {
  return {
    isReady: () => isAppReady(),
    isHello: () => isAppHello(),
    toggleReady: (newState?: boolean) => toggleAppReady(newState),
    toggleHello: (newState?: boolean) => toggleAppHello(newState)
  }
}

export { useAbApp }

export default useAbApp