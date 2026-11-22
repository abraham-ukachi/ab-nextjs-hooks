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
* @name: useAbHotkey (G10)
* @file: useAbHotkey.ts
* @type: Client hook
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*
* Example usage:
*   1+|> useAbHotkey('mod+k', () => setOpen('search')) // ⌘K on Apple, Ctrl+K elsewhere (fires in inputs by default)
*    -|> useAbHotkey(['mod+k', '/'], openSearch) // 🔁 several combos, still ONE listener; '/' stays silent in inputs
*    -|> const { label, ariaKeyShortcuts } = useAbHotkeyLabel('mod+k') // "⌘K" / "Ctrl+K" + "Meta+K" / "Control+K"
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

'use client'

// ⚛️ React hooks (refs keep the latest handler without re-subscribing; useSyncExternalStore = SSR-safe platform read)
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'


// ===== TYPES ===== //

/** 🧩 a parsed combo, e.g. `mod+shift+k` → `{ key: 'k', mod: true, shift: true, … }` */
export interface AbHotkey {
  key: string // 🔑 the main key, lower-cased `KeyboardEvent.key` (e.g. 'k', 'escape', '/', ' ')
  mod: boolean // 🍎 "the platform modifier": Meta (⌘) on Apple, Control everywhere else
  ctrl: boolean // ⌃ Control, on every platform
  meta: boolean // ⌘ Meta (Cmd on Apple, the Windows key elsewhere)
  alt: boolean // ⌥ Alt / Option
  shift: boolean // ⇧ Shift
}

/** 🖥️ which modifier `mod` means: 'apple' (⌘ Meta) or 'other' (Ctrl) */
export type AbHotkeyPlatform = 'apple' | 'other'

/** 🔔 the callback: the native event + the combo string (as written) that matched */
export type AbHotkeyHandler = (event: KeyboardEvent, combo: string) => void

/** ⚙️ options for useAbHotkey */
export interface UseAbHotkeyOptions {
  enabled?: boolean // 🔌 listen at all (default true); false removes the listener
  preventDefault?: boolean // 🚫 stop the browser's own action on a match (default true: Ctrl+K = the browser search bar)
  allowInInputs?: boolean // ✍️ fire while typing in an input / textarea / select / contenteditable (default: true when the matched combo has mod/ctrl/meta/alt, else false; an explicit value always wins)
  allowRepeat?: boolean // 🔁 fire again while the key is held down (default false)
  ignoreHandled?: boolean // 🤝 skip events another listener already `preventDefault()`-ed (default true: no double-open)
  eventType?: 'keydown' | 'keyup' // ⌨️ which key event (default 'keydown')
  capture?: boolean // 🪤 listen in the capture phase (default false)
  target?: EventTarget | null // 🎯 where to listen (default `window`; null = wait, e.g. a ref not attached yet)
  platform?: AbHotkeyPlatform // 🍎 force the `mod` meaning (default: detected from the browser; mostly for tests)
}

/** 🏷️ what useAbHotkeyLabel returns */
export interface AbHotkeyLabel {
  label: string // 👀 the visible key cap, "⌘K" on Apple / "Ctrl+K" elsewhere
  ariaKeyShortcuts: string // ♿ the `aria-keyshortcuts` value, "Meta+K" / "Control+K"
  apple: boolean // 🍎 the platform the label was made for
}

/** 🧭 the minimal `navigator` shape we read (works with a fake in tests) */
export interface AbHotkeyNavigator {
  platform?: string // 🖥️ legacy `navigator.platform` ("MacIntel", "Win32", …)
  userAgent?: string // 🕵️ last resort
  userAgentData?: { platform?: string } // 🆕 UA Client Hints ("macOS", "Windows", …)
}


// ===== CONSTANTS ===== //

/** 🔎 the docs search combo (D49): ⌘K on Apple, Ctrl+K elsewhere */
export const AB_HOTKEY_SEARCH = 'mod+k'

// 🔤 friendly names → the `KeyboardEvent.key` value (lower-cased)
const KEY_ALIASES: Record<string, string> = {
  esc: 'escape', // ⎋
  return: 'enter', // ↵
  space: ' ', // ␣ (KeyboardEvent.key is a real space)
  spacebar: ' ', // ␣ old IE / Edge name
  plus: '+', // ➕ so `mod+plus` can be written (a bare `+` is the separator)
  up: 'arrowup', // ⬆️
  down: 'arrowdown', // ⬇️
  left: 'arrowleft', // ⬅️
  right: 'arrowright', // ➡️
  del: 'delete', // ⌦
}

// 🎛️ modifier names → the AbHotkey flag they set
const MODIFIERS: Record<string, keyof Omit<AbHotkey, 'key'>> = {
  mod: 'mod', // 🍎 platform modifier
  cmdorctrl: 'mod', // 🍎 Electron-style spelling
  ctrl: 'ctrl', // ⌃
  control: 'ctrl', // ⌃
  meta: 'meta', // ⌘
  cmd: 'meta', // ⌘
  command: 'meta', // ⌘
  super: 'meta', // ⌘ (Linux name)
  alt: 'alt', // ⌥
  option: 'alt', // ⌥
  opt: 'alt', // ⌥
  shift: 'shift', // ⇧
}

// ✍️ input types that do NOT take text (typing there is not "typing"): a hotkey may fire
const NON_TEXT_INPUTS = new Set(['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color', 'file', 'image'])

// 🔕 the platform never changes during a visit → nothing to subscribe to
const noopSubscribe = () => () => {}

/** ⚠️ development / test only: silent in production builds */
function warnAbHotkey(message: string): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return // 🏭
  console.warn(message) // ⚠️
}


// ===== PURE HELPERS (usable outside React) ===== //

/**
 * 🍎 isAbApplePlatform — true on macOS / iOS / iPadOS (⌘), false elsewhere (Ctrl).
 * Reads `userAgentData.platform`, then `platform`, then `userAgent`. With no argument it reads the
 * global `navigator`; on the server (no navigator) it is false, so SSR renders the "Ctrl" label.
 */
export function isAbApplePlatform(nav?: AbHotkeyNavigator | null): boolean {
  // 🧭 the given navigator, else the global one (undefined on the server)
  const n: AbHotkeyNavigator | undefined = nav ?? (typeof navigator === 'undefined' ? undefined : navigator as Navigator & AbHotkeyNavigator)
  // 🔍 the best platform hint we have
  const p = n?.userAgentData?.platform || n?.platform || n?.userAgent || ''
  // 🍎 Mac, iPhone, iPad, iPod
  return /mac|iphone|ipad|ipod/i.test(p)
}

/** 🖥️ resolveAbHotkeyPlatform — the explicit platform, else the detected one */
export function resolveAbHotkeyPlatform(platform?: AbHotkeyPlatform): AbHotkeyPlatform {
  // 🎯 forced (tests / previews), else detected
  return platform ?? (isAbApplePlatform() ? 'apple' : 'other')
}

/**
 * 🧩 parseAbHotkey — turn `'mod+shift+k'` into an AbHotkey. Case-insensitive, spaces ignored,
 * `+` separates parts (write `plus` for the + key, or end with `++`). Throws on an empty or modifier-only combo.
 * If more than one non-modifier key is listed (`mod+k+p`), the last one wins and a dev-only warning is issued.
 */
export function parseAbHotkey(combo: string): AbHotkey {
  // 🧱 start with no modifiers
  const out: AbHotkey = { key: '', mod: false, ctrl: false, meta: false, alt: false, shift: false }
  // ✂️ lower-case, drop spaces (except a lone ' ' key), split on '+' — and `mod++` means "mod + the + key"
  const raw = combo.trim().toLowerCase()
  const parts = raw.endsWith('++') ? [...raw.slice(0, -2).split('+'), '+'] : raw.split('+')
  // 🔑 set when we already saw a main key (a second one is a typo: we keep the last and warn)
  let extraKey = false
  // 🔁 each part is a modifier or the (single) main key
  for (const part of parts.map((x) => (x === '+' ? x : x.trim()))) {
    // 🙈 skip empty bits (e.g. a trailing '+')
    if (!part) continue
    // 🎛️ a modifier → set its flag
    const flag = MODIFIERS[part]
    if (flag) { out[flag] = true; continue }
    // 🔑 a second non-modifier key → remember, then keep this (last) one
    if (out.key) extraKey = true
    out.key = KEY_ALIASES[part] ?? part
  }
  // 🧯 a combo needs a real key
  if (!out.key) throw new Error(`useAbHotkey: "${combo}" has no key (e.g. "mod+k")`)
  // ⚠️ typo guard: "mod+k+p" is almost certainly a mistake; last key wins (non-breaking)
  if (extraKey) warnAbHotkey(`useAbHotkey: "${combo}" has more than one key; using the last one ("${out.key}")`)
  // ✅ parsed
  return out
}

/** 🔤 the physical-key fallback (`KeyboardEvent.code`) for a letter or digit, so ⌘K still works on a Cyrillic layout */
function codeFor(key: string): string | null {
  // 🔡 a–z → "KeyA" … "KeyZ"
  if (/^[a-z]$/.test(key)) return `Key${key.toUpperCase()}`
  // 🔢 0–9 → "Digit0" … "Digit9"
  if (/^[0-9]$/.test(key)) return `Digit${key}`
  // 🙅 anything else has no stable code mapping
  return null
}

/**
 * 🎯 matchAbHotkey — does this keyboard event match the combo?
 *
 * - 🍎 `mod` = Meta on Apple, Control elsewhere (strict: Ctrl+K on a Mac is NOT `mod+k`)
 * - 🔒 modifiers must match exactly (`mod+k` does not fire on `mod+shift+k`), except that Shift is
 *   ignored for symbol keys written without it (`?` is Shift+/ on most layouts)
 * - 🌍 letters / digits also match on `event.code` (KeyK), so ⌘K works on ru / Option-modified layouts
 */
export function matchAbHotkey(event: Pick<KeyboardEvent, 'key' | 'code' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>, combo: string | AbHotkey, platform?: AbHotkeyPlatform): boolean {
  // 🧩 parse once if needed
  const hk = typeof combo === 'string' ? parseAbHotkey(combo) : combo
  // 🍎 what `mod` means here
  const apple = resolveAbHotkeyPlatform(platform) === 'apple'
  // 🎛️ the modifiers this combo requires
  const wantCtrl = hk.ctrl || (hk.mod && !apple) // ⌃
  const wantMeta = hk.meta || (hk.mod && apple) // ⌘
  // 🔒 exact match on Ctrl / Meta / Alt
  if (!!event.ctrlKey !== wantCtrl || !!event.metaKey !== wantMeta || !!event.altKey !== hk.alt) return false
  // ⇧ Shift: exact for letters / named keys; ignored for symbols written without it ("?" = Shift+/)
  const symbol = hk.key.length === 1 && !/[a-z0-9]/.test(hk.key)
  if (!(symbol && !hk.shift) && !!event.shiftKey !== hk.shift) return false
  // 🔑 the key itself (KeyboardEvent.key, case-insensitive)
  const key = (event.key ?? '').toLowerCase()
  if (key === hk.key) return true
  // 🌍 physical-key fallback for letters / digits
  const code = codeFor(hk.key)
  return code !== null && event.code === code
}

/**
 * ✍️ isAbEditableTarget — is this element somewhere the user types text?
 * Text inputs (not checkboxes / buttons / ranges …), textarea, select, `contenteditable`, or `role="textbox"`.
 */
export function isAbEditableTarget(target: EventTarget | null | undefined): boolean {
  // 🚫 nothing / not an element (window, document)
  if (!target || typeof (target as Element).closest !== 'function') return false
  // 🧱 the element
  const el = target as HTMLElement
  // 🏷️ its tag
  const tag = el.tagName
  // 🔤 text-like inputs only
  if (tag === 'INPUT') return !NON_TEXT_INPUTS.has(((el as HTMLInputElement).type || 'text').toLowerCase())
  // 📝 textarea + select (typing jumps to options)
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  // ✏️ rich text editors: the element or an ancestor is contenteditable (but not "false")
  if (el.isContentEditable || el.closest('[contenteditable]:not([contenteditable="false"])')) return true
  // ♿ custom text boxes
  return el.closest('[role="textbox"]') !== null
}

/**
 * ✍️ allowsAbHotkeyInInputs — should this combo fire while the user is typing?
 * An explicit `allowInInputs` always wins. Otherwise a combo with `mod` / Ctrl / Meta / Alt
 * fires in inputs (so ⌘K still works from a search field) and a bare — or Shift-only — key
 * does not (a lone `/` would otherwise steal every slash you type). Decide per combo when
 * several are passed.
 */
export function allowsAbHotkeyInInputs(combo: string | AbHotkey, allowInInputs?: boolean): boolean {
  if (allowInInputs !== undefined) return allowInInputs // 🎯 explicit always wins
  const hk = typeof combo === 'string' ? parseAbHotkey(combo) : combo // 🧩
  return hk.mod || hk.ctrl || hk.meta || hk.alt // 🎛️ a real modifier (Shift alone does not count)
}

// 🗺️ visible names for the main key (everything else: upper-cased)
const KEY_LABELS: Record<string, string> = { escape: 'Esc', enter: 'Enter', ' ': 'Space', arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→', backspace: 'Backspace', delete: 'Delete', tab: 'Tab' }
// ♿ aria-keyshortcuts names for the main key (the spec uses KeyboardEvent.key values)
const ARIA_KEYS: Record<string, string> = { escape: 'Escape', enter: 'Enter', ' ': 'Space', arrowup: 'ArrowUp', arrowdown: 'ArrowDown', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight', backspace: 'Backspace', delete: 'Delete', tab: 'Tab', '+': 'Plus' }

/**
 * 🏷️ formatAbHotkey — the visible key cap: `'mod+k'` → "⌘K" on Apple, "Ctrl+K" elsewhere.
 * Apple uses the symbol order ⌃⌥⇧⌘ with no separator; others "Ctrl+Alt+Shift+Meta+K".
 */
export function formatAbHotkey(combo: string | AbHotkey, platform?: AbHotkeyPlatform): string {
  // 🧩 parse + platform
  const hk = typeof combo === 'string' ? parseAbHotkey(combo) : combo
  const apple = resolveAbHotkeyPlatform(platform) === 'apple'
  // 🔑 the key's display name
  const key = KEY_LABELS[hk.key] ?? hk.key.toUpperCase()
  // 🎛️ resolved modifiers
  const ctrl = hk.ctrl || (hk.mod && !apple), meta = hk.meta || (hk.mod && apple)
  // 🍎 ⌃⌥⇧⌘K
  if (apple) return `${ctrl ? '⌃' : ''}${hk.alt ? '⌥' : ''}${hk.shift ? '⇧' : ''}${meta ? '⌘' : ''}${key}`
  // 🪟 Ctrl+Alt+Shift+Meta+K
  return [ctrl && 'Ctrl', hk.alt && 'Alt', hk.shift && 'Shift', meta && 'Meta', key].filter(Boolean).join('+')
}

/** ♿ getAbHotkeyAriaKeyshortcuts — the `aria-keyshortcuts` value: `'mod+k'` → "Meta+K" (Apple) / "Control+K" */
export function getAbHotkeyAriaKeyshortcuts(combo: string | AbHotkey, platform?: AbHotkeyPlatform): string {
  // 🧩 parse + platform
  const hk = typeof combo === 'string' ? parseAbHotkey(combo) : combo
  const apple = resolveAbHotkeyPlatform(platform) === 'apple'
  // 🎛️ resolved modifiers
  const ctrl = hk.ctrl || (hk.mod && !apple), meta = hk.meta || (hk.mod && apple)
  // 🔑 the key name the spec expects
  const key = ARIA_KEYS[hk.key] ?? (hk.key.length === 1 ? hk.key.toUpperCase() : hk.key[0].toUpperCase() + hk.key.slice(1))
  // ♿ Control+Alt+Shift+Meta+K (the spec's modifier names)
  return [ctrl && 'Control', hk.alt && 'Alt', hk.shift && 'Shift', meta && 'Meta', key].filter(Boolean).join('+')
}


// ===== HOOKS ===== //

/**
 * 🍎 useAbApplePlatform — true on Apple devices. SSR + hydration return false (the "Ctrl" label),
 * then the real platform is read right after hydration (useSyncExternalStore: no mismatch warning).
 */
export function useAbApplePlatform(): boolean {
  return useSyncExternalStore(
    noopSubscribe, // 🔕 never changes
    () => isAbApplePlatform(), // 🖥️ client: the real platform
    () => false, // 🖨️ server: "Ctrl"
  )
}

/**
 * 🏷️ useAbHotkeyLabel — the key cap + `aria-keyshortcuts` for a combo, SSR-safe
 * (server: "Ctrl+K" / "Control+K"; Apple clients switch to "⌘K" / "Meta+K" after hydration).
 * It only formats: it does NOT listen (pair it with ONE useAbHotkey somewhere, e.g. the app shell).
 */
export function useAbHotkeyLabel(combo: string = AB_HOTKEY_SEARCH, platform?: AbHotkeyPlatform): AbHotkeyLabel {
  // 🍎 detected platform (false on the server)
  const detected = useAbApplePlatform()
  // 🎯 a forced platform wins
  const apple = platform ? platform === 'apple' : detected
  // 🧮 memoised strings
  return useMemo(() => {
    const p: AbHotkeyPlatform = apple ? 'apple' : 'other' // 🖥️
    return { label: formatAbHotkey(combo, p), ariaKeyShortcuts: getAbHotkeyAriaKeyshortcuts(combo, p), apple } // 🏷️ ♿
  }, [combo, apple])
}

/**
 * ⌨️ useAbHotkey — call `handler` when a key combo is pressed (G10, D49: `mod+k` opens the search drawer).
 *
 * - 🍎 `mod` = ⌘ Meta on Apple, Ctrl elsewhere; pass an array for several combos (still ONE listener)
 * - 🖥️ SSR-safe: nothing runs on the server; the listener is added after mount and removed on unmount
 * - ✍️ fires in inputs by default when the matched combo has `mod` / Ctrl / Meta / Alt (e.g. `mod+k`);
 *   a bare (or Shift-only) key stays silent in inputs. An explicit `allowInInputs` always wins, and
 *   with several combos the default is decided per combo
 * - 🈳 ignores IME composition (`isComposing` / keyCode 229) and, by default, held-down repeats
 * - 🤝 skips events already `preventDefault()`-ed by another listener (`ignoreHandled`), so two
 *   bindings of the same combo never double-fire
 * - 🚫 `preventDefault` on a match (default true), 🔌 `enabled` toggles the listener
 * - 🔁 the latest `handler` is always called (no re-subscribe on every render)
 */
export function useAbHotkey(combo: string | readonly string[], handler: AbHotkeyHandler, options: UseAbHotkeyOptions = {}): void {
  // ⚙️ options with their defaults
  const { enabled = true, eventType = 'keydown', capture = false, platform } = options
  // 🎯 `undefined` = window; `null` = "not ready yet" (no listener)
  const target = options.target

  // 📋 the combos as a stable string key (an inline array literal would change identity every render)
  const list = typeof combo === 'string' ? [combo] : combo
  const key = list.join('\u0000')
  // 🧩 parsed once per combo change (throws early on a bad combo, during render, where the stack is useful)
  const parsed = useMemo(() => key.split('\u0000').map((c) => ({ combo: c, hk: parseAbHotkey(c) })), [key])

  // 🔁 the latest handler + flag options, read inside the listener (no re-subscribe on every render)
  const latest = useRef({ handler, options })
  useEffect(() => { latest.current = { handler, options } }) // 🔄 after every render, never during

  // 👂 ONE listener per hook call
  useEffect(() => {
    // 🔌 disabled → nothing
    if (!enabled) return
    // 🖥️ the listen target: the given one, else window (never on the server: effects don't run there)
    const where: EventTarget | null = target === undefined ? (typeof window === 'undefined' ? null : window) : target
    // ⏳ a null target (e.g. a ref not attached yet) → wait
    if (!where) return
    // 🍎 resolve the platform once per subscription (it never changes in a visit)
    const p = resolveAbHotkeyPlatform(platform)

    // ⌨️ the listener
    const onKey = (event: Event) => {
      // 🧱 only keyboard events (a custom target could dispatch anything)
      const e = event as KeyboardEvent
      if (typeof e.key !== 'string') return
      // 📖 the latest flag options
      const o = latest.current.options
      // 🈳 IME composition (Japanese, Chinese, Korean…): the keys belong to the composer
      if (e.isComposing || e.keyCode === 229) return
      // 🔁 held-down repeats, unless asked for
      if (e.repeat && !o.allowRepeat) return
      // 🤝 someone already handled it (e.g. a second binding of the same combo)
      if (e.defaultPrevented && (o.ignoreHandled ?? true)) return
      // 🎯 the first combo that matches wins (needed before the input check: the default is per combo)
      const hit = parsed.find(({ hk }) => matchAbHotkey(e, hk, p))
      if (!hit) return
      // ✍️ typing in a text field: skip unless this combo is allowed there (composedPath: the real target inside a shadow root)
      const origin = typeof e.composedPath === 'function' ? (e.composedPath()[0] ?? e.target) : e.target
      if (isAbEditableTarget(origin) && !allowsAbHotkeyInInputs(hit.hk, o.allowInInputs)) return
      // 🚫 stop the browser's own shortcut (Ctrl+K = the address/search bar)
      if (o.preventDefault ?? true) e.preventDefault()
      // 🔔 call the latest handler
      latest.current.handler(e, hit.combo)
    }

    // 👂 subscribe
    where.addEventListener(eventType, onKey, capture)
    // 🧹 unsubscribe on unmount / when anything above changes
    return () => where.removeEventListener(eventType, onKey, capture)
  }, [enabled, target, eventType, capture, platform, parsed])
}

// 📦 default export
export default useAbHotkey
