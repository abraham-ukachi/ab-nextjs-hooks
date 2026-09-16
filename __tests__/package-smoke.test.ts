/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-hooks
* ~~~~~~~~~~~~ 
* Copyright (c) 2024 Abraham Ukachi. The abElements Project.
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
* @name: Package Smoke Test
* @file: __tests__/package-smoke.test.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // run the package smoke tests
*    -|> pnpm vitest run
*
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// REACT types
// REACT hooks
// REACT components


// NEXT.JS types
// NEXT.JS hooks
// NEXT.JS components


// AB types
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'




// ===== PACKAGE SMOKE TEST ===== //


// create the package root as `root`
const root = join(dirname(fileURLToPath(import.meta.url)), '..')


/**
 * @name package smoke
 * @description Various smoke tests for the ab-nextjs-hooks package
 */
describe('ab-nextjs-hooks package smoke', () => {

  // test the package metadata & peer dependencies
  it('targets Next 16.3.4 peers and package metadata', () => {
    // read the `package.json` as `pkg`
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

    // assert the package name & version
    expect(pkg.name).toBe('ab-nextjs-hooks')
    expect(pkg.version).toBe('0.1.1')

    // assert the Next.js peer dependency
    expect(pkg.peerDependencies.next).toBe('16.3.4')
  })

  // test the `supportedHooks` catalog
  it('exports supportedHooks catalog (40 done)', async () => {
    // import the package as `mod`
    const mod = await import('../index')

    // assert `mod.supportedHooks` exists
    expect(Array.isArray(mod.supportedHooks)).toBe(true)

    // assert there are exactly 40 hooks, all done
    expect(mod.supportedHooks).toHaveLength(40)
    expect(mod.supportedHooks.every((h) => h.status === 'Done')).toBe(true)

    // assert the default export exposes the same catalog
    expect(mod.default.supportedHooks).toHaveLength(40)
  })

  // test that every catalogued hook file exists
  it('every catalogued hook file exists', async () => {
    // import the package as `mod`
    const mod = await import('../index')

    // for every catalogued hook, assert its file exists
    for (const h of mod.supportedHooks) {
      expect(() => readFileSync(join(root, h.file), 'utf8'), h.file).not.toThrow()
    }
  })
})