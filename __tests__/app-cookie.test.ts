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
* @name: App cookie lifetime - Tests (G11)
* @file: __tests__/app-cookie.test.ts
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { beforeEach, describe, expect, it, vi } from 'vitest'

// 🍪 a fake cookie jar standing in for next/headers
const jar = new Map<string, { value: string; options: Record<string, unknown> }>()
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)!.value } : undefined), // 🔍
    set: (name: string, value: string, options: Record<string, unknown>) => void jar.set(name, { value, options }), // ✍️
  }),
}))

// 🎯 code under test (imported after the mock)
import { toggleAppHello, toggleAppReady } from '../server/useAbApp.actions'
import {
  AB_APP_COOKIE_DEFAULT_MAX_AGE,
  AB_APP_COOKIE_MAX_AGE,
  resolveAbAppCookieMaxAge,
} from '../server/useAbApp.cookie'
import { useAbApp } from '../server/useAbApp'

// 🧹 fresh jar per test
beforeEach(() => jar.clear())

describe('G11 cookie maxAge', () => {
  it('resolves and validates maxAge (seconds)', () => {
    expect(AB_APP_COOKIE_MAX_AGE.oneYear).toBe(31_536_000) // 🗓️
    expect(resolveAbAppCookieMaxAge()).toBe(AB_APP_COOKIE_DEFAULT_MAX_AGE) // 🧭 default
    expect(AB_APP_COOKIE_DEFAULT_MAX_AGE).toBe(604_800) // 📅 still 7 days (non-breaking)
    expect(resolveAbAppCookieMaxAge({ maxAge: 90.7 })).toBe(90) // ✂️ integer
    for (const bad of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, '9' as unknown as number]) {
      expect(resolveAbAppCookieMaxAge({ maxAge: bad })).toBe(AB_APP_COOKIE_DEFAULT_MAX_AGE) // 🧯
    }
  })

  it('toggleAppHello(true, { maxAge: 1 year }) writes Max-Age = 1 year', async () => {
    await expect(toggleAppHello(true, { maxAge: AB_APP_COOKIE_MAX_AGE.oneYear })).resolves.toBe(true) // ✅
    const hello = jar.get('AB_APP_HELLO')! // 🍪
    expect(hello.value).toBe('true') // 👋
    expect(hello.options).toMatchObject({ maxAge: 31_536_000, path: '/', sameSite: 'strict', secure: true }) // 🔒
    expect(hello.options).not.toHaveProperty('expires') // 🧹 single source of truth
  })

  it('old callers keep the 7-day default; ready accepts options too', async () => {
    await toggleAppHello(true) // 👴 pre-G11 call
    expect(jar.get('AB_APP_HELLO')!.options.maxAge).toBe(604_800) // 📅
    await toggleAppReady(true, { maxAge: 60 }) // ⏱️
    expect(jar.get('AB_APP_READY')!.options.maxAge).toBe(60) // ✅
  })

  it('useAbApp().toggleHello forwards the options', async () => {
    await useAbApp().toggleHello(true, { maxAge: AB_APP_COOKIE_MAX_AGE.oneYear }) // 🪝
    expect(jar.get('AB_APP_HELLO')!.options.maxAge).toBe(31_536_000) // ✅
  })
})
