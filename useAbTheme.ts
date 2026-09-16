'use client'

import { useEffect, useState } from 'react'

export const DEFAULT_AB_THEME = 'light'

export type AbThemeResult = [string, (theme: string) => void]

export interface AbThemeInterface {
  (initialTheme?: string): AbThemeResult
}

const useAbTheme: AbThemeInterface = (initialTheme: string = DEFAULT_AB_THEME): AbThemeResult => {
  if (typeof window !== 'undefined') {
    initialTheme = window.localStorage.getItem('abTheme') ?? initialTheme
  }

  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem('abTheme', theme)
    window.document.body.dataset.theme = theme
  }, [theme])

  const updateTheme = (theme: string): void => {
    setTheme(theme)
  }

  return [theme, updateTheme]
}

export { useAbTheme }