# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.1.7 (2026-10-16)

* 🔭 **`useAbScrollSpy(ids, { rootMargin, threshold, root, enabled, initialId })`** (G46): the active section for an "On this page" TOC. One IntersectionObserver; the first visible id in order wins and the last one sticks between sections; SSR / no-IO safe. Also **`scrollToAbSection(id, { offset, updateHash })`**: smooth, or instant under reduced motion. `AB_SCROLL_SPY_ROOT_MARGIN` = `'-64px 0px -60% 0px'`
* 🌗 **`abThemeScript` / `getAbThemeScript({ defaultTheme, storageKey, legacyStorageKey })`**: the inline no-flash script, server-safe at `ab-nextjs-hooks/abThemeScript`. Paints `<html>` exactly like `applyAbThemeToDocument` (tested), migrates `abTheme`, falls back to the OS scheme when storage is blocked, and JSON-encodes its options
* 📦 New entry points `./useAbScrollSpy` and `./abThemeScript`; catalog 46 hooks
* ⏭️ `useAbHotkey` (G48) is deferred to P5 (D24 a)

### 0.1.6 (2026-10-14)

* **useAbMedia (G10):** live `matchMedia` boolean via `useSyncExternalStore`; SSR/hydration value = `defaultValue` (false); never throws (missing `matchMedia`, invalid query); legacy `addListener` fallback. Helpers: `matchAbMedia`, `getAbMediaQueryList`
* **useAbClipboard (G10):** `{ copy, copied, error, reset }`; async Clipboard API with `execCommand('copy')` fallback; `copied` auto-resets after `resetAfter` ms (default 2000, `AB_CLIPBOARD_RESET_MS`); timer cleared on unmount. Helper: `copyAbText`
* **useAbReducedMotion (G32):** live `prefers-reduced-motion: reduce` boolean (`AB_REDUCED_MOTION_QUERY`, same string as animations); `prefersAbReducedMotionNow()`
* **useAbSwipe (G32):** Pointer Events swipe with 48px threshold or flick velocity, axis lock (vertical drags left to scrolling), `onNext` / `onPrev` flipped in RTL, `[data-ab-swipe-ignore]` zones, touch + pen by default. Pure `resolveAbSwipe` / `getAbSwipeLogical`
* **G11 cookie lifetime:** `toggleAppHello(state?, { maxAge })` / `toggleAppReady(state?, { maxAge })` (seconds, validated; default stays 7 days so it is non-breaking). Presets `AB_APP_COOKIE_MAX_AGE.oneWeek` / `.oneYear`, `resolveAbAppCookieMaxAge()`, `AbAppCookieOptions`; `useAbApp().toggleHello/toggleReady` forward the options. Cookies now use `Max-Age` instead of `Expires`. Welcome v6 uses 1 year
* **Theme system mode (G9):** `useAbThemeMode()` → `{ mode, resolvedTheme, setMode }` with `'light' | 'dark' | 'system'`; `'system'` follows `prefers-color-scheme` live. `<html>` keeps the RESOLVED class/`data-theme` (existing `.dark` CSS works) plus new `data-theme-mode`. `useAbTheme` tuple unchanged and accepts `'system'`. New `resolveAbTheme`, `isAbThemeMode`, `AB_THEME_DARK_QUERY`, `AB_THEME_MODES`. App no-flash scripts must resolve `'system'` before paint
* **Docs:** README note: the Welcome passes `{ maxAge: AB_APP_COOKIE_MAX_AGE.oneYear }` (default stays 7 days)

### 0.1.5 (2026-10-14)

* **useAbLocalStorage (G10):** `useState`-like localStorage hook — `[value, set, remove]`; JSON by default (custom `serialize` / `deserialize`); never throws (blocked getter, throwing `getItem` / `setItem`, quota, corrupt JSON → initial value; refused writes kept in memory); SSR-safe via `useSyncExternalStore`; synced across tabs (`storage`) and same-tab instances (`ab-local-storage` event). `typecheck` script. Helpers: `getAbLocalStorage`, `readAbLocalStorage`, `writeAbLocalStorage`

### 0.1.4 (2026-10-05)

* **Dialogs:** target `aside.AbAsideLayout` / `aside[data-ab-part="aside"]` (never the first `<aside>` / a sidebar)
* **Dialogs:** a cancelable backdrop click closes the dialog; `onConfirm` / `onCancel` run **then** close (return `false` to keep it open)
* **Dialogs / toasts:** text is escaped by default; pass `html: true` for trusted markup
* **Exports:** `AbDialogPart`, `DialogParams`, `DialogList`, `AbDialogResult`, `ToastParams`, theme helpers
* **Theme:** `useAbTheme` uses the `theme` key on `<html>` (class + `data-theme` + `color-scheme`), matching ab-elements-app's no-flash script; migrates legacy `abTheme` / `body[data-theme]` once
* **Menus / toasts:** same aside-layout selector as dialogs; toast uses the `.popIn` class from `ab-nextjs-animations`

### 0.1.3 (2026-10-03)

* Publish to npm automatically from GitHub Actions with Trusted Publishing (OIDC + provenance, no NPM_TOKEN)
* Ship only package files via `files`; `next` peer is now `^16.3.4`
* Export `./helpers/*` and `./helpers/useAbToggle` for deep imports (already in the published 0.1.2 tarball)

### 0.1.2 (2026-09-17)

* Next.js **16.3.4** / React 19 peers and eslint-config-next flat config
* Export surface expanded for client hooks + stricter TypeScript types
* Copyright year → 2026

### Unreleased (fix/james-review-0.1.2)

* Smoke test asserts package version **0.1.2**
* Short barrel names are canonical (`useBrand`, `useFaq`, …); `useAb*` aliases retained
* Cookie-mutating server actions live in `server/*.actions.ts` (`'use server'`); sync `useAbApp` / `useAbAuth` stay plain modules (fixes "Server Actions must be async functions")
* `useAbTheme` hydrates from `localStorage` in `useEffect` (no render-time access)
* Auth token + cached user cookies are **httpOnly**; user JSON no longer readable from JS
* `package.json` `exports` + `files`; removed `peerDependenciesMeta` optional flags for next/react/react-dom
* README reflects **0.1.2** / `main` (dropped stale `chore/upgrade-next-16` note)

### 0.1.1 (2026-09-16)

* Initial Next 16 tooling pass and package smoke tests
