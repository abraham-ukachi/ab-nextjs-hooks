'use client'

import { useMemo } from 'react'
import { buildAbLabels } from './helpers/buildAbLabels'
import type { AbLabels } from './helpers/buildAbLabels'

export type BridgeLabels = AbLabels

export interface BridgeLabelsResult {
  bridgeLabels: BridgeLabels
  bridgeKeys: Array<string>
  getBridgeLabel: (key: string, labels?: BridgeLabels) => string
}

export const DEFAULT_BRIDGE_KEYS: Array<string> = [
  'adjustableNosePads',
  'saddleBridge',
  'keyholeBridge',
  'doubleBridge',
  'singleBridge',
  'doubleNoseBridge',
  'tripleBridge',
  'saddleNoseBridge',
  'keyholeNoseBridge',
  'doubleKeyholeBridge',
  'doubleSaddleBridge',
  'doubleKeyholeNoseBridge',
  'doubleSaddleNoseBridge',
  'tripleKeyholeBridge',
  'tripleSaddleBridge',
  'tripleKeyholeNoseBridge',
  'tripleSaddleNoseBridge'
]

const useBridgeLabels = (
  defaultBridgeKeys: Array<string> = DEFAULT_BRIDGE_KEYS,
  labels?: BridgeLabels
): BridgeLabelsResult => {
  return useMemo(() => {
    const result = buildAbLabels<BridgeLabels>(defaultBridgeKeys, labels)

    return {
      bridgeLabels: result.labels,
      bridgeKeys: result.keys,
      getBridgeLabel: result.getLabel
    }
  }, [defaultBridgeKeys, labels])
}

export { useBridgeLabels }

export default useBridgeLabels