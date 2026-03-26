import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject } from "@/actions/project";

// GET 系は Route Handler 経由で TanStack Query を使いキャッシュ管理する
// 変更系（create/delete）は Server Actions を直接 mutationFn に使う

// プロジェクトの型定義（タスク数を含む）
type Project = {
  id: string;
  name: string;
  description: string | null;
  _count: { tasks: number };
};

/**
 * プロジェクト一覧を取得するフック
 * initialData を渡すことで SSR データをキャッシュの初期値として利用できる
 */
export function useProjects(workspaceId: string, initialData?: Project[]) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("プロジェクト取得に失敗しました");
      return response.json() as Promise<{ projects?: Project[]; error?: string }>;
    },
    // SSR で取得した初期データをキャッシュの初期値として渡す
    initialData: initialData ? { projects: initialData } : undefined,
  });
}

/**
 * プロジェクトを作成するミューテーションフック
 * 成功後は対象ワークスペースのプロジェクト一覧を自動更新
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.workspaceId],
      });
    },
  });
}

/**
 * プロジェクトを削除するミューテーションフック
 * 成功後は対象ワークスペースのプロジェクト一覧を自動更新
 */
export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
