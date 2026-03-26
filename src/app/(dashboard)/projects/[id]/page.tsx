import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { KanbanBoard } from "@/components/features/kanban/kanban-board";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * プロジェクト詳細ページ（カンバンボード表示）
 * SSRでプロジェクトとタスク一覧を取得してKanbanBoardに渡す
 */
export default async function ProjectKanbanPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600 mt-1">{project.description}</p>
        )}
      </div>
      <KanbanBoard tasks={project.tasks} projectId={project.id} />
    </div>
  );
}
