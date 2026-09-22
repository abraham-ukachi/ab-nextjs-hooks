# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
