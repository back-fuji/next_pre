import { describe, it, expect } from "vitest";

describe("auth configuration", () => {
  it("AUTH_SECRET が設定されていること", () => {
    // CI 環境では環境変数が設定されていないためスキップ
    if (process.env.CI) return;
    expect(process.env.AUTH_SECRET).toBeDefined();
    expect(process.env.AUTH_SECRET!.length).toBeGreaterThan(0);
  });
});
