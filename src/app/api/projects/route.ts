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
  return NextResponse.json(result);
}
