import { describe, it, expect, vi, beforeEach } from "vitest";

// next/cache をモック（テスト環境では静的生成ストアが存在しないため）
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Server Actions は DB 依存のため、Prisma をモック
// $transaction を含めてモック定義
vi.mock("@/lib/db", () => ({
  db: {
    workspace: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    workspaceMember: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

describe("createWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未認証の場合はエラーを返す", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const { createWorkspace } = await import("@/actions/workspace");
    const result = await createWorkspace({ name: "テスト" });

    expect(result).toEqual({ error: "認証が必要です" });
    // トランザクション自体が呼ばれていないことを確認
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("認証済みの場合はワークスペースを作成する", async () => {
    // テスト用モックのため Session 型の厳密な型指定を省略
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", name: "テスト", email: "test@example.com" },
    } as any);

    const mockWorkspace = {
      id: "ws-1",
      name: "テスト",
      slug: "test",
      plan: "FREE",
      ownerId: "user-1",
    };
    // $transaction はコールバック関数を受け取り、それを実行してその返り値を返す
    vi.mocked(db.$transaction).mockImplementation(async (fn: any) => {
      // transactionオブジェクトとして workspace.create と workspaceMember.create をモック
      const tx = {
        workspace: { create: vi.fn().mockResolvedValue(mockWorkspace) },
        workspaceMember: { create: vi.fn().mockResolvedValue({}) },
      };
      return fn(tx);
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { createWorkspace } = await import("@/actions/workspace");
    const result = await createWorkspace({ name: "テスト" });

    expect(result).toEqual({ workspace: mockWorkspace });
  });
});

describe("getWorkspaces", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未認証の場合はエラーを返す", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const { getWorkspaces } = await import("@/actions/workspace");
    const result = await getWorkspaces();

    expect(result).toEqual({ error: "認証が必要です" });
  });
});
