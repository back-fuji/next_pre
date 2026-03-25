import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject } from "@/actions/project";

// GET 系は Route Handler 経由で TanStack Query を使いキャッシュ管理する
// 変更系（create/delete）は Server Actions を直接 mutationFn に使う

/**
 * プロジェクト一覧を取得するフック
 */
export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
      if (!response.ok) throw new Error("プロジェクト取得に失敗しました");
      const data = await response.json() as { projects?: unknown[]; error?: string };
      return data;
    },
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
