/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
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
* @name: User - AB Client Hook
* @file: useAbUser.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // keep the signed-in user in localStorage
*    -|> import useAbUser from './useAbUser'
*    -|>
*    -|> const { user } = useAbUser()
*    -|>
*    -|> // console.log(user) // ==> { email: 'abraham@laplateforme.io', ... }
*    -|>
*
*   2+|> // swap the user & persist it under the `ab_user` key
*    -|> const { setUser } = useAbUser()
*    -|>
*    -|> // setUser({ email: 'abraham@laplateforme.io', ... })
*    -|>
*
*   3+|> // clear the stored user entirely
*    -|> const { deleteUser } = useAbUser()
*    -|>
*    -|> // deleteUser()
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
import { useCallback, useEffect, useState } from 'react'
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
import type { AbUser } from './server/useAbAuth'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components








// ===== AB USER - TYPES & CONSTANTS ===== //


// create the hook result interface as `UseAbUserResult`
export interface UseAbUserResult {
  user: AbUser | null
  setUser: (user: AbUser | null) => void
  getUser: () => AbUser | null
  deleteUser: () => void
}


// create the hook params interface as `UseAbUserParams`
export interface UseAbUserParams {
  storageKey?: string
}


// the default localStorage key used to persist the user
const AB_USER_STORAGE_KEY = 'ab_user'


// read the stored user out of localStorage, safely
const getStoredUser = (storageKey: string): AbUser | null => {
  // guard against SSR — no `window` on the server
  if (typeof window === 'undefined') return null

  // try to parse the raw JSON, fall back to `null` on any tampering
  try {
    const raw = window.localStorage.getItem(storageKey)

    return raw ? (JSON.parse(raw) as AbUser) : null
  } catch {
    // note: corrupted JSON or missing key rolls back to a `null` user
    return null
  }
}








// ===== useAbUser - AB HOOK ===== //


/**
 * @name useAbUser
 * @description A client-side localStorage user hook that persists the signed-in
 * `AbUser` under the `ab_user` key
 *
 * @param { UseAbUserParams } params - Custom params; `storageKey` overrides the default key
 *
 * @returns { UseAbUserResult }
 */
const useAbUser = (params: UseAbUserParams = {}): UseAbUserResult => {
  // honor a custom storage key when given, else fall back to `ab_user`
  const storageKey = params.storageKey ?? AB_USER_STORAGE_KEY


  // lazy-init the user state by reading localStorage on mount
  const [user, setUserState] = useState<AbUser | null>(() => getStoredUser(storageKey))


  // persist the user back to localStorage whenever it changes
  useEffect(() => {
    // guard against SSR — no `window` on the server
    if (typeof window === 'undefined') return

    // write the user...
    if (user) {
      window.localStorage.setItem(storageKey, JSON.stringify(user))
    } else {
      // ...or drop the key entirely when there's no user
      window.localStorage.removeItem(storageKey)
    }
  }, [storageKey, user])


  // build the `setUser` callback (updates state, effect does the persisting)
  const setUser = useCallback((nextUser: AbUser | null) => {
    setUserState(nextUser)
  }, [])


  // build the `getUser` callback (reads fresh from localStorage)
  const getUser = useCallback((): AbUser | null => {
    return getStoredUser(storageKey)
  }, [storageKey])


  // build the `deleteUser` callback (nukes both state & the stored key)
  const deleteUser = useCallback(() => {
    setUserState(null)
  }, [])


  // return `user`, `setUser`, `getUser` & `deleteUser`
  return { user, setUser, getUser, deleteUser }
}


// export `useAbUser` hook as named export
export { useAbUser }


// export `useAbUser` hook as default
export default useAbUser