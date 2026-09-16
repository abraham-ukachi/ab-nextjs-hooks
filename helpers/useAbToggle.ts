'use client'

import { useCallback, useState } from 'react'

export type AbToggleValue = boolean | null

export type AbToggleCallback = (value?: AbToggleValue) => void

export type UseAbToggleResult = [AbToggleValue, AbToggleCallback]

const useAbToggle = (initialValue: AbToggleValue = null): UseAbToggleResult => {
  const [value, setValue] = useState<AbToggleValue>(initialValue)

  const toggle = useCallback((newValue?: AbToggleValue): void => {
    setValue((current: AbToggleValue) => (newValue !== undefined ? newValue : !current))
  }, [])

  return [value, toggle]
}

export { useAbToggle }