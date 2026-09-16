'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AbUser } from './server/useAbAuth'

export interface UseAbUserResult {
  user: AbUser | null
  setUser: (user: AbUser | null) => void
  getUser: () => AbUser | null
  deleteUser: () => void
}

export interface UseAbUserParams {
  storageKey?: string
}

const AB_USER_STORAGE_KEY = 'ab_user'

const getStoredUser = (storageKey: string): AbUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbUser) : null
  } catch {
    return null
  }
}

const useAbUser = (params: UseAbUserParams = {}): UseAbUserResult => {
  const storageKey = params.storageKey ?? AB_USER_STORAGE_KEY
  const [user, setUserState] = useState<AbUser | null>(() => getStoredUser(storageKey))

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (user) {
      window.localStorage.setItem(storageKey, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(storageKey)
    }
  }, [storageKey, user])

  const setUser = useCallback((nextUser: AbUser | null) => {
    setUserState(nextUser)
  }, [])

  const getUser = useCallback((): AbUser | null => {
    return getStoredUser(storageKey)
  }, [storageKey])

  const deleteUser = useCallback(() => {
    setUserState(null)
  }, [])

  return { user, setUser, getUser, deleteUser }
}

export { useAbUser }

export default useAbUser