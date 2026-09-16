'use client'

import { useState } from 'react'

export const BASIC_CONFETTI = 'basic'

export const RANDOM_CONFETTI = 'random'

export const DEFAULT_CONFETTI_PART = 'main'

export interface AbConfettiOptions {
  count?: number
  spread?: number
  position?: { x?: number; y?: number }
  angle?: number
}

export type AbPopConfetti = (options: AbConfettiOptions, part: string) => boolean

export interface AbConfettiResult {
  pop: () => boolean
  updateCount: (count: number, multiplier?: number) => AbConfettiResult
  updateSpread: (spread: number, multiplier?: number) => AbConfettiResult
  updatePosition: (position: { x?: number; y?: number }) => AbConfettiResult
}

export type ConfettiResult = AbConfettiResult

const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min

const useAbConfetti = (
  confettiType: string = BASIC_CONFETTI,
  confettiPart: string = DEFAULT_CONFETTI_PART,
  popConfetti: AbPopConfetti = (): boolean => false
): AbConfettiResult => {
  const [count, setCount] = useState<number>(50)
  const [spread, setSpread] = useState<number>(70)
  const [position, setPosition] = useState<{ x?: number; y?: number }>({ y: 0.6 })

  const pop = (): boolean => {
    if (confettiType === RANDOM_CONFETTI) {
      return popConfetti(
        {
          count: randomInRange(count, count * 2),
          spread: randomInRange(spread - 20, spread),
          position,
          angle: randomInRange(55, 125)
        },
        confettiPart
      )
    }

    return popConfetti({ count, spread, position }, confettiPart)
  }

  const updateCount = (newCount: number, multiplier: number = 1): AbConfettiResult => {
    setCount(newCount + newCount * multiplier)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  const updateSpread = (newSpread: number, multiplier: number = 1): AbConfettiResult => {
    setSpread(newSpread + newSpread * multiplier)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  const updatePosition = (newPosition: { x?: number; y?: number }): AbConfettiResult => {
    setPosition(newPosition)

    return { pop, updateCount, updateSpread, updatePosition }
  }

  return { pop, updateCount, updateSpread, updatePosition }
}

export { useAbConfetti }