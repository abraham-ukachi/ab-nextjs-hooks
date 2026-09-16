'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useAbToggle } from './helpers/useAbToggle'

export const NORMAL_DIALOG = 'normal'

export const DEFAULT_DIALOG = NORMAL_DIALOG

export const DEFAULT_DIALOG_TIMEOUT = 0.5

export type AbDialogPart = 'main' | 'aside' | 'full'

export interface DialogList {
  id: number
  name: string
  value: string
}

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

export interface AbDialogResult {
  isConfirmed: boolean
  isCancelled: boolean
  isOpening: boolean
  isClosing: boolean
  currentId: string
  currentPart: AbDialogPart
  opened: boolean
  open: (params: DialogParams, timeout?: number, part?: AbDialogPart) => Promise<boolean | HTMLDivElement>
  close: (currentPart: AbDialogPart, currentId?: string, duration?: number) => void
}

export type AbDialog = AbDialogResult

const useAbDialog = (dialogType: string = NORMAL_DIALOG): AbDialogResult => {
  const [isOpening, toggleIsOpening] = useAbToggle(false)
  const [isClosing, toggleIsClosing] = useAbToggle(false)
  const [isConfirmed, toggleIsConfirmed] = useAbToggle(false)
  const [isCancelled, toggleIsCancelled] = useAbToggle(false)
  const [opened, toggleOpened] = useAbToggle(null)

  const [currentId, setCurrentId] = useState<string>(null)
  const [currentType, setCurrentType] = useState<string>(dialogType)
  const [currentDialogsEl, setCurrentDialogsEl] = useState<HTMLDivElement>(null)
  const [currentDialogEl, setCurrentDialogEl] = useState<HTMLDivElement>(null)
  const [currentPart, setCurrentPart] = useState<AbDialogPart>('full')

  const [mainEl, setMainEl] = useState<HTMLElement>(null)
  const [asideEl, setAsideEl] = useState<HTMLElement>(null)
  const [dialogsEl, setDialogsEl] = useState<HTMLDivElement>(null)
  const [mainDialogsEl, setMainDialogsEl] = useState<HTMLDivElement>(null)
  const [asideDialogsEl, setAsideDialogsEl] = useState<HTMLDivElement>(null)
  const [backdropEl, setBackdropEl] = useState<HTMLDivElement>(null)
  const [mainBackdropEl, setMainBackdropEl] = useState<HTMLDivElement>(null)
  const [asideBackdropEl, setAsideBackdropEl] = useState<HTMLDivElement>(null)

  const [hideBackdropTimer, setHideBackdropTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [closeDialogTimer, setCloseDialogTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [openDialogTimer, setOpenDialogTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return

    setDialogsEl(document.getElementById('dialogs') as HTMLDivElement)

    const newMainEl = document.querySelector('main') as HTMLElement
    setMainEl(newMainEl)
    setMainDialogsEl(newMainEl?.querySelector(':scope > .Dialogs') as HTMLDivElement)

    const newAsideEl = document.querySelector('aside') as HTMLElement
    setAsideEl(newAsideEl)
    setAsideDialogsEl(newAsideEl?.querySelector(':scope > .Dialogs') as HTMLDivElement)

    setBackdropEl(document.getElementById('backdrop') as HTMLDivElement)
    setMainBackdropEl(newMainEl?.querySelector(':scope > .Backdrop') as HTMLDivElement)
    setAsideBackdropEl(newAsideEl?.querySelector(':scope > .Backdrop') as HTMLDivElement)
  }, [mainEl, asideEl, currentDialogsEl])

  const getCurrentDialogsElement = useCallback(
    (part: AbDialogPart = currentPart): HTMLDivElement => {
      return part === 'main' ? mainDialogsEl : part === 'aside' ? asideDialogsEl : dialogsEl
    },
    [currentPart, mainDialogsEl, asideDialogsEl, dialogsEl]
  )

  const getDialogById = useCallback(
    (dialogId: string = currentId, part: AbDialogPart = currentPart): HTMLDivElement => {
      return getCurrentDialogsElement(part).querySelector(`.dialog[data-id="${dialogId}"]`)
    },
    [currentId, currentPart, getCurrentDialogsElement]
  )

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

  const _clearDialogListSelection = useCallback(
    (dialogEl: HTMLDivElement = currentDialogEl): void => {
      const listItemEls = dialogEl.querySelectorAll('.dialog-list-item')

      listItemEls.forEach((listItemEl) => listItemEl.removeAttribute('selected'))
    },
    [currentDialogEl]
  )

  const _selectDialogListItemById = useCallback(
    (listItemId: number, dialogEl: HTMLDivElement = currentDialogEl): void => {
      const listItemEl: HTMLLIElement = dialogEl.querySelector(`[data-id="${listItemId}"]`)

      listItemEl.setAttribute('selected', '')
    },
    [currentDialogEl]
  )

  const _handleDialogListItemClick = useCallback(
    (event: ReactMouseEvent<HTMLLIElement>, dialogEl: HTMLDivElement = currentDialogEl): void => {
      const listItemEl: HTMLLIElement = event.currentTarget
      const listItemId: number = parseInt(listItemEl.dataset.id)

      _clearDialogListSelection(dialogEl)
      _selectDialogListItemById(listItemId, dialogEl)
    },
    [currentDialogEl, _clearDialogListSelection, _selectDialogListItemById]
  )

  const _installDialogListItemEventListeners = useCallback(
    (dialogEl: HTMLDivElement = currentDialogEl, callback: (event: ReactMouseEvent<HTMLLIElement>, listItemEl: HTMLLIElement) => void = null): void => {
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

  const showBackdropOf = useCallback(
    (part: AbDialogPart = currentPart, isCancelable: boolean = true): void => {
      const currentBackdropEl: HTMLDivElement = part === 'main' ? mainBackdropEl : part === 'aside' ? asideBackdropEl : backdropEl

      currentBackdropEl.setAttribute('cancelable', isCancelable.toString())
      currentBackdropEl.hidden = false
    },
    [currentPart, mainBackdropEl, asideBackdropEl, backdropEl]
  )

  const hideBackdropOf = useCallback(
    (part: AbDialogPart = currentPart, backdropDuration: number = 300): void => {
      const currentBackdropEl: HTMLDivElement = part === 'main' ? mainBackdropEl : part === 'aside' ? asideBackdropEl : backdropEl

      currentBackdropEl.classList.add('fadeOut')

      clearTimeout(hideBackdropTimer)
      setHideBackdropTimer(
        setTimeout(() => {
          currentBackdropEl.hidden = true
          currentBackdropEl.classList.remove('fadeOut')
        }, backdropDuration)
      )
    },
    [currentPart, hideBackdropTimer, mainBackdropEl, asideBackdropEl, backdropEl]
  )

  const close = useCallback(
    (closePart: AbDialogPart, closeId: string = 'dialog', closeDuration: number = 0.3): Promise<boolean | void> => {
      return new Promise((resolve, reject) => {
        toggleIsClosing(true)

        const currentDialogsEl = closePart === 'main' ? mainDialogsEl : closePart === 'aside' ? asideDialogsEl : dialogsEl
        const currentDialogEl = getDialogById(closeId, closePart)

        if (!currentDialogEl) {
          toggleIsClosing(false)

          return reject(`Dialog with currentId "${closeId}" doesn't exist in ${closePart}`)
        }

        hideBackdropOf(closePart)

        currentDialogsEl.classList.remove('fadeIn')
        currentDialogsEl.classList.add('fadeOut')

        currentDialogEl.classList.remove('slideFromUp')
        currentDialogEl.classList.add('slideUp')

        clearTimeout(closeDialogTimer)
        clearTimeout(openDialogTimer)

        setCloseDialogTimer(
          setTimeout(() => {
            currentDialogEl.removeAttribute('opened')
            currentDialogEl.removeAttribute('active')
            currentDialogEl.hidden = true
            currentDialogsEl.hidden = true

            currentDialogsEl.classList.remove('fadeOut')
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

  const open = useCallback(
    (params: DialogParams, timeout: number = DEFAULT_DIALOG_TIMEOUT, part: AbDialogPart): Promise<boolean | HTMLDivElement> => {
      const newDialogId: string = params?.id ?? 'dialog'
      const newDialogType: string = params?.type ?? DEFAULT_DIALOG
      const newDialogsEl: HTMLDivElement = getDialogsElement(part)

      setCurrentId(newDialogId)
      setCurrentType(newDialogType)
      setCurrentDialogsEl(newDialogsEl)
      setCurrentPart(part)

      let newDialogEl: HTMLDivElement = getDialogElement(newDialogsEl)

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newDialogEl && setCurrentDialogEl(newDialogEl)

      return new Promise((resolve, reject) => {
        toggleIsOpening(true)

        if (!newDialogEl && newDialogId === 'dialog') {
          const dialogHTMLTemplate = _getDialogHTMLTemplate(params)

          newDialogsEl.insertAdjacentHTML('beforeend', dialogHTMLTemplate)

          newDialogEl = newDialogsEl?.querySelector(`.dialog[data-id="${newDialogId}"]`)

          setCurrentDialogEl(newDialogEl)

          if (typeof params.list !== 'undefined') _installDialogListItemEventListeners(newDialogEl, params?.onListItemClick)

          const confirmBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl.querySelector('.confirm-btn')
          const cancelBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl.querySelector('.cancel-btn')

          confirmBtnEl.onclick = params.onConfirm ?? ((): void => {
            close(part)
            toggleIsConfirmed(true)
          })
          cancelBtnEl.onclick = params.onCancel ?? ((): void => {
            close(part)
            toggleIsCancelled(true)
          })
        }

        if (!newDialogEl) {
          toggleIsOpening(false)

          return reject(`Dialog with id "${newDialogId}" doesn't exist`)
        }

        showBackdropOf(part, params.isCancelable ?? true)

        newDialogsEl.hidden = false
        newDialogEl.hidden = false

        newDialogsEl.classList.remove('fadeOut')
        newDialogsEl.classList.add('fadeIn')

        newDialogEl.classList.remove('slideUp')
        newDialogEl.classList.add('slideFromUp')

        clearTimeout(closeDialogTimer)
        clearTimeout(openDialogTimer)

        setOpenDialogTimer(
          setTimeout(() => {
            newDialogEl.setAttribute('opened', '')

            const confirmBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl.querySelector('.confirm-btn')
            const cancelBtnEl: HTMLButtonElement | HTMLAnchorElement = newDialogEl.querySelector('.cancel-btn')

            if (params.focusOnConfirm) {
              confirmBtnEl.focus()
            } else if (params.focusOnCancel) {
              cancelBtnEl.focus()
            }

            toggleIsConfirmed(false)
            toggleIsCancelled(false)
            toggleIsOpening(false)
            toggleOpened(true)
            resolve(newDialogEl)
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

  const getDialogsElement = (part: AbDialogPart): HTMLDivElement => {
    return part === 'main' ? mainDialogsEl : part === 'aside' ? asideDialogsEl : dialogsEl
  }

  const getDialogElement = (dialogsEl: HTMLDivElement): HTMLDivElement => {
    return dialogsEl?.querySelector(`.dialog[data-id="${currentId}"]`)
  }

  const dialogResult: AbDialogResult = {
    isConfirmed,
    isCancelled,
    isOpening,
    isClosing,
    currentId,
    currentPart,
    opened,
    open,
    close
  }

  return dialogResult
}

export { useAbDialog }