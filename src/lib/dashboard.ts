import { db } from "@/lib/db";

/**
 * ダッシュボード表示用の統計データを取得する
 */
export async function getDashboardStats(workspaceId: string) {
  const [taskStats, recentTasks, projectCount] = await Promise.all([
    // ステータス別タスク数
    db.task.groupBy({
      by: ["status"],
      where: { project: { workspaceId } },
      _count: true,
    }),
    // 直近7日の完了タスク数
    db.task.count({
      where: {
        project: { workspaceId },
        status: "DONE",
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // プロジェクト数
    db.project.count({ where: { workspaceId } }),
  ]);

  const total = taskStats.reduce((sum, s) => sum + s._count, 0);
  const done = taskStats.find((s) => s.status === "DONE")?._count ?? 0;
  const inProgress = taskStats.find((s) => s.status === "IN_PROGRESS")?._count ?? 0;
  const todo = taskStats.find((s) => s.status === "TODO")?._count ?? 0;

  return {
    total,
    done,
    inProgress,
    todo,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    recentCompletions: recentTasks,
    projectCount,
    chartData: [
      { name: "TODO", value: todo, fill: "#94a3b8" },
      { name: "進行中", value: inProgress, fill: "#3b82f6" },
      { name: "完了", value: done, fill: "#22c55e" },
    ],
  };
}
