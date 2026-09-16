import type { HookCatalogEntry } from './types'

const supportedHooks: Array<HookCatalogEntry> = [
  { name: 'useAbTheme', file: 'useAbTheme.ts', kind: 'client', status: 'Done' },
  { name: 'useAbMenu', file: 'useAbMenu.ts', kind: 'client', status: 'Done' },
  { name: 'useAbDialog', file: 'useAbDialog.ts', kind: 'client', status: 'Done' },
  { name: 'useAbToast', file: 'useAbToast.ts', kind: 'client', status: 'Done' },
  { name: 'useAbConfetti', file: 'useAbConfetti.ts', kind: 'client', status: 'Done' },
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
  { name: 'useAbApp', file: 'server/useAbApp.ts', kind: 'server', status: 'Done' },
  { name: 'useAbAuth', file: 'server/useAbAuth.ts', kind: 'server', status: 'Done' },
  { name: 'useAbNavLinks', file: 'server/useAbNavLinks.ts', kind: 'server', status: 'Done' }
]

const abHooks = { supportedHooks }

export { supportedHooks }

export default abHooks