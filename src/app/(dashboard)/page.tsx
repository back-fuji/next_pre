import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDashboardStats } from "@/lib/dashboard";
import { StatsCards } from "@/components/features/dashboard/stats-cards";
import { TaskStatusChart } from "@/components/features/dashboard/task-status-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // ユーザーの最初のワークスペースを取得
  const membership = await db.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true },
  });

  if (!membership) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">ワークスペースがありません</h2>
        <p className="text-gray-600 mt-2">まずワークスペースを作成してください。</p>
      </div>
    );
  }

  const stats = await getDashboardStats(membership.workspaceId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-gray-600 text-sm mt-1">{membership.workspace.name}</p>
      </div>

      <StatsCards
        total={stats.total}
        done={stats.done}
        inProgress={stats.inProgress}
        completionRate={stats.completionRate}
        _projectCount={stats.projectCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">タスク状況</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusChart data={stats.chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">直近7日の完了タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.recentCompletions}</div>
            <p className="text-sm text-gray-500 mt-1">件のタスクを完了</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
