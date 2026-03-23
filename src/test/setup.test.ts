// セットアップ確認用の基本テスト
import { describe, it, expect } from "vitest";

describe("プロジェクトセットアップ", () => {
  it("テスト環境が正常に動作すること", () => {
    expect(true).toBe(true);
  });

  it("基本的な文字列操作が動作すること", () => {
    const appName = "TaskFlow";
    expect(appName).toHaveLength(8);
    expect(appName.toLowerCase()).toBe("taskflow");
  });
});
