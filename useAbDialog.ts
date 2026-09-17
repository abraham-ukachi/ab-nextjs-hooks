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
* @name: Dialog - AB Client Hook
* @file: useAbDialog.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the dialog hook
*    -|> import useAbDialog from './useAbDialog'
*    -|>
*    -|> const { open, close, isConfirmed } = useAbDialog('normal')
*    -|>
*    -|> open({ title: 'Say what?', message: 'You sure?' }) // ==> shows the dialog
*    -|>
*    -|> // console.log(isConfirmed) // ==> true, after the user hits "Confirm" :P
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
import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
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




// ===== DIALOG - TYPES & CONSTANTS ===== //


// dialog type that describes a classic, all-purpose dialog
export const NORMAL_DIALOG = 'normal'


// default dialog type; equal to `NORMAL_DIALOG`
export const DEFAULT_DIALOG = NORMAL_DIALOG


// default open/close animation timeout (in seconds)
export const DEFAULT_DIALOG_TIMEOUT = 0.5


// where a dialog can live on the page
export type AbDialogPart = 'main' | 'aside' | 'full'


// one selectable item inside a dialog's list
export interface DialogList {
  id: number
  name: string
  value: string
}


// shape of the params passed to `open()`: content, buttons, focus & list options
export interface DialogParams {
  type?: string
  id?: string
  title?: string
  message?: string
  confirmBtnText?: string
  cancelBtnText?: string
  noDivider?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  noConfirmBtn?: boolean
  noCancelBtn?: boolean
  isCancelable?: boolean
  list?: Array<DialogList>
  selectedId?: number
  selectedName?: string
  onListItemClick?: (event: ReactMouseEvent<HTMLLIElement>, listItemEl: HTMLLIElement) => void
  noButtons?: boolean
  focusOnConfirm?: boolean
  focusOnCancel?: boolean
}


// full API a dialog hook exposes to the outside world
export interface AbDialogResult {
  isConfirmed: boolean
  isCancelled: boolean
  isOpening: boolean
  isClosing: boolean
  currentId: string | null
  currentPart: AbDialogPart
  opened: boolean
  open: (params: DialogParams, timeout?: number, part?: AbDialogPart) => Promise<boolean | HTMLDivElement>
  close: (currentPart: AbDialogPart, currentId?: string, duration?: number) => void
}


// alias `AbDialogResult` as `AbDialog`
export type AbDialog = AbDialogResult




// ===== useAbDialog - AB HOOK ===== //


/**
 * @name useAbDialog
 * @description A dialog hook that builds a dialog from `DialogParams` (or reuses one
 * already in the DOM), then opens/closes it with slide + fade animations while handling
 * confirm/cancel buttons, list selection & focus
 *
 * @param { string } dialogType - The default dialog type to use (`NORMAL_DIALOG`, ...)
 *
 * @returns { AbDialogResult }
 */
const useAbDialog = (dialogType: string = NORMAL_DIALOG): AbDialogResult => {

  // --- lifecycle toggles ---
  const [isOpening, toggleIsOpening] = useAbToggle(false)
  const [isClosing, toggleIsClosing] = useAbToggle(false)
  const [isConfirmed, toggleIsConfirmed] = useAbToggle(false)
  const [isCancelled, toggleIsCancelled] = useAbToggle(false)
  const [opened, toggleOpened] = useAbToggle(null)

  // --- current dialog identity states ---
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [currentType, setCurrentType] = useState<string>(dialogType)
  const [currentDialogsEl, setCurrentDialogsEl] = useState<HTMLDivElement | null>(null)
  const [currentDialogEl, setCurrentDialogEl] = useState<HTMLDivElement | null>(null)
  const [currentPart, setCurrentPart] = useState<AbDialogPart>('full')

  // --- queried DOM containers (one per page slot) ---
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null)
  const [asideEl, setAsideEl] = useState<HTMLElement | null>(null)
  const [dialogsEl, setDialogsEl] = useState<HTMLDivElement | null>(null)
  const [mainDialogsEl, setMainDialogsEl] = useState<HTMLDivElement | null>(null)
  const [asideDialogsEl, setAsideDialogsEl] = useState<HTMLDivElement | null>(null)
  const [backdropEl, setBackdropEl] = useState<HTMLDivElement | null>(null)
  const [mainBackdropEl, setMainBackdropEl] = useState<HTMLDivElement | null>(null)
  const [asideBackdropEl, setAsideBackdropEl] = useState<HTMLDivElement | null>(null)

  // --- animation timers ---
  const [hideBackdropTimer, setHideBackdropTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [closeDialogTimer, setCloseDialogTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [openDialogTimer, setOpenDialogTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // locate all the dialog + backdrop containers, exactly once the document exists
  useEffect(() => {
    if (typeof document === 'undefined') return

    // grab the general `#dialogs` container
    setDialogsEl(document.getElementById('dialogs') as HTMLDivElement)

    // grab the main slot (`main > .Dialogs`)
    const newMainEl = document.querySelector('main') as HTMLElement
    setMainEl(newMainEl)
    setMainDialogsEl(newMainEl?.querySelector(':scope > .Dialogs') as HTMLDivElement)

    // grab the aside slot (`aside > .Dialogs`)
    const newAsideEl = document.querySelector('aside') as HTMLElement
    setAsideEl(newAsideEl)
    setAsideDialogsEl(newAsideEl?.querySelector(':scope > .Dialogs') as HTMLDivElement)

    // grab the backdrops, one per slot (general, main & aside)
    setBackdropEl(document.getElementById('backdrop') as HTMLDivElement)
    setMainBackdropEl(newMainEl?.querySelector(':scope > .Backdrop') as HTMLDivElement)
    setAsideBackdropEl(newAsideEl?.querySelector(':scope > .Backdrop') as HTMLDivElement)
  }, [mainEl, asideEl, currentDialogsEl])

  // return the dialogs container for a given part
  const getCurrentDialogsElement = useCallback(
    (part: AbDialogPart = currentPart): HTMLDivElement | null => {
      return part === 'main' ? mainDialogsEl : part === 'aside' ? asideDialogsEl : dialogsEl
    },
    [currentPart, mainDialogsEl, asideDialogsEl, dialogsEl]
  )

  // find a dialog element inside its container, by id (defaults to `currentId`)
  const getDialogById = useCallback(
    (dialogId: string | null = currentId, part: AbDialogPart = currentPart): HTMLDivElement | null => {
      return getCurrentDialogsElement(part)?.querySelector(`.dialog[data-id="${dialogId}"]`) ?? null
    },
    [currentId, currentPart, getCurrentDialogsElement]
  )

  // build the raw HTML string of a dialog from `DialogParams` (used for brand-new dialogs)
  const _getDialogHTMLTemplate = useCallback(
    (data: DialogParams, type: string = currentType): string => {
      return `
        <div data-id="dialog" data-type="${type}" class="dialog slideFromUp" hidden ${typeof data?.list !== 'undefined' ? 'has-list' : ''}>
          <h2 class="dialog-title" ${data.title?.length ?? 'hidden'}>${data.title}</h2>
          <p class="dialog-msg" ${data.message?.length ?? 'hidden'}>${data.message}</p>

          ${typeof data?.list !== 'undefined'
            ? `
          <ul class="dialog-list vertical flex-layout" naked>
            ${data?.list
              .map(
                (listItem: DialogList, index: number) => `
              <li shrinks
              tabIndex="${index + 1}"
              class="dialog-list-item horizontal flex-layout center"
              data-id="${listItem.id}"
              data-name="${listItem.name}"
              ${data?.selectedId === listItem.id || data?.selectedName === listItem.name ? 'selected' : ''}
              >
                <span class="radio"></span>
                <span class="value">${listItem.value}</span>
              </li>
            `
              )
              .join('')}
          </ul>
          `
            : ''}

          <div class="dialog-buttons" ${data.noButtons ? 'hidden' : ''}>
            <a role="button" ${data.noConfirmBtn && 'hidden'}
               tabindex="0"
               class="dialog-button confirm-btn"
               data-default
               autofocus>
              ${data.confirmBtnText ?? 'Confirm'}
            </a>

            <span class="divider horizontal left" ${data.noDivider ? 'hidden' : ''}></span>

            <a role="button" ${data.noCancelBtn && 'hidden'}
               tabindex="0"
               class="dialog-button cancel-btn"
               confirm>
              ${data.cancelBtnText ?? 'Cancel'}
            </a>
          </div>
        </div>
      `
    },
    [currentType]
  )

  // clear the `selected` attribute from every list item in a dialog
  const _clearDialogListSelection = useCallback(
    (dialogEl: HTMLDivElement = currentDialogEl!): void => {
      const listItemEls = dialogEl.querySelectorAll('.dialog-list-item')

      listItemEls.forEach((listItemEl) => listItemEl.removeAttribute('selected'))
    },
    [currentDialogEl]
  )

  // mark a dialog list item as `selected` (by its numeric id)
  const _selectDialogListItemById = useCallback(
    (listItemId: number, dialogEl: HTMLDivElement = currentDialogEl!): void => {
      const listItemEl: HTMLLIElement = dialogEl.querySelector(`[data-id="${listItemId}"]`)!

      listItemEl.setAttribute('selected', '')
    },
    [currentDialogEl]
  )

  // shared handler: clicking a list item swaps the `selected` state (single-choice)
  const _handleDialogListItemClick = useCallback(
    (event: ReactMouseEvent<HTMLLIElement>, dialogEl: HTMLDivElement = currentDialogEl!): void => {
      const listItemEl: HTMLLIElement = event.currentTarget
      const listItemId: number = parseInt(listItemEl.dataset.id!)

      _clearDialogListSelection(dialogEl)
      _selectDialogListItemById(listItemId, dialogEl)
    },
    [currentDialogEl, _clearDialogListSelection, _selectDialogListItemById]
  )

  // attach click listeners to every list item (fires `callback` when provided)
  const _installDialogListItemEventListeners = useCallback(
    (dialogEl: HTMLDivElement = currentDialogEl!, callback: ((event: ReactMouseEvent<HTMLLIElement>, listItemEl: HTMLLIElement) => void) | null = null): void => {
      const listItemEls: NodeListOf<HTMLLIElement> = dialogEl.querySelectorAll('.dialog-list-item')

      listItemEls.forEach((listItemEl: HTMLLIElement) => {
        listItemEl.addEventListener('click', (event: MouseEvent) => {
          if (callback) {
            callback(event as unknown as ReactMouseEvent<HTMLLIElement>, listItemEl)
          }

          _handleDialogListItemClick(event as unknown as ReactMouseEvent<HTMLLIElement>, dialogEl)
        })
      })
    },
    [currentDialogEl, _handleDialogListItemClick]
  )

  // reveal the backdrop of a given part (with its own cancelable flag)
  const showBackdropOf = useCallback(
    (part: AbDialogPart = currentPart, isCancelable: boolean = true): void => {
      const currentBackdropEl: HTMLDivElement = (part === 'main' ? mainBackdropEl : part === 'aside' ? asideBackdropEl : backdropEl)!

      currentBackdropEl.setAttribute('cancelable', isCancelable.toString())
      currentBackdropEl.hidden = false
    },
    [currentPart, mainBackdropEl, asideBackdropEl, backdropEl]
  )

  // fade a part's backdrop out, then hide it once the fade completes
  const hideBackdropOf = useCallback(
    (part: AbDialogPart = currentPart, backdropDuration: number = 300): void => {
      const currentBackdropEl: HTMLDivElement = (part === 'main' ? mainBackdropEl : part === 'aside' ? asideBackdropEl : backdropEl)!

      currentBackdropEl.classList.add('fadeOut')

      clearTimeout(hideBackdropTimer ?? undefined)
      setHideBackdropTimer(
        setTimeout(() => {
          currentBackdropEl.hidden = true
          currentBackdropEl.classList.remove('fadeOut')
        }, backdropDuration)
      )
    },
    [currentPart, hideBackdropTimer, mainBackdropEl, asideBackdropEl, backdropEl]
  )

  // close a dialog: fade + slide out, then remove it from the DOM & reset states
  const close = useCallback(
    (closePart: AbDialogPart, closeId: string = 'dialog', closeDuration: number = 0.3): Promise<boolean | void> => {
      return new Promise((resolve, reject) => {

        // flag that we're closing
        toggleIsClosing(true)

        // resolve the container + the dialog itself in the target part
        const currentDialogsEl = closePart === 'main' ? mainDialogsEl : closePart === 'aside' ? asideDialogsEl : dialogsEl
        const currentDialogEl = getDialogById(closeId, closePart)

        // bail out early if the dialog isn't there
        if (!currentDialogEl) {
          toggleIsClosing(false)

          return reject(`Dialog with currentId "${closeId}" doesn't exist in ${closePart}`)
        }

        // hide the backdrop & animate the dialogs container + the dialog out
        hideBackdropOf(closePart)

        currentDialogsEl!.classList.remove('fadeIn')
        currentDialogsEl!.classList.add('fadeOut')

        currentDialogEl.classList.remove('slideFromUp')
        currentDialogEl.classList.add('slideUp')

        clearTimeout(closeDialogTimer ?? undefined)
        clearTimeout(openDialogTimer ?? undefined)

        setCloseDialogTimer(
          setTimeout(() => {
            // deactivate, then remove the dialog from the DOM once hidden
            currentDialogEl.removeAttribute('opened')
            currentDialogEl.removeAttribute('active')
            currentDialogEl.hidden = true
            currentDialogsEl!.hidden = true

            currentDialogsEl!.classList.remove('fadeOut')
            currentDialogEl.remove()

            toggleIsClosing(false)
            toggleOpened(false)
            resolve()
          }, closeDuration * 1000)
        )
      })
    },
    [closeDialogTimer, openDialogTimer, getDialogById, hideBackdropOf, toggleIsClosing, toggleOpened, mainDialogsEl, asideDialogsEl, dialogsEl]
  )

  // open a dialog: build it (if missing), wire its buttons, animate it in & resolve
  const open = useCallback(
    (params: DialogParams, timeout: number = DEFAULT_DIALOG_TIMEOUT, part: AbDialogPart = 'full'): Promise<boolean | HTMLDivElement> => {
      const newDialogId: string = params?.id ?? 'dialog'
      const newDialogType: string = params?.type ?? DEFAULT_DIALOG
      const newDialogsEl: HTMLDivElement = getDialogsElement(part)!

      // remember what we're about to show
      setCurrentId(newDialogId)
      setCurrentType(newDialogType)
      setCurrentDialogsEl(newDialogsEl)
      setCurrentPart(part)

      // try to find an already-existing dialog of that id
      let newDialogEl: HTMLDivElement | null = getDialogElement(newDialogsEl)

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newDialogEl && setCurrentDialogEl(newDialogEl)

      return new Promise((resolve, reject) => {

        // flag that we're opening
        toggleIsOpening(true)

        // if it's a fresh `dialog` (no id), build it from the params
        if (!newDialogEl && newDialogId === 'dialog') {
          const dialogHTMLTemplate = _getDialogHTMLTemplate(params)

          // inject the HTML into the container then re-query it
          newDialogsEl.insertAdjacentHTML('beforeend', dialogHTMLTemplate)

          newDialogEl = newDialogsEl?.querySelector(`.dialog[data-id="${newDialogId}"]`) ?? null

          setCurrentDialogEl(newDialogEl)

          // wire up the list items (selection & user callback) when a list exists
          if (typeof params.list !== 'undefined') _installDialogListItemEventListeners(newDialogEl!, params?.onListItemClick)

          const confirmBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl!.querySelector('.confirm-btn')!
          const cancelBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl!.querySelector('.cancel-btn')!

          // wire the confirm button (default behavior = confirm + close)
          confirmBtnEl.onclick = params.onConfirm ?? ((): void => {
            close(part)
            toggleIsConfirmed(true)
          })
          // wire the cancel button (default behavior = cancel + close)
          cancelBtnEl.onclick = params.onCancel ?? ((): void => {
            close(part)
            toggleIsCancelled(true)
          })
        }

        // still nothing to show? reject.
        if (!newDialogEl) {
          toggleIsOpening(false)

          return reject(`Dialog with id "${newDialogId}" doesn't exist`)
        }

        // reveal the backdrop, then the dialog itself
        showBackdropOf(part, params.isCancelable ?? true)

        newDialogsEl.hidden = false
        newDialogEl.hidden = false

        // animate the container + the dialog in
        newDialogsEl.classList.remove('fadeOut')
        newDialogsEl.classList.add('fadeIn')

        newDialogEl.classList.remove('slideUp')
        newDialogEl.classList.add('slideFromUp')

        clearTimeout(closeDialogTimer ?? undefined)
        clearTimeout(openDialogTimer ?? undefined)

        setOpenDialogTimer(
          setTimeout(() => {
            newDialogEl!.setAttribute('opened', '')

            // move focus to the confirm/cancel buttons when requested
            const confirmBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl!.querySelector('.confirm-btn')!
            const cancelBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl!.querySelector('.cancel-btn')!

            if (params.focusOnConfirm) {
              confirmBtnEl.focus()
            } else if (params.focusOnCancel) {
              cancelBtnEl.focus()
            }

            // done: reset the transient flags & resolve with the dialog element
            toggleIsConfirmed(false)
            toggleIsCancelled(false)
            toggleIsOpening(false)
            toggleOpened(true)
            resolve(newDialogEl!)
          }, timeout * 1000)
        )
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dialogsEl,
      mainDialogsEl,
      asideDialogsEl,
      _getDialogHTMLTemplate,
      _installDialogListItemEventListeners,
      closeDialogTimer,
      openDialogTimer,
      showBackdropOf,
      toggleIsOpening,
      toggleOpened,
      close,
      toggleIsCancelled,
      toggleIsConfirmed
    ]
  )

  // return the dialogs container for a given part (helpers used by `open`)
  const getDialogsElement = (part: AbDialogPart): HTMLDivElement | null => {
    return part === 'main' ? mainDialogsEl : part === 'aside' ? asideDialogsEl : dialogsEl
  }

  // find the dialog matching the current id inside a given container
  const getDialogElement = (dialogsEl: HTMLDivElement | null): HTMLDivElement | null => {
    return dialogsEl?.querySelector(`.dialog[data-id="${currentId}"]`) ?? null
  }

  // bundle everything the consumer needs into a single `dialogResult`
  const dialogResult: AbDialogResult = {
    isConfirmed: isConfirmed ?? false,
    isCancelled: isCancelled ?? false,
    isOpening: isOpening ?? false,
    isClosing: isClosing ?? false,
    currentId,
    currentPart,
    opened: opened ?? false,
    open,
    close
  }

  // return the whole dialog API
  return dialogResult
}


// export `useAbDialog` hook as named export
export { useAbDialog }