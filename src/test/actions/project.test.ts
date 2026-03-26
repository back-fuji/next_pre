import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

describe("createProject", () => {
  beforeEach(() => vi.clearAllMocks());

  it("未認証の場合はエラーを返す", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const { createProject } = await import("@/actions/project");
    const result = await createProject({ name: "テスト", workspaceId: "ws-1" });
    expect(result).toEqual({ error: "認証が必要です" });
  });

  it("ADMIN でない場合はエラーを返す", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(db.workspaceMember.findUnique).mockResolvedValue({
      role: "MEMBER",
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { createProject } = await import("@/actions/project");
    const result = await createProject({ name: "テスト", workspaceId: "ws-1" });
    expect(result).toEqual({ error: "プロジェクト作成には Admin 権限が必要です" });
  });

  it("ADMIN の場合はプロジェクトを作成する", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(db.workspaceMember.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as any);
    const mockProject = { id: "proj-1", name: "テスト", workspaceId: "ws-1" };
    vi.mocked(db.project.create).mockResolvedValue(mockProject as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { createProject } = await import("@/actions/project");
    const result = await createProject({ name: "テスト", workspaceId: "ws-1" });
    expect(result).toEqual({ project: mockProject });
  });
});

describe("getProjects", () => {
  beforeEach(() => vi.clearAllMocks());

  it("未認証の場合はエラーを返す", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const { getProjects } = await import("@/actions/project");
    const result = await getProjects("ws-1");
    expect(result).toEqual({ error: "認証が必要です" });
  });

  it("メンバーでない場合はエラーを返す", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    vi.mocked(db.workspaceMember.findUnique).mockResolvedValue(null);

    const { getProjects } = await import("@/actions/project");
    const result = await getProjects("ws-1");
    expect(result).toEqual({ error: "アクセス権限がありません" });
  });

  it("メンバーの場合はプロジェクト一覧を返す", async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(db.workspaceMember.findUnique).mockResolvedValue({ role: "MEMBER" } as any);
    const mockProjects = [{ id: "proj-1", name: "テスト", _count: { tasks: 0 } }];
    vi.mocked(db.project.findMany).mockResolvedValue(mockProjects as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { getProjects } = await import("@/actions/project");
    const result = await getProjects("ws-1");
    expect(result).toEqual({ projects: mockProjects });
  });
});
