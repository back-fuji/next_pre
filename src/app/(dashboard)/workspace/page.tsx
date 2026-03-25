import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspaceForm } from "@/components/features/workspace/create-workspace-form";
import { getWorkspaces } from "@/actions/workspace";

/**
 * ワークスペース一覧・作成ページ
 * ログインユーザーが所属する全ワークスペースを表示し、新規作成も可能
 */
export default async function WorkspacePage() {
  const result = await getWorkspaces();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">ワークスペース</h1>

      {/* 既存ワークスペース一覧 */}
      {"workspaces" in result && result.workspaces && result.workspaces.length > 0 && (
        <div className="space-y-2">
          {result.workspaces.map((ws) => (
            <Card key={ws.id}>
              <CardHeader className="py-4">
                <CardTitle className="text-base">{ws.name}</CardTitle>
                <CardDescription>
                  {ws.members.length} メンバー・{ws._count.projects} プロジェクト
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* 新規ワークスペース作成フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>新規ワークスペース作成</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
