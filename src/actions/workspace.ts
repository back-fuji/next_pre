"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// ワークスペース作成入力のバリデーションスキーマ
const createWorkspaceSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(50, "50文字以内で入力してください"),
});

type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

/**
 * ワークスペースを新規作成するServer Action
 * 作成者はADMINロールとしてWorkspaceMemberに追加される
 * workspace.createとworkspaceMember.createをトランザクションにまとめ原子性を保証
 */
export async function createWorkspace(input: CreateWorkspaceInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = createWorkspaceSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = generateSlug(parsed.data.name);

  try {
    const workspace = await db.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: {
          name: parsed.data.name,
          slug,
          ownerId: session.user.id,
        },
      });

      // オーナーを ADMIN として WorkspaceMember に追加
      await tx.workspaceMember.create({
        data: {
          userId: session.user.id,
          workspaceId: ws.id,
          role: "ADMIN",
        },
      });

      return ws;
    });

    revalidatePath("/dashboard");
    return { workspace };
  } catch {
    return { error: "ワークスペースの作成に失敗しました" };
  }
}

/**
 * ログインユーザーが所属するワークスペース一覧を取得するServer Action
 */
export async function getWorkspaces() {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  try {
    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: { userId: session.user.id },
        },
      },
      include: {
        members: { include: { user: true } },
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return { workspaces };
  } catch {
    return { error: "ワークスペースの取得に失敗しました" };
  }
}
