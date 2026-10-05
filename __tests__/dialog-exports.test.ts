import { describe, expect, it } from 'vitest'
import {
  type AbDialogPart,
  type DialogParams,
  useAbDialog,
} from '../index'

describe('dialog public types', () => {
  it('exports useAbDialog and the DialogParams / AbDialogPart types', () => {
    expect(typeof useAbDialog).toBe('function')
    const part: AbDialogPart = 'aside'
    const params: DialogParams = {
      title: 'Hi',
      message: '<b>x</b>',
      html: false,
      onConfirm: () => false,
      onCancel: () => undefined,
    }
    expect(part).toBe('aside')
    expect(params.html).toBe(false)
  })
})
