import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("デモデータを投入中...");

  // デモユーザー（実際は OAuth 経由でしか作成されないが、デモ用途で直接作成）
  const user = await db.user.upsert({
    where: { email: "demo@taskflow.app" },
    update: {},
    create: {
      email: "demo@taskflow.app",
      name: "Demo User",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
  });

  // デモワークスペース
  const workspace = await db.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      ownerId: user.id,
    },
  });

  // ADMIN として追加
  await db.workspaceMember.upsert({
    where: {
      userId_workspaceId: { userId: user.id, workspaceId: workspace.id },
    },
    update: {},
    create: { userId: user.id, workspaceId: workspace.id, role: "ADMIN" },
  });

  // デモプロジェクト
  const project = await db.project.upsert({
    where: { id: "demo-project-1" },
    update: {},
    create: {
      id: "demo-project-1",
      name: "ウェブサイトリニューアル",
      description: "コーポレートサイトのフルリニューアルプロジェクト",
      workspaceId: workspace.id,
    },
  });

  // デモタスク（重複を避けるため既存タスクを削除してから作成）
  await db.task.deleteMany({ where: { projectId: project.id } });

  const tasks = [
    { title: "デザインカンプ確認", status: "DONE" as const, priority: "HIGH" as const },
    { title: "トップページ実装", status: "DONE" as const, priority: "HIGH" as const },
    { title: "お問い合わせフォーム実装", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const },
    { title: "レスポンシブ対応", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const },
    { title: "SEO 対応", status: "TODO" as const, priority: "LOW" as const },
    { title: "パフォーマンスチューニング", status: "TODO" as const, priority: "MEDIUM" as const },
    { title: "本番環境デプロイ", status: "TODO" as const, priority: "HIGH" as const },
  ];

  for (const task of tasks) {
    await db.task.create({
      data: { ...task, projectId: project.id },
    });
  }

  console.log("デモデータの投入が完了しました");
  console.log(`ワークスペース: ${workspace.name} (${workspace.id})`);
  console.log(`プロジェクト: ${project.name} (${project.id})`);
  console.log(`タスク: ${tasks.length} 件`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
