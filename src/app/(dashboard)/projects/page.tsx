import { auth } from "@/lib/auth";
import { getProjects } from "@/actions/project";
import { getCurrentWorkspaceId } from "@/lib/workspace-context";
import { ProjectList } from "@/components/features/projects/project-list";
import { redirect } from "next/navigation";

/**
 * プロジェクト一覧ページ（サーバーコンポーネント）
 * SSR でプロジェクト一覧を取得して ProjectList に渡す
 */
export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const workspaceId = await getCurrentWorkspaceId(session.user.id);
  if (!workspaceId) redirect("/workspace");

  const result = await getProjects(workspaceId);
  const projects = "projects" in result ? result.projects : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">プロジェクト</h1>
      </div>
      <ProjectList initialProjects={projects} workspaceId={workspaceId} />
    </div>
  );
}
