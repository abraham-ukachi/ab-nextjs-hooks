export type HookStatus = "Pending" | "InProgress" | "Done";

export type HookCatalogEntry = {
  name: string;
  file: string;
  kind: "client" | "server";
  status: HookStatus;
};
