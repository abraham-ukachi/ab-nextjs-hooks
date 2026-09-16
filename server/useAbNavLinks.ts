export type AbNavBarType = 'sidebar' | 'navbar'

export interface AbNavLink {
  href: string
  icon: string
  value: string
  label: string
}

const sidebarLinks: Array<Omit<AbNavLink, 'label'>> = [
  { href: '/', icon: 'home', value: 'home' },
  { href: '/shop', icon: 'eyeglasses', value: 'shop' },
  { href: '/explore', icon: 'explore', value: 'explore' },
  { href: '/search', icon: 'search', value: 'search' },
  { href: '/cart', icon: 'shopping_bag', value: 'cart' },
  { href: '#more', icon: 'more_horiz', value: 'more' }
]

const navbarLinks: Array<Omit<AbNavLink, 'label'>> = [
  { href: '/', icon: 'home', value: 'home' },
  { href: '/shop', icon: 'eyeglasses', value: 'shop' },
  { href: '/search', icon: 'search', value: 'search' },
  { href: '/cart', icon: 'shopping_bag', value: 'cart' },
  { href: '#more', icon: 'more_horiz', value: 'more' }
]

export const DEFAULT_AB_NAV_LABELS: Record<string, string> = {
  home: 'Home',
  shop: 'Shop',
  explore: 'Explore',
  search: 'Search',
  cart: 'Cart',
  more: 'More'
}

const getDefaultNavLinks = (barType: AbNavBarType): Array<Omit<AbNavLink, 'label'>> => {
  if (barType === 'sidebar') return sidebarLinks
  if (barType === 'navbar') return navbarLinks

  return []
}

const useAbNavLinks = (barType: AbNavBarType, labels: Record<string, string> = DEFAULT_AB_NAV_LABELS): Array<AbNavLink> => {
  return getDefaultNavLinks(barType).map((link) => ({ ...link, label: labels[link.value] ?? link.value }))
}

const useAbSupportedNavLinks = (barType: AbNavBarType): Array<string> => {
  return getDefaultNavLinks(barType).map(({ value }) => value)
}

export { useAbNavLinks, useAbSupportedNavLinks }