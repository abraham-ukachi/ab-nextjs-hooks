'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAbToggle } from './helpers/useAbToggle'

export const NORMAL_MENU = 'normal'

export const DEFAULT_MENU = NORMAL_MENU

export const DEFAULT_MENU_DURATION = 0.5

export interface MenuParams {
  id: string
  origin: string
  type?: string
  title?: string
  message?: string
  isCancelable?: boolean
  onOpen?: (menuEl: HTMLDivElement) => void
  onClose?: (menuId: string, menuEl?: HTMLDivElement) => void
  onItemClick?: (menuItemId: string, menuItemEl?: HTMLLIElement, event?: MouseEvent) => void
  closeOnItemClick?: boolean
}

export interface MenuCallback {
  show: () => void
  hide: () => void
}

const useAbMenu = (params: MenuParams, duration: number = DEFAULT_MENU_DURATION, part: string = 'full'): MenuCallback => {
  const [opened, toggleOpened] = useAbToggle(null)
  const [isReady, toggleIsReady] = useAbToggle(null)

  const [menuParams, setMenuParams] = useState<MenuParams>(params)
  const [menuDuration] = useState<number>(duration)
  const [currentPart] = useState<string>(part)

  const [menuId, setMenuId] = useState<string>(params.id)
  const [menuType, setMenuType] = useState<string>(params.type || DEFAULT_MENU)
  const [menuOrigin, setMenuOrigin] = useState<string>(params.origin)
  const [isMenuCancelable, setIsMenuCancelable] = useState<boolean>(params.isCancelable || false)

  const [currentMenusEl, setCurrentMenusEl] = useState<HTMLDivElement>(null)
  const [currentMenuOriginEl, setCurrentMenuOriginEl] = useState<HTMLUListElement>(null)
  const [currentMenuEl, setCurrentMenuEl] = useState<HTMLDivElement>(null)

  const [currentBackdropEl, setCurrentBackdropEl] = useState<HTMLDivElement>(null)
  const [currentCloseBtnEl, setCurrentCloseBtnEl] = useState<HTMLButtonElement>(null)

  const [hideBackdropTimer, setHideBackdropTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [hideMenuTimer, setHideMenuTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [showMenuTimer, setShowMenuTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const menusEl = document.getElementById('menus') as HTMLDivElement
    const mainMenusEl = document.querySelector('main > .Menus') as HTMLDivElement
    const asideMenusEl = document.querySelector('aside > .Menus') as HTMLDivElement

    const backdropEl = document.getElementById('backdrop') as HTMLDivElement
    const mainBackdropEl = document.querySelector('main > .Backdrop') as HTMLDivElement
    const asideBackdropEl = document.querySelector('aside > .Backdrop') as HTMLDivElement

    setCurrentMenusEl((currentPart === 'main' ? mainMenusEl : currentPart === 'aside' ? asideMenusEl : menusEl) as HTMLDivElement)
    setCurrentMenuOriginEl(currentMenusEl?.querySelector(`:scope > .${menuOrigin}`) as HTMLUListElement)
    setCurrentMenuEl(currentMenuOriginEl?.querySelector(`:scope > [data-id="${menuId}"]`) as HTMLDivElement)
    setCurrentBackdropEl((currentPart === 'main' ? mainBackdropEl : currentPart === 'aside' ? asideBackdropEl : backdropEl) as HTMLDivElement)
    setCurrentCloseBtnEl(currentMenuEl?.querySelector(`li[role="close-menu"] button`) as HTMLButtonElement)

    if (currentMenuEl && currentBackdropEl) {
      toggleIsReady(true)
    }

    return () => {
      clearTimeout(hideBackdropTimer)
      clearTimeout(hideMenuTimer)
      clearTimeout(showMenuTimer)
    }
     
  }, [currentPart, menuOrigin, menuId, currentMenusEl, currentMenuOriginEl, currentMenuEl, toggleIsReady, hideBackdropTimer, hideMenuTimer, showMenuTimer, currentBackdropEl])

  const showBackdrop = useCallback(
    (isCancelable: boolean = isMenuCancelable): void => {
      currentBackdropEl?.setAttribute('cancelable', isCancelable.toString())
      currentBackdropEl.hidden = false
    },
    [currentBackdropEl, isMenuCancelable]
  )

  const hideBackdrop = useCallback(
    (backdropDuration: number = 300): void => {
      currentBackdropEl?.classList.add('fadeOut')

      clearTimeout(hideBackdropTimer)
      setHideBackdropTimer(
        setTimeout(() => {
          currentBackdropEl.hidden = true
          currentBackdropEl.classList.remove('fadeOut')
        }, backdropDuration)
      )
    },
    [currentBackdropEl, hideBackdropTimer]
  )

  const hideMenu = useCallback(
    (hideDuration: number = menuDuration, hidePart: string = currentPart): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (!currentMenuEl) {
          return reject(`Menu with menuId "${menuId}" doesn't exist in ${hidePart} part. Yet.`)
        }

        hideBackdrop()

        currentMenusEl.classList.remove('fadeIn')
        currentMenusEl.classList.add('fadeOut')

        currentMenuEl.classList.remove('slideFromDown')
        currentMenuEl.classList.add('slideDown')

        clearTimeout(hideMenuTimer)
        clearTimeout(showMenuTimer)

        setHideMenuTimer(
          setTimeout(() => {
            currentMenuEl.removeAttribute('data-active')
            currentMenuEl.hidden = true
            currentMenusEl.hidden = true

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            menuParams.onClose && menuParams.onClose(menuId, currentMenuEl)

            resolve(true)
          }, hideDuration * 1000)
        )
      })
    },
    [menuParams, menuId, menuDuration, currentPart, currentMenusEl, currentMenuEl, hideBackdrop, hideMenuTimer, showMenuTimer]
  )

  const showMenu = useCallback(
    (showParams: MenuParams = menuParams, showDuration: number = menuDuration, showPart: string = currentPart): Promise<boolean | HTMLDivElement> => {
      return new Promise((resolve, reject) => {
        if (!currentMenuEl) {
          return reject(`Menu with id "${showParams.id}" doesn't exist in ${showPart}`)
        }

        if (showParams.id !== menuParams.id) {
          setMenuParams(showParams)
          setMenuId(showParams.id)
          setMenuType(showParams.type || DEFAULT_MENU)
          setMenuOrigin(showParams.origin)
          setIsMenuCancelable(showParams.isCancelable || false)
        }

        showBackdrop(showParams.isCancelable)

        currentMenuEl.hidden = false
        currentMenusEl.hidden = false

        currentMenusEl.classList.remove('fadeOut')
        currentMenusEl.classList.add('fadeIn')

        currentMenuEl.classList.remove('slideDown')
        currentMenuEl.classList.add('slideFromDown')

        currentMenuEl.setAttribute('data-type', menuType)

        clearTimeout(showMenuTimer)
        clearTimeout(hideMenuTimer)

        setShowMenuTimer(
          setTimeout(() => {
            currentMenuEl.setAttribute('data-active', 'true')

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            menuParams.onOpen && menuParams.onOpen(currentMenuEl)

            resolve(currentMenuEl)
          }, showDuration * 1000)
        )
      })
    },
    [menuParams, menuDuration, currentPart, menuType, currentMenuEl, currentMenusEl, showBackdrop, hideMenuTimer, showMenuTimer]
  )

  const openHandler = useCallback((): void => {
    toggleOpened(true)
  }, [toggleOpened])

  const closeHandler = useCallback((): void => {
    toggleOpened(false)
  }, [toggleOpened])

  const itemClickHandler = useCallback(
    (event: MouseEvent): void => {
      const menuItemEl = event.currentTarget as HTMLLIElement
      const menuItemId = menuItemEl.dataset.id

      if (menuParams.onItemClick) {
        menuParams.onItemClick(menuItemId, menuItemEl, event)
      }

      if (menuParams.closeOnItemClick) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        menuParams.onClose && menuParams.onClose(menuId, currentMenuEl)
        closeHandler()
      }
    },
    [menuParams, closeHandler, currentMenuEl, menuId]
  )

  useMemo(() => {
    if (isReady === null) return

    const installEventListeners = (): void => {
      if (isMenuCancelable) {
        currentBackdropEl?.addEventListener('click', closeHandler)
      }

      currentCloseBtnEl?.addEventListener('click', closeHandler)

      const menuItems: NodeListOf<HTMLLIElement> = currentMenuEl?.querySelectorAll('.menu-item')
      menuItems?.forEach((menuItem: HTMLLIElement) => {
        menuItem.addEventListener('click', itemClickHandler)
      })
    }

    const uninstallEventListeners = (): void => {
      if (isMenuCancelable) {
        currentBackdropEl?.removeEventListener('click', openHandler)
      }

      currentCloseBtnEl?.removeEventListener('click', openHandler)

      const menuItems: NodeListOf<HTMLLIElement> = currentMenuEl?.querySelectorAll('.menu-item')
      menuItems?.forEach((menuItem: HTMLLIElement) => {
        menuItem.removeEventListener('click', itemClickHandler)
      })
    }

    if (isReady) {
      installEventListeners()
    } else {
      uninstallEventListeners()
    }
     
  }, [isReady, isMenuCancelable, currentBackdropEl, currentCloseBtnEl, currentMenuEl, closeHandler, itemClickHandler, openHandler])

  useEffect(() => {
    if (opened === null) return

    const toggleMenu = async () => {
      try {
        if (opened) {
          await showMenu(menuParams, menuDuration, currentPart)
        } else {
          await hideMenu(menuDuration / 2, currentPart)
        }
      } catch {
        return
      }
    }

    toggleMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  const menuCallback: MenuCallback = {
    show: () => toggleOpened(true),
    hide: () => toggleOpened(false)
  }

  return menuCallback
}

export { useAbMenu }