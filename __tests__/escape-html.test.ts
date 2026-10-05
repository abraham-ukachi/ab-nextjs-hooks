import { describe, expect, it } from 'vitest'
import { abTextOrHtml, escapeAbHtml } from '../helpers/escapeAbHtml'

describe('escapeAbHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeAbHtml(`<img src=x onerror="alert(1)"> & "hi"`)).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &quot;hi&quot;',
    )
  })

  it('abTextOrHtml escapes by default and keeps markup when html is true', () => {
    expect(abTextOrHtml('<b>x</b>', false)).toBe('&lt;b&gt;x&lt;/b&gt;')
    expect(abTextOrHtml('<b>x</b>', true)).toBe('<b>x</b>')
    expect(abTextOrHtml('<b>x</b>', undefined)).toBe('&lt;b&gt;x&lt;/b&gt;')
  })
})
