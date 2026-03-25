"use client";

import { useWorkspaces } from "@/hooks/use-workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/**
 * ワークスペース切り替えドロップダウンコンポーネント
 * TanStack Query でワークスペース一覧を取得し表示する
 */
export function WorkspaceSwitcher() {
  const { data, isLoading } = useWorkspaces();

  if (isLoading) {
    return <Button variant="outline" size="sm" disabled>読み込み中...</Button>;
  }

  // エラー時または未取得時は空配列として扱う
  const workspaces = "workspaces" in (data ?? {}) ? (data as { workspaces: { id: string; name: string }[] }).workspaces : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          ワークスペース
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>ワークスペース</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.length === 0 ? (
          <DropdownMenuItem disabled>まだありません</DropdownMenuItem>
        ) : (
          workspaces.map((ws) => (
            <DropdownMenuItem key={ws.id}>{ws.name}</DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
