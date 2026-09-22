<p align="center">
  <!-- Ab - Logo - Light Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-light-mode-only" target="_blank">
    <img src="./.github/ab-logo-light.svg" alt="Ab Logo on Light" width="64" height="64" />
  </a>

  <!-- Ab - Logo - Dark Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-dark-mode-only" target="_blank">
    <img src="./.github/ab-logo-dark.svg" alt="Ab Logo on Dark" width="64" height="64" />
  </a>

  <!-- Next.js - Logo Name - Light Mode -->
  <a href="https://nextjs.org/#gh-light-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-light.svg" alt="Next.js LogoName on Light" width="192" height="64" />
  </a>

  <!-- Next.js - Logo Name - Dark Mode -->
  <a href="https://nextjs.org/#gh-dark-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-dark.svg" alt="Next.js LogoName on Dark" width="192" height="64" />
  </a>

</p>


<p align="center">
    <a href="https://ab-elements.vercel.app/docs/hooks" target="_blank"><b>Checkout abElements &rarr;</b></a>
</p>


# `ab-nextjs-hooks`

> IMPORTANT: This is a work in progress and subject to major changes until version 1.0.

> Current release: **0.1.2** on `main`. Tooling target: **Next.js 16.3.4** / React 19.

> Canonical client hook names are the **short** barrel exports (`useBrand`, `useFaq`, …).
> `useAb*` aliases are also exported for compatibility.


🪝 This is a lightweight collection of React hooks for abElements created by [Abraham Ukachi](https://github.com/abraham-ukachi), and optimized for [Next.js](https://nextjs.org/docs) applications 😎. 



## Getting Started

### Installation

#### npm

```bash
npm i ab-nextjs-hooks 
```

#### pnpm

```bash
pnpm install ab-nextjs-hooks 
```

---


## Client Hooks

A list of all the supported custom **hooks** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`useAbTheme`* | **useAbTheme.ts** | Done |
| 2 | *`useAbMenu`* | **useAbMenu.ts** | Done |
| 3 | *`useAbDialog`* | **useAbDialog.ts** | Done |
| 4 | *`useAbToast`* | **useAbToast.ts** | Done |
| 5 | *`useAbConfetti`* | **useAbConfetti.ts** | Done |
| 6 | *`useAbDataIndexer`* | **useAbDataIndexer.ts** | Done |
| 7 | *`useAbDataMapper`* | **useAbDataMapper.ts** | Done |
| 8 | *`useBrand`* (`useAbBrand`) | **useAbBrand.ts** | Done |
| 9 | *`useBrandRequest`* (`useAbBrandRequest`) | **useAbBrandRequest.ts** | Done |
| 10 | *`useBrandLabels`* (`useAbBrandLabels`) | **useAbBrandLabels.ts** | Done |
| 11 | *`useBrandColors`* (`useAbBrandColors`) | **useAbBrandColors.ts** | Done |
| 12 | *`useCollection`* (`useAbCollection`) | **useAbCollection.ts** | Done |
| 13 | *`useCollectionRequest`* (`useAbCollectionRequest`) | **useAbCollectionRequest.ts** | Done |
| 14 | *`useCollectionLabels`* (`useAbCollectionLabels`) | **useAbCollectionLabels.ts** | Done |
| 15 | *`useAbColorHexes`* | **useAbColorHexes.ts** | Done |
| 16 | *`useColorLabels`* (`useAbColorLabels`) | **useAbColorLabels.ts** | Done |
| 17 | *`useCountryLabels`* (`useAbCountryLabels`) | **useAbCountryLabels.ts** | Done |
| 18 | *`useFaq`* (`useAbFAQ`) | **useAbFAQ.ts** | Done |
| 19 | *`useFaqRequest`* (`useAbFaqRequest`) | **useAbFaqRequest.ts** | Done |
| 20 | *`useFilter`* (`useAbFilter`) | **useAbFilter.ts** | Done |
| 21 | *`useFilterRequest`* (`useAbFilterRequest`) | **useAbFilterRequest.ts** | Done |
| 22 | *`useFilterLabels`* (`useAbFilterLabels`) | **useAbFilterLabels.ts** | Done |
| 23 | *`useGenderLabels`* (`useAbGenderLabels`) | **useAbGenderLabels.ts** | Done |
| 24 | *`useLensLabels`* (`useAbLensLabels`) | **useAbLensLabels.ts** | Done |
| 25 | *`useMaterialLabels`* (`useAbMaterialLabels`) | **useAbMaterialLabels.ts** | Done |
| 26 | *`usePriceLabels`* (`useAbPriceLabels`) | **useAbPriceLabels.ts** | Done |
| 27 | *`useProduct`* (`useAbProduct`) | **useAbProduct.ts** | Done |
| 28 | *`useProductRequest`* (`useAbProductRequest`) | **useAbProductRequest.ts** | Done |
| 29 | *`useProductLabels`* (`useAbProductLabels`) | **useAbProductLabels.ts** | Done |
| 30 | *`useAbProductCart`* | **useAbProductCart.ts** | Done |
| 31 | *`useAbProductLikes`* | **useAbProductLikes.ts** | Done |
| 32 | *`useAbProductDefaultQuantities`* | **useAbProductDefaultQuantities.ts** | Done |
| 33 | *`useShapeLabels`* (`useAbShapeLabels`) | **useAbShapeLabels.ts** | Done |
| 34 | *`useBranchLabels`* (`useAbBranchLabels`) | **useAbBranchLabels.ts** | Done |
| 35 | *`useBridgeLabels`* (`useAbBridgeLabels`) | **useAbBridgeLabels.ts** | Done |
| 36 | *`useAbUser`* | **useAbUser.ts** | Done |
| 37 | *`useAuthRequest`* (`useAbAuthRequest`) | **useAbAuthRequest.ts** | Done |


> NOTE:



## Server Hooks

A list of all the supported custom **hooks** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`useAbApp`* | **server/useAbApp.ts** | Done |
| 2 | *`useAbAuth`* | **server/useAbAuth.ts** | Done |
| 3 | *`useAbNavLinks`* | **server/useAbNavLinks.ts** | Done |



> NOTE:





## Learn More abElements

To learn more about **`abElements`**, take a look at the following resources:

- [abElements Documentation](https://ab-elements.vercel.app/docs) - learn about `abElements` features and API.
- [abElements Animations](https://ab-elements.vercel.app/docs/animations) - learn about **animations** in `abElements`.
- [abElements Core](https://ab-elements.vercel.app/docs/core) - learn about **core** in `abElements`.
- [abElements Theme](https://ab-elements.vercel.app/docs/theme) - learn about **theme** in `abElements`.
- [abElements Icons](https://ab-elements.vercel.app/docs/icons) - learn about **icons** in `abElements`.
- [abElements Components](https://ab-elements.vercel.app/docs/components) - learn about **components** in `abElements`. 
- [abElements Fonts](https://ab-elements.vercel.app/docs/fonts) - learn about **fonts** in `abElements`. 
- [abElements Hooks](https://ab-elements.vercel.app/docs/hooks) - learn about **hooks** in `abElements`. 

You can check out [the abElements GitHub repository](https://github.com/abraham-ukachi/ab-elements-app) for more details.


## License

This **`ab-nextjs-hooks`** project is [MIT Licensed](./LICENSE) ;)



