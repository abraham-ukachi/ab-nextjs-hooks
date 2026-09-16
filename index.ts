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
* @name: Hooks - Package Catalog
* @file: index.ts
* @type: TypeScript
* @authors: Abraham Ukachi <abraham.ukachi@laplateforme.io>
*
* Example usage:
*   1+|> // import the whole hook catalog
*    -|> import abHooks from './index'
*    -|>
*    -|> // console.log(abHooks.supportedHooks) // ==> [ { name: 'useAbTheme', ... }, ... ]
*    -|>
*
*   2+|> // grab the hooks as a named import & filter them
*    -|> import { supportedHooks } from './index'
*    -|>
*    -|> // console.log(supportedHooks.filter((hook) => hook.kind === 'server'))
*    -|>
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
import type { HookCatalogEntry } from './types'
// AB hooks
// AB components


// OTHER types
// OTHER hooks
// OTHER components




// ===== SUPPORTED HOOKS - PACKAGE CATALOG ===== //


// every AB hook this package ships, as a catalog entry
// (each one has a `name`, `file`, `kind` & `status`)
const supportedHooks: Array<HookCatalogEntry> = [
  // ------ CLIENT hooks (run in the browser) ------
  { name: 'useAbTheme', file: 'useAbTheme.ts', kind: 'client', status: 'Done' },
  { name: 'useAbMenu', file: 'useAbMenu.ts', kind: 'client', status: 'Done' },
  { name: 'useAbDialog', file: 'useAbDialog.ts', kind: 'client', status: 'Done' },
  { name: 'useAbToast', file: 'useAbToast.ts', kind: 'client', status: 'Done' },
  { name: 'useAbConfetti', file: 'useAbConfetti.ts', kind: 'client', status: 'Done' },

  // --- data & storage hooks ---
  { name: 'useAbDataIndexer', file: 'useAbDataIndexer.ts', kind: 'client', status: 'Done' },
  { name: 'useAbDataMapper', file: 'useAbDataMapper.ts', kind: 'client', status: 'Done' },

  { name: 'useAbBrand', file: 'useAbBrand.ts', kind: 'client', status: 'Done' },
  { name: 'useAbBrandRequest', file: 'useAbBrandRequest.ts', kind: 'client', status: 'Done' },
  { name: 'useAbBrandLabels', file: 'useAbBrandLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbBrandColors', file: 'useAbBrandColors.ts', kind: 'client', status: 'Done' },
  { name: 'useAbCollection', file: 'useAbCollection.ts', kind: 'client', status: 'Done' },
  { name: 'useAbCollectionRequest', file: 'useAbCollectionRequest.ts', kind: 'client', status: 'Done' },
  { name: 'useAbCollectionLabels', file: 'useAbCollectionLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbColorHexes', file: 'useAbColorHexes.ts', kind: 'client', status: 'Done' },
  { name: 'useAbColorLabels', file: 'useAbColorLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbCountryLabels', file: 'useAbCountryLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbFAQ', file: 'useAbFAQ.ts', kind: 'client', status: 'Done' },
  { name: 'useAbFaqRequest', file: 'useAbFaqRequest.ts', kind: 'client', status: 'Done' },
  { name: 'useAbFilter', file: 'useAbFilter.ts', kind: 'client', status: 'Done' },
  { name: 'useAbFilterRequest', file: 'useAbFilterRequest.ts', kind: 'client', status: 'Done' },
  { name: 'useAbFilterLabels', file: 'useAbFilterLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbGenderLabels', file: 'useAbGenderLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbLensLabels', file: 'useAbLensLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbMaterialLabels', file: 'useAbMaterialLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbPriceLabels', file: 'useAbPriceLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProduct', file: 'useAbProduct.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProductRequest', file: 'useAbProductRequest.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProductLabels', file: 'useAbProductLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProductCart', file: 'useAbProductCart.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProductLikes', file: 'useAbProductLikes.ts', kind: 'client', status: 'Done' },
  { name: 'useAbProductDefaultQuantities', file: 'useAbProductDefaultQuantities.ts', kind: 'client', status: 'Done' },
  { name: 'useAbShapeLabels', file: 'useAbShapeLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbBranchLabels', file: 'useAbBranchLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbBridgeLabels', file: 'useAbBridgeLabels.ts', kind: 'client', status: 'Done' },
  { name: 'useAbUser', file: 'useAbUser.ts', kind: 'client', status: 'Done' },
  { name: 'useAbAuthRequest', file: 'useAbAuthRequest.ts', kind: 'client', status: 'Done' },

  // ------ SERVER hooks (run on the server only) ------
  { name: 'useAbApp', file: 'server/useAbApp.ts', kind: 'server', status: 'Done' },
  { name: 'useAbAuth', file: 'server/useAbAuth.ts', kind: 'server', status: 'Done' },
  { name: 'useAbNavLinks', file: 'server/useAbNavLinks.ts', kind: 'server', status: 'Done' }
]


// bundle the catalog into a package object as `abHooks`
const abHooks = { supportedHooks }


// ===== HOOK RE-EXPORTS ===== //

// ---- core / ui hooks ----
export { useAbTheme, DEFAULT_AB_THEME, type AbThemeResult } from './useAbTheme'
export { useAbMenu } from './useAbMenu'
export { useAbDialog } from './useAbDialog'
export { useAbToast } from './useAbToast'
export { useAbConfetti } from './useAbConfetti'

// ---- data & storage hooks ----
export { useAbDataIndexer } from './useAbDataIndexer'
export { useAbDataMapper } from './useAbDataMapper'

// ---- request hooks ----
export { useBrandRequest } from './useAbBrandRequest'
export { useCollectionRequest } from './useAbCollectionRequest'
export { useFaqRequest } from './useAbFaqRequest'
export { useFilterRequest } from './useAbFilterRequest'
export { useProductRequest } from './useAbProductRequest'
export { useAuthRequest } from './useAbAuthRequest'

// ---- labels hooks ----
export { useBrandLabels } from './useAbBrandLabels'
export { useCollectionLabels } from './useAbCollectionLabels'
export { useColorLabels } from './useAbColorLabels'
export { useAbColorHexes } from './useAbColorHexes'
export { useCountryLabels } from './useAbCountryLabels'
export { useFilterLabels } from './useAbFilterLabels'
export { useGenderLabels } from './useAbGenderLabels'
export { useLensLabels } from './useAbLensLabels'
export { useMaterialLabels } from './useAbMaterialLabels'
export { usePriceLabels } from './useAbPriceLabels'
export { useShapeLabels } from './useAbShapeLabels'
export { useBranchLabels } from './useAbBranchLabels'
export { useBridgeLabels } from './useAbBridgeLabels'
export { useProductLabels } from './useAbProductLabels'

// ---- brand / product extras ----
export { useBrand } from './useAbBrand'
export { useCollection } from './useAbCollection'
export { useFilter } from './useAbFilter'
export { useProduct } from './useAbProduct'
export { useFaq } from './useAbFAQ'
export { useBrandColors } from './useAbBrandColors'
export { useAbProductCart } from './useAbProductCart'
export { useAbProductLikes } from './useAbProductLikes'
export { useAbProductDefaultQuantities } from './useAbProductDefaultQuantities'
export { useAbUser } from './useAbUser'

// ---- type exports (used across the demo playground) ----
// note: `AbUser` is a type re-export from the server auth module; using
// `export type` keeps it erased at build time (no server runtime import leaks
// into client bundles)
export type { AbUser } from './server/useAbAuth'
export type { AbCart, AbCartItem, AbProductCartParams } from './useAbProductCart'
export type { AbLikes, AbLikesItem, AbProductLikesParams } from './useAbProductLikes'
export type { AbDataIndexerParams, AbObjectStoreConfig, AbObjectStoreIndexConfig } from './useAbDataIndexer'
export type { AbDataMapperParams, AbDataMapperResult, AbMeta, AbMetaPagination, AbMapper } from './useAbDataMapper'
export type { AbRequestError, AbRequestResponse, AbRequestParams, AbRequestEndpoints } from './helpers/useAbRequest'


// export `supportedHooks` catalog as a named export
export { supportedHooks }


// export `abHooks` package object as default
export default abHooks