'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAbToggle } from './helpers/useAbToggle'

export const ERROR_TOAST = 'error'

export const SUCCESS_TOAST = 'success'

export const GOOD_TOAST = 'good'

export const BAD_TOAST = 'bad'

export const NORMAL_TOAST = 'normal'

export const DEFAULT_TOAST = NORMAL_TOAST

export const ERROR_TOAST_EMOJI = '🚫'

export const SUCCESS_TOAST_EMOJI = '✅'

export const GOOD_TOAST_EMOJI = '👍'

export const BAD_TOAST_EMOJI = '👎'

export const NORMAL_TOAST_EMOJI = '👋'

export const DEFAULT_TOAST_TIMEOUT = 5

export interface ToastParams {
  message: string
  type?: string
  part?: string
}

export interface ToastCallback {
  show: (params: ToastParams, timeout?: number, force?: boolean) => Promise<boolean>
  hide: () => void
  toggle: () => void
  isToasting: boolean
}

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

const getToastsByPartSelector = (part: string): string => {
  return part === 'main' ? 'main .Toasts' : part === 'aside' ? 'aside .Toasts' : '#toasts'
}

const useAbToast = (toastType: string = NORMAL_TOAST, emojiHidden: boolean = false, rebootDuration: number = 100): ToastCallback => {
  const [isToasting, toggleIsToasting] = useAbToggle(null)
  const [toastOutTimer, setToastOutTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    clearTimeout(toastTimer)
    clearTimeout(toastOutTimer)
  }, [toastTimer, toastOutTimer])

  const getToastsByPart = useCallback((part: string): HTMLDivElement => {
    return document.querySelector(getToastsByPartSelector(part))
  }, [])

  const clearToast = useCallback((toastsEl: HTMLDivElement): void => {
    toastsEl.innerHTML = ''
    toastsEl.hidden = true
  }, [])

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

  const reboot = useCallback((): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), rebootDuration))
  }, [rebootDuration])

  const showToast = useCallback(
    (params: ToastParams, timeout: number = DEFAULT_TOAST_TIMEOUT, force: boolean = false): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (isToasting && !force) {
          reject("There's an active toast. Wait for it to get hidden or force this toast")

          return false
        }

        toggleIsToasting(false)

        if (isToasting && force) await reboot()

        const message = params.message
        const type = params.type ?? toastType ?? DEFAULT_TOAST
        const part = params.part ?? 'full'

        const currentToastsEl = getToastsByPart(part)

        clearToast(currentToastsEl)

        toggleIsToasting(true)

        currentToastsEl.insertAdjacentHTML('beforeend', getToastHtmlTemplate(type, message))

        const toastEl: HTMLDivElement = currentToastsEl.querySelector('.toast')

        currentToastsEl.hidden = false

        const fadeOutDelay = 500

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

  const hideToast = useCallback(() => toggleIsToasting(false), [toggleIsToasting])

  const toggleToast = useCallback(() => toggleIsToasting(!isToasting), [isToasting, toggleIsToasting])

  useMemo(() => {
    if (isToasting === false) clearTimers()
  }, [isToasting, clearTimers])

  const toastCallback: ToastCallback = {
    show: showToast,
    hide: hideToast,
    toggle: toggleToast,
    isToasting
  }

  return toastCallback
}

export { useAbToast }