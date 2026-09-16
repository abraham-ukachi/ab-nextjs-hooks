'use client'

import { useMemo } from 'react'

export interface AbBrandColorValue {
  primary: string
  accent: string
  on_accent: string
}

export type AbBrandColors = Record<string, AbBrandColorValue>

export type AbBrandColorType = 'primary' | 'accent' | 'on_accent'

export interface AbBrandColorsResult {
  brandColors: AbBrandColors
  getBrandColor: (key: string, type?: AbBrandColorType, colors?: AbBrandColors) => string
}

const DEFAULT_BRAND_COLORS: AbBrandColors = {
  lyd: { primary: '#7D7F50', accent: '#A6B796', on_accent: '#515b4a' },
  cg: { primary: '#BBBAB0', accent: '#F3BA00', on_accent: '#1c1504' },
  hexaa: { primary: '#9887B2', accent: '#DFCAFF', on_accent: '#443c50' }
}

const useBrandColors = (): AbBrandColorsResult => {
  const brandColors = useMemo(() => DEFAULT_BRAND_COLORS, [])

  const getBrandColor = (key: string, type: AbBrandColorType = 'primary', colors: AbBrandColors = brandColors): string => {
    return colors[key]?.[type]
  }

  return { brandColors, getBrandColor }
}

export { useBrandColors }

export default useBrandColors