"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProjectDialog } from "./create-project-dialog";
import { useProjects } from "@/hooks/use-projects";

// プロジェクトの型定義（タスク数を含む）
type Project = {
  id: string;
  name: string;
  description: string | null;
  _count: { tasks: number };
};

type Props = {
  initialProjects: Project[];
  workspaceId: string;
};

/**
 * プロジェクト一覧を表示するクライアントコンポーネント
 * SSR データを initialData として渡し、作成・削除後に TanStack Query が自動再取得する
 */
export function ProjectList({ initialProjects, workspaceId }: Props) {
  const [open, setOpen] = useState(false);
  // SSR データを initialData として渡し、作成・削除後に自動再取得
  const { data } = useProjects(workspaceId, initialProjects);
  const projects: Project[] = (data && "projects" in data && Array.isArray(data.projects))
    ? (data.projects as Project[])
    : initialProjects;

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        プロジェクトを作成
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge variant="secondary">{project._count.tasks} タスク</Badge>
                </div>
                {project.description && (
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <CreateProjectDialog
        open={open}
        onOpenChange={setOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
