"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// プロジェクト作成入力のバリデーションスキーマ
const projectSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100),
  description: z.string().max(500).optional(),
  workspaceId: z.string().min(1),
});

/**
 * プロジェクトを新規作成するServer Action
 * RBAC: ADMIN ロールのみ作成可能
 */
export async function createProject(input: z.infer<typeof projectSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  try {
    // RBAC: ADMIN のみプロジェクト作成可能
    const member = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: parsed.data.workspaceId,
        },
      },
    });

    if (member?.role !== "ADMIN") {
      return { error: "プロジェクト作成には Admin 権限が必要です" };
    }

    const project = await db.project.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        workspaceId: parsed.data.workspaceId,
      },
    });

    revalidatePath("/projects");
    return { project };
  } catch {
    return { error: "プロジェクトの作成に失敗しました" };
  }
}

/**
 * ワークスペース内のプロジェクト一覧を取得するServer Action
 * タスク数も一緒に取得する
 * RBAC: ワークスペースメンバーのみアクセス可能
 */
export async function getProjects(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  // RBAC: ワークスペースメンバーのみアクセス可能
  const member = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId,
      },
    },
  });

  if (!member) return { error: "アクセス権限がありません" };

  try {
    const projects = await db.project.findMany({
      where: { workspaceId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    });

    return { projects };
  } catch {
    return { error: "プロジェクトの取得に失敗しました" };
  }
}

/**
 * プロジェクトを削除するServer Action
 * RBAC: ADMIN ロールのみ削除可能
 */
export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return { error: "プロジェクトが見つかりません" };

    const member = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (member?.role !== "ADMIN") {
      return { error: "削除には Admin 権限が必要です" };
    }

    await db.project.delete({ where: { id: projectId } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "プロジェクトの削除に失敗しました" };
  }
}
