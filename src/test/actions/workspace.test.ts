import { describe, it, expect, vi, beforeEach } from "vitest";

// next/cache をモック（テスト環境では静的生成ストアが存在しないため）
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Server Actions は DB 依存のため、Prisma をモック
vi.mock("@/lib/db", () => ({
  db: {
    workspace: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    workspaceMember: {
      create: vi.fn(),
    },
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
    expect(db.workspace.create).not.toHaveBeenCalled();
  });

  it("認証済みの場合はワークスペースを作成する", async () => {
    // テスト用モックのため Session 型の厳密な型指定を省略
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", name: "テスト", email: "test@example.com" },
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const mockWorkspace = {
      id: "ws-1",
      name: "テスト",
      slug: "tesuto",
      plan: "FREE",
      ownerId: "user-1",
    };
    // テスト用モックのため Prisma 戻り値の型指定を省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(db.workspace.create).mockResolvedValue(mockWorkspace as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(db.workspaceMember.create).mockResolvedValue({} as any);

    const { createWorkspace } = await import("@/actions/workspace");
    const result = await createWorkspace({ name: "テスト" });

    expect(result).toEqual({ workspace: mockWorkspace });
    expect(db.workspace.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "テスト",
          ownerId: "user-1",
        }),
      })
    );
  });
});
