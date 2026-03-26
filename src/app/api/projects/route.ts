import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/actions/project";

// プロジェクト一覧を返すRoute Handler
// TanStack Query からフェッチされることを想定
export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId が必要です" }, { status: 400 });
  }
  const result = await getProjects(workspaceId);

  if ("error" in result) {
    // 認証エラーは 401、権限エラーは 403、その他は 500
    const status = result.error === "認証が必要です" ? 401
      : result.error === "アクセス権限がありません" ? 403
      : 500;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
