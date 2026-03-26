import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    task: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
    },
    workspaceMember: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

describe("updateTaskStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("未認証の場合はエラーを返す", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const { updateTaskStatus } = await import("@/actions/task");
    const result = await updateTaskStatus({ taskId: "t-1", status: "DONE" });
    expect(result).toEqual({ error: "認証が必要です" });
  });

  it("タスクのステータスを更新できる", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    // 認可チェック用: タスクとプロジェクト情報を返す
    vi.mocked(db.task.findUnique).mockResolvedValue({
      id: "t-1",
      project: { workspaceId: "ws-1" },
    } as any);
    // 認可チェック用: ワークスペースメンバーを返す
    vi.mocked(db.workspaceMember.findUnique).mockResolvedValue({
      role: "MEMBER",
    } as any);
    vi.mocked(db.task.update).mockResolvedValue({
      id: "t-1",
      status: "DONE",
      projectId: "proj-1",
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { updateTaskStatus } = await import("@/actions/task");
    const result = await updateTaskStatus({ taskId: "t-1", status: "DONE" });
    expect(result.task).toEqual(expect.objectContaining({ status: "DONE" }));
  });
});
