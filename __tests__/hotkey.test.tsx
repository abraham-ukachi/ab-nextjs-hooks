/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-hooks
* @name: useAbHotkey tests (G10, D49)
* @file: __tests__/hotkey.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { afterEach, describe, expect, it, vi } from 'vitest'
// 🪝 hook renderer
import { cleanup, renderHook } from '@testing-library/react'
// 🖨️ server renderer (SSR checks)
import { renderToString } from 'react-dom/server'
// ⚛️ element factory
import { createElement } from 'react'
// ⌨️ under test
import {
  AB_HOTKEY_SEARCH,
  formatAbHotkey,
  getAbHotkeyAriaKeyshortcuts,
  isAbApplePlatform,
  allowsAbHotkeyInInputs,
  isAbEditableTarget,
  matchAbHotkey,
  parseAbHotkey,
  useAbHotkey,
  useAbHotkeyLabel,
} from '../useAbHotkey'

// ⌨️ dispatch a keydown on `target` (window by default) and return the event
function press(init: KeyboardEventInit & { keyCode?: number }, target: EventTarget = window): KeyboardEvent {
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }) // 🧱
  if (init.keyCode !== undefined) Object.defineProperty(e, 'keyCode', { value: init.keyCode }) // 🈳 happy-dom ignores keyCode in init
  target.dispatchEvent(e) // 🚀
  return e // 📦
}

// 🧹 every test unmounts its hooks (= removes their listeners) and cleans its DOM
afterEach(() => { cleanup(); document.body.innerHTML = '' })

describe('parseAbHotkey 🧩', () => {
  it('parses modifiers, aliases and the main key (case-insensitive)', () => {
    expect(parseAbHotkey('Mod+K')).toEqual({ key: 'k', mod: true, ctrl: false, meta: false, alt: false, shift: false }) // 🍎
    expect(parseAbHotkey('ctrl+shift+p')).toMatchObject({ key: 'p', ctrl: true, shift: true }) // ⌃⇧
    expect(parseAbHotkey('cmd+option+esc')).toMatchObject({ key: 'escape', meta: true, alt: true }) // ⌘⌥⎋
    expect(parseAbHotkey('mod+space').key).toBe(' ') // ␣
    expect(parseAbHotkey('mod++').key).toBe('+') // ➕ trailing ++
    expect(parseAbHotkey('mod+plus').key).toBe('+') // ➕ alias
  })
  it('throws on a combo with no key', () => {
    expect(() => parseAbHotkey('mod+shift')).toThrow(/no key/) // 🧯
    expect(() => parseAbHotkey('')).toThrow(/no key/) // 🧯
  })
  it('keeps the last key when more than one is listed, and warns in dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 👀
    expect(parseAbHotkey('mod+k+p')).toEqual({ key: 'p', mod: true, ctrl: false, meta: false, alt: false, shift: false }) // 🔑 last wins
    expect(warn).toHaveBeenCalledTimes(1) // ⚠️
    expect(String(warn.mock.calls[0][0])).toMatch(/more than one key.*"p"/) // 📝
    warn.mockClear() // 🧹
    expect(parseAbHotkey('mod+k')).toMatchObject({ key: 'k' }) // ✅ a normal combo
    expect(warn).not.toHaveBeenCalled() // 🔕
    warn.mockRestore() // 🧹
  })
})

describe('matchAbHotkey 🎯', () => {
  it('mod = Meta on Apple, Control elsewhere (strict)', () => {
    expect(matchAbHotkey({ key: 'k', code: 'KeyK', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+k', 'apple')).toBe(true) // ⌘K 🍎
    expect(matchAbHotkey({ key: 'k', code: 'KeyK', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false }, 'mod+k', 'apple')).toBe(false) // ⌃K on a Mac ≠ mod
    expect(matchAbHotkey({ key: 'k', code: 'KeyK', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false }, 'mod+k', 'other')).toBe(true) // Ctrl+K 🪟
    expect(matchAbHotkey({ key: 'k', code: 'KeyK', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+k', 'other')).toBe(false) // Win+K ≠ mod
  })
  it('modifiers are exact: mod+k does not fire on mod+shift+k or a bare k', () => {
    expect(matchAbHotkey({ key: 'K', code: 'KeyK', metaKey: false, ctrlKey: true, altKey: false, shiftKey: true }, 'mod+k', 'other')).toBe(false) // ⇧ extra
    expect(matchAbHotkey({ key: 'k', code: 'KeyK', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+k', 'other')).toBe(false) // no mod
    expect(matchAbHotkey({ key: 'K', code: 'KeyK', metaKey: false, ctrlKey: true, altKey: false, shiftKey: true }, 'mod+shift+k', 'other')).toBe(true) // ✅ asked for ⇧
  })
  it('falls back to event.code for letters (ru layout, Option-modified keys)', () => {
    expect(matchAbHotkey({ key: 'л', code: 'KeyK', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+k', 'apple')).toBe(true) // 🇷🇺 ⌘K
    expect(matchAbHotkey({ key: 'л', code: 'KeyL', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+k', 'apple')).toBe(false) // 🙅 another key
  })
  it('falls back to event.code for digits (Digit0–Digit9)', () => {
    expect(matchAbHotkey({ key: 'é', code: 'Digit2', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false }, 'mod+2', 'other')).toBe(true) // 🇫🇷 Ctrl+2
    expect(matchAbHotkey({ key: 'é', code: 'Digit3', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false }, 'mod+2', 'other')).toBe(false) // 🙅 another digit
  })
  it('ignores Shift for symbols written without it ("?" is Shift+/)', () => {
    expect(matchAbHotkey({ key: '?', code: 'Slash', metaKey: false, ctrlKey: false, altKey: false, shiftKey: true }, '?', 'other')).toBe(true) // ❓
    expect(matchAbHotkey({ key: '/', code: 'Slash', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false }, '/', 'other')).toBe(true) // ⌨️
  })
})

describe('labels 🏷️', () => {
  it('formats the key cap per platform', () => {
    expect(formatAbHotkey(AB_HOTKEY_SEARCH, 'apple')).toBe('⌘K') // 🍎
    expect(formatAbHotkey(AB_HOTKEY_SEARCH, 'other')).toBe('Ctrl+K') // 🪟
    expect(formatAbHotkey('mod+shift+p', 'apple')).toBe('⇧⌘P') // 🍎 symbol order
    expect(formatAbHotkey('alt+esc', 'other')).toBe('Alt+Esc') // 🪟
  })
  it('builds aria-keyshortcuts per platform', () => {
    expect(getAbHotkeyAriaKeyshortcuts('mod+k', 'apple')).toBe('Meta+K') // ♿ 🍎
    expect(getAbHotkeyAriaKeyshortcuts('mod+k', 'other')).toBe('Control+K') // ♿ 🪟
    expect(getAbHotkeyAriaKeyshortcuts('shift+space', 'other')).toBe('Shift+Space') // ♿
  })
  it('detects Apple platforms from any navigator hint', () => {
    expect(isAbApplePlatform({ platform: 'MacIntel' })).toBe(true) // 🍎
    expect(isAbApplePlatform({ userAgentData: { platform: 'macOS' } })).toBe(true) // 🍎 client hints
    expect(isAbApplePlatform({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' })).toBe(true) // 📱
    expect(isAbApplePlatform({ userAgentData: { platform: 'Windows' }, platform: 'Win32' })).toBe(false) // 🪟
  })
  it('useAbHotkeyLabel: SSR renders the Ctrl label (no navigator guess on the server)', () => {
    const Probe = () => { const l = useAbHotkeyLabel('mod+k'); return createElement('kbd', { 'aria-keyshortcuts': l.ariaKeyShortcuts }, l.label) } // 🧪
    expect(renderToString(createElement(Probe))).toBe('<kbd aria-keyshortcuts="Control+K">Ctrl+K</kbd>') // 🖨️
  })
  it('useAbHotkeyLabel: a forced platform wins on the client', () => {
    const { result } = renderHook(() => useAbHotkeyLabel('mod+k', 'apple')) // 🍎
    expect(result.current).toEqual({ label: '⌘K', ariaKeyShortcuts: 'Meta+K', apple: true }) // ✅
  })
})

describe('allowsAbHotkeyInInputs ✍️', () => {
  it('defaults to true for mod / ctrl / meta / alt, false for a bare or Shift-only key', () => {
    expect(allowsAbHotkeyInInputs('mod+k')).toBe(true) // 🍎 platform modifier
    expect(allowsAbHotkeyInInputs('ctrl+k')).toBe(true) // ⌃
    expect(allowsAbHotkeyInInputs('meta+k')).toBe(true) // ⌘
    expect(allowsAbHotkeyInInputs('alt+k')).toBe(true) // ⌥
    expect(allowsAbHotkeyInInputs('/')).toBe(false) // ⌨️ bare
    expect(allowsAbHotkeyInInputs('shift+k')).toBe(false) // ⇧ alone does not count
    expect(allowsAbHotkeyInInputs('mod+shift+k')).toBe(true) // 🍎 still a real modifier
  })
  it('an explicit allowInInputs always wins', () => {
    expect(allowsAbHotkeyInInputs('mod+k', false)).toBe(false) // 🙅
    expect(allowsAbHotkeyInInputs('/', true)).toBe(true) // ✅
  })
})

describe('isAbEditableTarget ✍️', () => {
  it('text fields count, buttons / checkboxes do not', () => {
    document.body.innerHTML = '<input id="t"><input id="c" type="checkbox"><textarea id="a"></textarea><select id="s"><option>a</option></select><div contenteditable="true"><span id="r">x</span></div><button id="b"></button><div role="textbox" id="x"></div>' // 🧱
    const $ = (id: string) => document.getElementById(id) // 🔎
    expect(isAbEditableTarget($('t'))).toBe(true) // 🔤
    expect(isAbEditableTarget($('a'))).toBe(true) // 📝
    expect(isAbEditableTarget($('s'))).toBe(true) // 📋 a <select> is "typing" (jump-to-option)
    expect(isAbEditableTarget($('r'))).toBe(true) // ✏️ inside contenteditable
    expect(isAbEditableTarget($('x'))).toBe(true) // ♿ role=textbox
    expect(isAbEditableTarget($('c'))).toBe(false) // ☑️
    expect(isAbEditableTarget($('b'))).toBe(false) // 🔘
    expect(isAbEditableTarget(window)).toBe(false) // 🪟
  })
})

describe('useAbHotkey ⌨️', () => {
  it('calls the handler once per press, with the combo, and prevents the default', () => {
    const fn = vi.fn() // 🔔
    renderHook(() => useAbHotkey('mod+k', fn, { platform: 'other' })) // 🪟
    const e = press({ key: 'k', code: 'KeyK', ctrlKey: true }) // ⌨️ Ctrl+K
    expect(fn).toHaveBeenCalledTimes(1) // ✅ once
    expect(fn.mock.calls[0][1]).toBe('mod+k') // 🏷️ the combo
    expect(e.defaultPrevented).toBe(true) // 🚫 browser search bar
  })
  it('preventDefault: false leaves the browser action alone', () => {
    const fn = vi.fn() // 🔔
    renderHook(() => useAbHotkey('mod+k', fn, { platform: 'other', preventDefault: false })) // 🪟
    expect(press({ key: 'k', ctrlKey: true }).defaultPrevented).toBe(false) // ✅
    expect(fn).toHaveBeenCalledTimes(1) // 🔔
  })
  it('a modifier combo (mod+k) fires in inputs by default; a bare key does not', () => {
    document.body.innerHTML = '<input id="q">' // 🔤
    const input = document.getElementById('q')! // 🎯
    const fn = vi.fn() // 🔔
    renderHook(() => useAbHotkey(['mod+k', '/'], fn, { platform: 'other' })) // 🪟 mixed combos, no explicit flag
    press({ key: 'k', ctrlKey: true }, input) // ✍️ Ctrl+K in the input
    expect(fn.mock.calls.map((c) => c[1])).toEqual(['mod+k']) // ✅ modifier combo fires (decided per combo)
    press({ key: '/' }, input) // ✍️ a slash while typing
    expect(fn).toHaveBeenCalledTimes(1) // 🙈 bare '/' stays silent in the input
    press({ key: '/' }) // 🪟 the same '/' outside the input
    expect(fn.mock.calls.map((c) => c[1])).toEqual(['mod+k', '/']) // ✅ bare key still works outside
  })
  it('an explicit allowInInputs always wins, even against the default', () => {
    document.body.innerHTML = '<input id="q">' // 🔤
    const input = document.getElementById('q')! // 🎯
    const off = vi.fn(), on = vi.fn() // 🔔
    renderHook(() => useAbHotkey('mod+k', off, { platform: 'other', allowInInputs: false })) // 🙅 opt out of the modifier default
    press({ key: 'k', ctrlKey: true }, input) // ✍️
    expect(off).not.toHaveBeenCalled() // 🙈
    renderHook(() => useAbHotkey('/', on, { allowInInputs: true })) // ✅ opt a bare key in
    press({ key: '/' }, input) // ✍️
    expect(on).toHaveBeenCalledTimes(1) // 🔔
  })
  it('ignores IME composition and held-down repeats (unless allowRepeat)', () => {
    const fn = vi.fn() // 🔔
    const { rerender } = renderHook(({ repeat }) => useAbHotkey('mod+k', fn, { platform: 'other', allowRepeat: repeat }), { initialProps: { repeat: false } })
    press({ key: 'k', ctrlKey: true, isComposing: true }) // 🈳
    press({ key: 'Process', ctrlKey: true, keyCode: 229 }) // 🈳 legacy IME signal
    press({ key: 'k', ctrlKey: true, repeat: true }) // 🔁
    expect(fn).not.toHaveBeenCalled() // 🙈
    rerender({ repeat: true }) // ✅
    press({ key: 'k', ctrlKey: true, repeat: true }) // 🔁
    expect(fn).toHaveBeenCalledTimes(1) // 🔔
  })
  it('two bindings of the same combo fire once (the second skips a handled event)', () => {
    const a = vi.fn(), b = vi.fn() // 🔔🔔
    renderHook(() => { useAbHotkey('mod+k', a, { platform: 'other' }); useAbHotkey('mod+k', b, { platform: 'other' }) }) // 👯
    press({ key: 'k', ctrlKey: true }) // ⌨️
    expect(a.mock.calls.length + b.mock.calls.length).toBe(1) // ✅ no double-open
  })
  it('enabled: false removes the listener; unmount cleans up', () => {
    const add = vi.spyOn(window, 'addEventListener'), remove = vi.spyOn(window, 'removeEventListener') // 👀
    const fn = vi.fn() // 🔔
    const { rerender, unmount } = renderHook(({ on }) => useAbHotkey('mod+k', fn, { platform: 'other', enabled: on }), { initialProps: { on: true } })
    expect(add.mock.calls.filter(([t]) => t === 'keydown')).toHaveLength(1) // 👂 ONE listener
    rerender({ on: false }) // 🔌 off
    press({ key: 'k', ctrlKey: true }) // ⌨️
    expect(fn).not.toHaveBeenCalled() // 🙈
    rerender({ on: true }); unmount() // 🧹
    expect(remove.mock.calls.filter(([t]) => t === 'keydown').length).toBeGreaterThanOrEqual(2) // ✅ both removed
    press({ key: 'k', ctrlKey: true }) // ⌨️ after unmount
    expect(fn).not.toHaveBeenCalled() // 🙈
    add.mockRestore(); remove.mockRestore() // 🧹
  })
  it('always calls the LATEST handler without re-subscribing; supports several combos', () => {
    const add = vi.spyOn(window, 'addEventListener') // 👀
    const first = vi.fn(), second = vi.fn() // 🔔
    const { rerender } = renderHook(({ h }) => useAbHotkey(['mod+k', '/'], h, { platform: 'apple' }), { initialProps: { h: first } })
    rerender({ h: second }) // 🔁 new inline handler
    press({ key: 'k', metaKey: true }) // ⌘K
    press({ key: '/' }) // ⌨️ /
    expect(first).not.toHaveBeenCalled() // 🙅 stale
    expect(second.mock.calls.map((c) => c[1])).toEqual(['mod+k', '/']) // ✅ both combos
    expect(add.mock.calls.filter(([t]) => t === 'keydown')).toHaveLength(1) // 👂 still ONE listener
    add.mockRestore() // 🧹
  })
  it('listens on a custom target; null waits', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 🔕 bare Escape warns in dev (tested below)
    const box = document.createElement('div'); document.body.appendChild(box) // 🎯
    const fn = vi.fn() // 🔔
    const { rerender } = renderHook(({ t }) => useAbHotkey('escape', fn, { target: t }), { initialProps: { t: null as EventTarget | null } })
    press({ key: 'Escape' }, box) // ⏳ not yet
    expect(fn).not.toHaveBeenCalled() // 🙈
    rerender({ t: box }) // ✅ attached
    press({ key: 'Escape' }, box) // ⎋
    expect(fn).toHaveBeenCalledTimes(1) // 🔔
    warn.mockRestore() // 🧹
  })
  it('SSR: rendering on the server never touches window', () => {
    const Probe = () => { useAbHotkey('mod+k', () => {}); return createElement('p', null, 'ok') } // 🧪
    expect(renderToString(createElement(Probe))).toBe('<p>ok</p>') // 🖨️ effects don't run on the server
  })
  it('capture: true hears the event in the capture phase (before stopPropagation in bubble)', () => {
    const fn = vi.fn() // 🔔
    renderHook(() => useAbHotkey('mod+k', fn, { platform: 'other', capture: true })) // 🪟
    const stop = (e: Event) => e.stopPropagation() // 🛑 a bubble listener that would hide a bubble-phase hotkey
    window.addEventListener('keydown', stop) // 🫧
    press({ key: 'k', ctrlKey: true }) // ⌨️
    window.removeEventListener('keydown', stop) // 🧹
    expect(fn).toHaveBeenCalledTimes(1) // ✅ capture ran first
  })
  it('a bare key is ignored in a <select> (same as other typable fields)', () => {
    document.body.innerHTML = '<select id="s"><option>a</option></select>' // 📋
    const fn = vi.fn() // 🔔
    renderHook(() => useAbHotkey('/', fn)) // ⌨️ bare slash
    press({ key: '/' }, document.getElementById('s')!) // ✍️
    expect(fn).not.toHaveBeenCalled() // 🙈
    press({ key: '/' }) // 🪟 outside
    expect(fn).toHaveBeenCalledTimes(1) // ✅
  })
  it('warns in dev on a bare Tab, Escape, Enter or Space; modifiers (and other keys) stay quiet', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) // 👀
    for (const combo of ['tab', 'escape', 'enter', 'space']) {
      warn.mockClear() // 🧹
      renderHook(() => useAbHotkey(combo, () => {})) // ⌨️
      expect(warn, combo).toHaveBeenCalledTimes(1) // ⚠️
      expect(String(warn.mock.calls[0][0]), combo).toMatch(new RegExp(`bare "${combo}"`)) // 📝
    }
    warn.mockClear() // 🧹
    renderHook(() => useAbHotkey('mod+enter', () => {})) // ✅ a modifier is fine
    renderHook(() => useAbHotkey('shift+tab', () => {})) // ✅ Shift+Tab is not bare
    renderHook(() => useAbHotkey('/', () => {})) // ✅ a bare slash is not reserved
    expect(warn).not.toHaveBeenCalled() // 🔕
    warn.mockRestore() // 🧹
  })
})
