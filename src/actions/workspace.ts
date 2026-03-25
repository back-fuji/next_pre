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
 */
export async function createWorkspace(input: CreateWorkspaceInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = createWorkspaceSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = generateSlug(parsed.data.name);

  const workspace = await db.workspace.create({
    data: {
      name: parsed.data.name,
      slug,
      ownerId: session.user.id,
    },
  });

  // オーナーを ADMIN として WorkspaceMember に追加
  await db.workspaceMember.create({
    data: {
      userId: session.user.id,
      workspaceId: workspace.id,
      role: "ADMIN",
    },
  });

  revalidatePath("/dashboard");
  return { workspace };
}

/**
 * ログインユーザーが所属するワークスペース一覧を取得するServer Action
 */
export async function getWorkspaces() {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

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
}
