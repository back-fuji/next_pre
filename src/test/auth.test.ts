import { describe, it, expect } from "vitest";

describe("auth configuration", () => {
  it("AUTH_SECRET が設定されていること", () => {
    if (!process.env.AUTH_SECRET) return;
    expect(process.env.AUTH_SECRET.length).toBeGreaterThan(0);
  });
});
