/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-hooks
* @name: abPartSelectors - Helper
* @file: helpers/abPartSelectors.ts
*/

/** Where a dialog / menu / toast can live on the page. */
export type AbPart = 'main' | 'aside' | 'full'

/**
 * The real aside layout (`<aside class="AbAsideLayout" data-ab-part="aside">`).
 * Never the first `<aside>` on the page (sidebars used to be an `<aside>`, and
 * other asides may exist): dialogs / menus / toasts must target this one.
 */
export const AB_ASIDE_LAYOUT_SELECTOR = 'aside.AbAsideLayout, aside[data-ab-part="aside"]'

/** The main landmark (`<main class="AbMainLayout">`). */
export const AB_MAIN_LAYOUT_SELECTOR = 'main.AbMainLayout, main[data-ab-part="main"], main'

/**
 * Returns the dialogs / menus / toasts / backdrop container for a part.
 * `kind` is the class (Dialogs, Menus, Toasts, Backdrop) or the full-page id.
 */
export function getAbPartElement(
  part: AbPart | string,
  kind: 'Dialogs' | 'Menus' | 'Toasts' | 'Backdrop',
): HTMLElement | null {
  if (typeof document === 'undefined') return null
  if (part === 'full') {
    const id = kind === 'Dialogs' ? 'dialogs' : kind === 'Menus' ? 'menus' : kind === 'Toasts' ? 'toasts' : 'backdrop'
    return document.getElementById(id)
  }
  const root =
    part === 'aside'
      ? (document.querySelector(AB_ASIDE_LAYOUT_SELECTOR) as HTMLElement | null)
      : (document.querySelector(AB_MAIN_LAYOUT_SELECTOR) as HTMLElement | null)
  return (root?.querySelector(`:scope > .${kind}`) as HTMLElement | null) ?? null
}
