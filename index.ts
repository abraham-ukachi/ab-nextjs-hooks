import type { HookCatalogEntry } from "./types";

/**
 * Catalog of planned ab-nextjs-hooks (all Pending until implemented).
 * Tooling targets Next.js 16.3.4 / React 19.
 */
export const supportedHooks: HookCatalogEntry[] = [
  { name: "useAbTheme", file: "useAbTheme.ts", kind: "client", status: "Pending" },
  { name: "useAbMenu", file: "useAbMenu.ts", kind: "client", status: "Pending" },
  { name: "useAbDialog", file: "useAbDialog.ts", kind: "client", status: "Pending" },
  { name: "useAbToast", file: "useAbToast.ts", kind: "client", status: "Pending" },
  { name: "useAbConfetti", file: "useAbConfetti.ts", kind: "client", status: "Pending" },
  { name: "useAbApp", file: "server/useAbApp.ts", kind: "server", status: "Pending" },
  { name: "useAbAuth", file: "server/useAbAuth.ts", kind: "server", status: "Pending" },
  { name: "useAbNavLinks", file: "server/useAbNavLinks.ts", kind: "server", status: "Pending" },
];

const abHooks = { supportedHooks };

export default abHooks;
