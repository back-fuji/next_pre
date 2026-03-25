import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/actions/workspace";

/**
 * ログインユーザーのワークスペース一覧を取得するカスタムフック
 * TanStack Query でキャッシュ管理する
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
  });
}
