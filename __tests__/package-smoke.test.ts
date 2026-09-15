import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("ab-nextjs-hooks package smoke", () => {
  it("targets Next 16.3.4 peers and package metadata", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(pkg.name).toBe("ab-nextjs-hooks");
    expect(pkg.version).toBe("0.1.0");
    expect(pkg.peerDependencies.next).toBe("16.3.4");
  });

  it("exports supportedHooks catalog (8 pending)", async () => {
    const mod = await import("../index.ts");
    expect(Array.isArray(mod.supportedHooks)).toBe(true);
    expect(mod.supportedHooks).toHaveLength(8);
    expect(mod.supportedHooks.every((h) => h.status === "Pending")).toBe(true);
    expect(mod.default.supportedHooks).toHaveLength(8);
  });
});
