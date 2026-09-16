// ===== ab-nextjs-hooks - TYPES =====
//
// Type mirror of the package barrel (`index.ts`). Consumers resolve the
// package's types through this file, so keep it pointing at the live source.
// The package ships raw TypeScript (`main: "index.ts"`), so the single source
// of truth is `index.ts` itself.

export type HookStatus = "Pending" | "InProgress" | "Done";

export type HookCatalogEntry = {
  name: string;
  file: string;
  kind: "client" | "server";
  status: HookStatus;
};

// re-export the whole barrel, so every named export/types stay in sync
export * from "../index";

// also re-export the default `abHooks` catalog object
export { default } from "../index";