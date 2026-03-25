import { db } from "@/lib/db";
import { Role } from "@prisma/client";

/**
 * ユーザーがワークスペースの特定ロールを持つか確認する
 * @param userId - 確認対象のユーザーID
 * @param workspaceId - ワークスペースID
 * @param role - 必要なロール（デフォルト: MEMBER）
 * @returns ロールを持つ場合はtrue、持たない場合はfalse
 */
export async function requireWorkspaceRole(
  userId: string,
  workspaceId: string,
  role: Role = "MEMBER"
): Promise<boolean> {
  const member = await db.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!member) return false;
  if (role === "MEMBER") return true;
  if (role === "ADMIN") return member.role === "ADMIN";

  return false;
}
