import { humanizeKey } from './humanizeKeys'

export type AbLabels = Record<string, string>

export interface AbLabelsResult<T extends AbLabels = AbLabels> {
  labels: T
  keys: Array<string>
  getLabel: (key: string, labels?: T) => string
}

const buildAbLabels = <T extends AbLabels>(defaultKeys: Array<string>, labels?: T): AbLabelsResult<T> => {
  const keys: Array<string> = [...defaultKeys]
  const result: Record<string, string> = {}

  keys.forEach((key: string) => {
    result[key] = labels?.[key] ?? humanizeKey(key)
  })

  const getLabel = (key: string, currentLabels: T = result as T): string => currentLabels[key]

  return { labels: result as T, keys, getLabel }
}

export { buildAbLabels }