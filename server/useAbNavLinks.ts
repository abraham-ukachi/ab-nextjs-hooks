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
* @name: Nav Links - AB Server Hook
* @file: useAbNavLinks.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // Get the (labeled) default nav links for a sidebar
*    -|> import { useAbNavLinks } from './useAbNavLinks'
*    -|>
*    -|> const links = useAbNavLinks('sidebar')
*    -|>
*    -|> // console.log(links) // ==> [{ href: '/', icon: 'home', value: 'home', label: 'Home' }, ...]
*    -|>
*
*   2+|> // List the supported nav link values for a navbar
*    -|> const supported = useAbSupportedNavLinks('navbar')
*    -|>
*    -|> // console.log(supported) // ==> ['home', 'shop', 'search', 'cart', 'more']
*    -|>
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// ===== AB NAV LINKS - TYPES & CONSTANTS ===== //


// create a navigation bar type as `AbNavBarType` ('sidebar' or 'navbar')
export type AbNavBarType = 'sidebar' | 'navbar'

// create a navigation link interface as `AbNavLink`
export interface AbNavLink {
  href: string
  icon: string
  value: string
  label: string
}

// --- DEFAULT NAV LINKS ---

// default sidebar links (label-less; resolved via `DEFAULT_AB_NAV_LABELS`)
const sidebarLinks: Array<Omit<AbNavLink, 'label'>> = [
  { href: '/', icon: 'home', value: 'home' },
  { href: '/shop', icon: 'eyeglasses', value: 'shop' },
  { href: '/explore', icon: 'explore', value: 'explore' },
  { href: '/search', icon: 'search', value: 'search' },
  { href: '/cart', icon: 'shopping_bag', value: 'cart' },
  { href: '#more', icon: 'more_horiz', value: 'more' }
]

// default navbar links (a slightly trimmed subset of the sidebar set)
const navbarLinks: Array<Omit<AbNavLink, 'label'>> = [
  { href: '/', icon: 'home', value: 'home' },
  { href: '/shop', icon: 'eyeglasses', value: 'shop' },
  { href: '/search', icon: 'search', value: 'search' },
  { href: '/cart', icon: 'shopping_bag', value: 'cart' },
  { href: '#more', icon: 'more_horiz', value: 'more' }
]

// default human-friendly labels, keyed by (`link`) value
// TODO: make these customizable per bar type
export const DEFAULT_AB_NAV_LABELS: Record<string, string> = {
  home: 'Home',
  shop: 'Shop',
  explore: 'Explore',
  search: 'Search',
  cart: 'Cart',
  more: 'More'
}



// ===== AB NAV LINKS - HELPERS ===== //


// grab the default (label-less) nav links for a given bar type
const getDefaultNavLinks = (barType: AbNavBarType): Array<Omit<AbNavLink, 'label'>> => {
  if (barType === 'sidebar') return sidebarLinks
  if (barType === 'navbar') return navbarLinks

  // unknown bar type -> no links
  return []
}



// ===== AB NAV LINKS - HOOKS ===== //


/**
 * @name useAbNavLinks
 * @description A nav links hook that builds the default links for a bar type,
 *   embellished with a human-friendly `label` for each link
 *
 * @param { AbNavBarType } barType - Which nav set to use ('sidebar' or 'navbar')
 * @param { Record<string, string> } labels - Label lookup, keyed by link `value`
 *
 * @returns { Array<AbNavLink> }
 */
const useAbNavLinks = (barType: AbNavBarType, labels: Record<string, string> = DEFAULT_AB_NAV_LABELS): Array<AbNavLink> => {
  // map over the default (label-less) links & attach a resolved label
  return getDefaultNavLinks(barType).map((link) => ({ ...link, label: labels[link.value] ?? link.value }))
}

/**
 * @name useAbSupportedNavLinks
 * @description A nav links hook that lists the supported link values for a bar type
 *
 * @param { AbNavBarType } barType - Which nav set to use ('sidebar' or 'navbar')
 *
 * @returns { Array<string> }
 */
const useAbSupportedNavLinks = (barType: AbNavBarType): Array<string> => {
  // map over the default links & keep only their `value`
  return getDefaultNavLinks(barType).map(({ value }) => value)
}


// export `useAbNavLinks` & `useAbSupportedNavLinks` hooks as named exports
export { useAbNavLinks, useAbSupportedNavLinks }