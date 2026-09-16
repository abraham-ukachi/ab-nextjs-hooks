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
* @name: Toast - AB Client Hook
* @file: useAbToast.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the toast hook
*    -|> import useAbToast from './useAbToast'
*    -|>
*    -|> const { show, hide, isToasting } = useAbToast(SUCCESS_TOAST)
*    -|>
*    -|> show({ message: 'Saved!', type: SUCCESS_TOAST }) // ==> pops a ✅ toast
*
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
import { useAbToggle } from './helpers/useAbToggle'
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== TOAST - TYPES & CONSTANTS ===== //


// toast type (of both emoji & color) for errors
export const ERROR_TOAST = 'error'


// toast type for success messages
export const SUCCESS_TOAST = 'success'


// toast type for good / positive vibes
export const GOOD_TOAST = 'good'


// toast type for bad / negative vibes
export const BAD_TOAST = 'bad'


// toast type for plain, neutral messages
export const NORMAL_TOAST = 'normal'


// default toast type; equal to `NORMAL_TOAST`
export const DEFAULT_TOAST = NORMAL_TOAST


// emoji shown in an `error` toast
export const ERROR_TOAST_EMOJI = '🚫'


// emoji shown in a `success` toast
export const SUCCESS_TOAST_EMOJI = '✅'


// emoji shown in a `good` toast
export const GOOD_TOAST_EMOJI = '👍'


// emoji shown in a `bad` toast
export const BAD_TOAST_EMOJI = '👎'


// emoji shown in a `normal` toast (and as the ultimate fallback)
export const NORMAL_TOAST_EMOJI = '👋'


// default amount of time a toast stays on screen (in seconds)
export const DEFAULT_TOAST_TIMEOUT = 5


// shape of the params passed to `show()`
export interface ToastParams {
  message: string
  type?: string
  part?: string
}


// simple API every toast hook exposes to the outside world
export interface ToastCallback {
  show: (params: ToastParams, timeout?: number, force?: boolean) => Promise<boolean>
  hide: () => void
  toggle: () => void
  isToasting: boolean
}




// ===== TOAST - HELPERS ===== //


// map a toast type to its emoji (falls back to the `normal` one)
const getCurrentEmoji = (toastType: string): string => {
  switch (toastType) {
    case ERROR_TOAST:
      return ERROR_TOAST_EMOJI
    case SUCCESS_TOAST:
      return SUCCESS_TOAST_EMOJI
    case GOOD_TOAST:
      return GOOD_TOAST_EMOJI
    case BAD_TOAST:
      return BAD_TOAST_EMOJI
    case NORMAL_TOAST:
      return NORMAL_TOAST_EMOJI
    default:
      return NORMAL_TOAST_EMOJI
  }
}


// turn a toast part into a CSS selector for its `.Toasts` container
const getToastsByPartSelector = (part: string): string => {
  return part === 'main' ? 'main .Toasts' : part === 'aside' ? 'aside .Toasts' : '#toasts'
}




// ===== useAbToast - AB HOOK ===== //


/**
 * @name useAbToast
 * @description A toast hook that pops a transient toast into the `.Toasts` container
 * of a given part, animates it in, auto-fades it out after a timeout, and lets you
 * reboot/replace it (with a `force` flag)
 *
 * @param { string } toastType - Default toast type to use when none is given
 * @param { boolean } emojiHidden - Hides the emoji from the toast (except `success`)
 * @param { number } rebootDuration - Delay (in ms) used between forced toasts
 *
 * @returns { ToastCallback }
 */
const useAbToast = (toastType: string = NORMAL_TOAST, emojiHidden: boolean = false, rebootDuration: number = 100): ToastCallback => {

  // is a toast currently on screen? `null` = not toasting yet
  const [isToasting, toggleIsToasting] = useAbToggle(null)

  // timer that fades the toast out
  const [toastOutTimer, setToastOutTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // timer that finally clears the toast (after the fade-out)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // kill both timers; used whenever a toast is done or the state resets
  const clearTimers = useCallback(() => {
    clearTimeout(toastTimer)
    clearTimeout(toastOutTimer)
  }, [toastTimer, toastOutTimer])

  // find the `.Toasts` container for a given part
  const getToastsByPart = useCallback((part: string): HTMLDivElement => {
    return document.querySelector(getToastsByPartSelector(part))
  }, [])

  // empty a toasts container & hide it
  const clearToast = useCallback((toastsEl: HTMLDivElement): void => {
    toastsEl.innerHTML = ''
    toastsEl.hidden = true
  }, [])

  // swap the toast's "popIn" animation for a `fadeOut`, after a short delay
  const fadeToastOut = useCallback(
    (toastEl: HTMLDivElement, timeout: number = 0.5, delay: number = 500): Promise<boolean> => {
      const realTimeout = timeout * 1000 - delay

      return new Promise((resolve) => {
        setToastOutTimer(
          setTimeout(() => {
            toastEl.classList.remove('animate-[popIn_300ms_ease-in-out]')
            toastEl.classList.add('fadeOut')
            resolve(true)
          }, realTimeout)
        )
      })
    },
    []
  )

  // build the raw HTML string of a toast (emoji included unless hidden)
  const getToastHtmlTemplate = useCallback(
    (type: string, message: string) => {
      const emoji = getCurrentEmoji(type)

      return `
        <div class="toast animate-[popIn_300ms_ease-in-out]" ${emojiHidden ? 'data-emoji-hidden' : ''}>
          <span class="toast-emoji ${type}" ${emojiHidden && type !== SUCCESS_TOAST ? 'hidden' : ''}>${emojiHidden ? '' : emoji}</span>
          <span class="toast-msg">${message}</span>
        </div>
      `
    },
    [emojiHidden]
  )

  // small pause between a forced toast and the next one
  const reboot = useCallback((): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), rebootDuration))
  }, [rebootDuration])

  // show a toast: clear the old one, inject the new one, fade it out, then clean up
  const showToast = useCallback(
    (params: ToastParams, timeout: number = DEFAULT_TOAST_TIMEOUT, force: boolean = false): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {

        // refuse to stack toasts unless `force` is on
        if (isToasting && !force) {
          reject("There's an active toast. Wait for it to get hidden or force this toast")

          return false
        }

        // reset the toasting state before we start
        toggleIsToasting(false)

        // give the old toast a beat to vanish when forcing a new one
        if (isToasting && force) await reboot()

        const message = params.message
        const type = params.type ?? toastType ?? DEFAULT_TOAST
        const part = params.part ?? 'full'

        // find (then clear) the target part's toasts container
        const currentToastsEl = getToastsByPart(part)

        clearToast(currentToastsEl)

        // we're toasting now
        toggleIsToasting(true)

        // inject the toast HTML & grab the fresh element
        currentToastsEl.insertAdjacentHTML('beforeend', getToastHtmlTemplate(type, message))

        const toastEl: HTMLDivElement = currentToastsEl.querySelector('.toast')

        currentToastsEl.hidden = false

        // amount of time the fade-out itself takes, in ms
        const fadeOutDelay = 500

        // fade the toast out when its time is up, then fully remove it
        fadeToastOut(toastEl, timeout, fadeOutDelay).then(() => {
          setToastTimer(
            setTimeout(() => {
              clearToast(currentToastsEl)
              toggleIsToasting(false)
              toastEl.remove()
              currentToastsEl.hidden = true
              resolve(true)
            }, fadeOutDelay)
          )
        })
      })
    },
    [isToasting, toastType, fadeToastOut, clearToast, getToastsByPart, getToastHtmlTemplate, toggleIsToasting, reboot]
  )

  // hide the current toast (just flips the toggle; the effect handles the rest)
  const hideToast = useCallback(() => toggleIsToasting(false), [toggleIsToasting])

  // toggle the current toast's visibility
  const toggleToast = useCallback(() => toggleIsToasting(!isToasting), [isToasting, toggleIsToasting])

  // once a toast is fully hidden, clean up any lingering timers
  useMemo(() => {
    if (isToasting === false) clearTimers()
  }, [isToasting, clearTimers])

  // build the public `ToastCallback` API
  const toastCallback: ToastCallback = {
    show: showToast,
    hide: hideToast,
    toggle: toggleToast,
    isToasting
  }

  // return the whole toast API
  return toastCallback
}


// export `useAbToast` hook as named export
export { useAbToast }