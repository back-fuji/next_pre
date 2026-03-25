import { cookies } from "next/headers";
import { db } from "@/lib/db";

// Cookie のキー名
const WORKSPACE_COOKIE = "current-workspace-id";

/**
 * 現在選択中のワークスペース ID を取得する。
 * Cookie に保存されていない場合はユーザーの最初のワークスペースを返す。
 */
export async function getCurrentWorkspaceId(userId: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieWorkspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value;

  if (cookieWorkspaceId) {
    // Cookie のワークスペースにアクセス権があるか確認
    const member = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId: cookieWorkspaceId },
      },
    });
    if (member) return cookieWorkspaceId;
  }

  // フォールバック: 最初のワークスペースを使用
  const membership = await db.workspaceMember.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return membership?.workspaceId ?? null;
}
