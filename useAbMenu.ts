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
* @name: Menu - AB Client Hook
* @file: useAbMenu.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Use the menu hook
*    -|> import useAbMenu from './useAbMenu'
*    -|>
*    -|> const { show, hide } = useAbMenu({ id: 'my-menu', origin: 'top' })
*    -|>
*    -|> show() // ==> slides the menu in & shows the backdrop ;)
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
import { useCallback, useEffect, useMemo, useState } from 'react'
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




// ===== MENU - TYPES & CONSTANTS ===== //


// menu type that describes a classic, all-purpose menu
export const NORMAL_MENU = 'normal'


// default menu type; equal to `NORMAL_MENU`
export const DEFAULT_MENU = NORMAL_MENU


// default duration of a menu show/hide animation (in seconds)
export const DEFAULT_MENU_DURATION = 0.5


// shape of the params passed to the menu hook (what, where & how the menu behaves)
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


// simple API every menu exposes to the outside world
export interface MenuCallback {
  show: () => void
  hide: () => void
}




// ===== useAbMenu - AB HOOK ===== //


/**
 * @name useAbMenu
 * @description A menu hook that finds a menu + its backdrop on the page, then shows
 * or hides it with fancy animations (fadeIn/fadeOut, slideFromDown/slideDown) while
 * wiring up click handlers on the backdrop & close button
 *
 * @param { MenuParams } params - The menu descriptor (id, origin, callbacks, ...)
 * @param { number } duration - The show/hide animation duration (in seconds)
 * @param { string } part - Where the menu lives (`'main'`, `'aside'` or `'full'`)
 *
 * @returns { MenuCallback }
 */
const useAbMenu = (params: MenuParams, duration: number = DEFAULT_MENU_DURATION, part: string = 'full'): MenuCallback => {

  // is the menu currently open? `null` = not decided yet
  const [opened, toggleOpened] = useAbToggle(null)

  // is the menu DOM actually mounted & ready for action?
  const [isReady, toggleIsReady] = useAbToggle(null)

  // copy of the initial params (may be updated later by `showMenu`)
  const [menuParams, setMenuParams] = useState<MenuParams>(params)

  // keep the animation duration, once, for the lifetime of the hook
  const [menuDuration] = useState<number>(duration)

  // keep the part (`'main'` / `'aside'` / `'full'`), once, for the lifetime of the hook
  const [currentPart] = useState<string>(part)

  // --- menu identity states ---
  const [menuId, setMenuId] = useState<string>(params.id)
  const [menuType, setMenuType] = useState<string>(params.type || DEFAULT_MENU)
  const [menuOrigin, setMenuOrigin] = useState<string>(params.origin)
  const [isMenuCancelable, setIsMenuCancelable] = useState<boolean>(params.isCancelable || false)

  // --- queried DOM elements (gathered once the page has loaded) ---
  const [currentMenusEl, setCurrentMenusEl] = useState<HTMLDivElement>(null)
  const [currentMenuOriginEl, setCurrentMenuOriginEl] = useState<HTMLUListElement>(null)
  const [currentMenuEl, setCurrentMenuEl] = useState<HTMLDivElement>(null)

  const [currentBackdropEl, setCurrentBackdropEl] = useState<HTMLDivElement>(null)
  const [currentCloseBtnEl, setCurrentCloseBtnEl] = useState<HTMLButtonElement>(null)

  // --- animation timers ---
  const [hideBackdropTimer, setHideBackdropTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [hideMenuTimer, setHideMenuTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [showMenuTimer, setShowMenuTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // locate the menu + backdrop elements in the DOM, exactly once the document exists
  useEffect(() => {
    if (typeof document === 'undefined') return

    // grab the container elements (by id & by part-specific selectors)
    const menusEl = document.getElementById('menus') as HTMLDivElement
    const mainMenusEl = document.querySelector('main > .Menus') as HTMLDivElement
    const asideMenusEl = document.querySelector('aside > .Menus') as HTMLDivElement

    const backdropEl = document.getElementById('backdrop') as HTMLDivElement
    const mainBackdropEl = document.querySelector('main > .Backdrop') as HTMLDivElement
    const asideBackdropEl = document.querySelector('aside > .Backdrop') as HTMLDivElement

    // pick the elements matching our current part & menu id
    setCurrentMenusEl((currentPart === 'main' ? mainMenusEl : currentPart === 'aside' ? asideMenusEl : menusEl) as HTMLDivElement)
    setCurrentMenuOriginEl(currentMenusEl?.querySelector(`:scope > .${menuOrigin}`) as HTMLUListElement)
    setCurrentMenuEl(currentMenuOriginEl?.querySelector(`:scope > [data-id="${menuId}"]`) as HTMLDivElement)
    setCurrentBackdropEl((currentPart === 'main' ? mainBackdropEl : currentPart === 'aside' ? asideBackdropEl : backdropEl) as HTMLDivElement)
    setCurrentCloseBtnEl(currentMenuEl?.querySelector(`li[role="close-menu"] button`) as HTMLButtonElement)

    // if we found both the menu & its backdrop, mark the hook as ready
    if (currentMenuEl && currentBackdropEl) {
      toggleIsReady(true)
    }

    // clean up any pending timers when the part/id/el changes or on unmount
    return () => {
      clearTimeout(hideBackdropTimer)
      clearTimeout(hideMenuTimer)
      clearTimeout(showMenuTimer)
    }

  }, [currentPart, menuOrigin, menuId, currentMenusEl, currentMenuOriginEl, currentMenuEl, toggleIsReady, hideBackdropTimer, hideMenuTimer, showMenuTimer, currentBackdropEl])

  // show the backdrop (+ flag it as cancelable)
  const showBackdrop = useCallback(
    (isCancelable: boolean = isMenuCancelable): void => {
      currentBackdropEl?.setAttribute('cancelable', isCancelable.toString())
      currentBackdropEl.hidden = false
    },
    [currentBackdropEl, isMenuCancelable]
  )

  // fade the backdrop out, then hide it once the fade completes
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

  // hide the menu: fade out + slide down, then trigger `onClose`
  const hideMenu = useCallback(
    (hideDuration: number = menuDuration, hidePart: string = currentPart): Promise<boolean> => {
      return new Promise((resolve, reject) => {

        // bail out early if the menu hasn't been found in the DOM, yet
        if (!currentMenuEl) {
          return reject(`Menu with menuId "${menuId}" doesn't exist in ${hidePart} part. Yet.`)
        }

        // start by fading out the backdrop
        hideBackdrop()

        // animate the menus container & the menu itself out of sight
        currentMenusEl.classList.remove('fadeIn')
        currentMenusEl.classList.add('fadeOut')

        currentMenuEl.classList.remove('slideFromDown')
        currentMenuEl.classList.add('slideDown')

        // reset any pending show/hide timers before scheduling the hide
        clearTimeout(hideMenuTimer)
        clearTimeout(showMenuTimer)

        setHideMenuTimer(
          setTimeout(() => {
            // deactivate & dispatch the onClose callback once hidden
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

  // show the menu: fade in + slide up, then trigger `onOpen`
  const showMenu = useCallback(
    (showParams: MenuParams = menuParams, showDuration: number = menuDuration, showPart: string = currentPart): Promise<boolean | HTMLDivElement> => {
      return new Promise((resolve, reject) => {

        // can't show what we can't find
        if (!currentMenuEl) {
          return reject(`Menu with id "${showParams.id}" doesn't exist in ${showPart}`)
        }

        // if a *different* menu is requested, swap all of the menu states first
        if (showParams.id !== menuParams.id) {
          setMenuParams(showParams)
          setMenuId(showParams.id)
          setMenuType(showParams.type || DEFAULT_MENU)
          setMenuOrigin(showParams.origin)
          setIsMenuCancelable(showParams.isCancelable || false)
        }

        // reveal the backdrop (with its own cancelable flag)
        showBackdrop(showParams.isCancelable)

        // unhide the menu & its container
        currentMenuEl.hidden = false
        currentMenusEl.hidden = false

        // animate everything back into view
        currentMenusEl.classList.remove('fadeOut')
        currentMenusEl.classList.add('fadeIn')

        currentMenuEl.classList.remove('slideDown')
        currentMenuEl.classList.add('slideFromDown')

        currentMenuEl.setAttribute('data-type', menuType)

        // reset any pending hide/show timers before scheduling the show
        clearTimeout(showMenuTimer)
        clearTimeout(hideMenuTimer)

        setShowMenuTimer(
          setTimeout(() => {
            // mark as active & dispatch the onOpen callback once fully shown
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

  // open the menu (just flips the `opened` toggle; the effect below does the rest)
  const openHandler = useCallback((): void => {
    toggleOpened(true)
  }, [toggleOpened])

  // close the menu (same trick as `openHandler`)
  const closeHandler = useCallback((): void => {
    toggleOpened(false)
  }, [toggleOpened])

  // handle a click on any `.menu-item` inside the current menu
  const itemClickHandler = useCallback(
    (event: MouseEvent): void => {
      const menuItemEl = event.currentTarget as HTMLLIElement
      const menuItemId = menuItemEl.dataset.id

      // fire the user's `onItemClick` callback (if any) first
      if (menuParams.onItemClick) {
        menuParams.onItemClick(menuItemId, menuItemEl, event)
      }

      // close the menu (after closing) if requested
      if (menuParams.closeOnItemClick) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        menuParams.onClose && menuParams.onClose(menuId, currentMenuEl)
        closeHandler()
      }
    },
    [menuParams, closeHandler, currentMenuEl, menuId]
  )

  // wire up / undo all event listeners whenever the menu's "ready" state changes
  useMemo(() => {
    if (isReady === null) return

    const installEventListeners = (): void => {

      // clicking the backdrop closes the menu (only when cancelable)
      if (isMenuCancelable) {
        currentBackdropEl?.addEventListener('click', closeHandler)
      }

      // clicking the close button closes the menu, always
      currentCloseBtnEl?.addEventListener('click', closeHandler)

      // every `.menu-item` gets the shared click handler
      const menuItems: NodeListOf<HTMLLIElement> = currentMenuEl?.querySelectorAll('.menu-item')
      menuItems?.forEach((menuItem: HTMLLIElement) => {
        menuItem.addEventListener('click', itemClickHandler)
      })
    }

    const uninstallEventListeners = (): void => {

      // mirror the above, but backwards ^_^
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

  // actually show/hide the menu whenever `opened` flips
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

  // build the public `MenuCallback`: `show` opens, `hide` closes
  const menuCallback: MenuCallback = {
    show: () => toggleOpened(true),
    hide: () => toggleOpened(false)
  }

  // return the `show` / `hide` API
  return menuCallback
}


// export `useAbMenu` hook as named export
export { useAbMenu }