import { beforeEach, describe, expect, it } from 'vitest'
import {
  AB_THEME_LEGACY_STORAGE_KEY,
  AB_THEME_STORAGE_KEY,
  applyAbThemeToDocument,
  readAbThemeFromStorage,
} from '../useAbTheme'

describe('useAbTheme storage + document', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.theme
    document.documentElement.style.colorScheme = ''
    document.body.dataset.theme = 'dark'
  })

  it('applies the theme on <html> (class, data-theme, color-scheme) and clears body[data-theme]', () => {
    applyAbThemeToDocument('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(document.body.dataset.theme).toBeUndefined()
  })

  it('reads `theme`, migrates legacy `abTheme`, and falls back', () => {
    expect(readAbThemeFromStorage('light')).toBe('light')
    window.localStorage.setItem(AB_THEME_LEGACY_STORAGE_KEY, 'dark')
    expect(readAbThemeFromStorage()).toBe('dark')
    expect(window.localStorage.getItem(AB_THEME_STORAGE_KEY)).toBe('dark')
    window.localStorage.setItem(AB_THEME_STORAGE_KEY, 'light')
    expect(readAbThemeFromStorage()).toBe('light')
  })
})
