"use client";

import { useState } from "react";
import { TaskStatus } from "@prisma/client";
import { updateTaskStatus } from "@/actions/task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// タスクの型定義
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  assignee: { name: string | null } | null;
  dueDate: Date | null;
};

// 優先度に対応するBadgeのvariant定義（型安全に管理）
const priorityVariants: Record<string, "destructive" | "secondary" | "outline"> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

/**
 * カンバンカードコンポーネント
 * タスク情報を表示し、ステータス変更を楽観的更新で行う
 */
export function KanbanCard({ task }: { task: Task }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);

  // ステータス変更ハンドラー（楽観的更新 + エラー時ロールバック）
  async function handleStatusChange(newStatus: TaskStatus) {
    setLoading(true);
    setStatus(newStatus); // 楽観的更新
    const result = await updateTaskStatus({ taskId: task.id, status: newStatus });
    if ("error" in result) setStatus(task.status); // エラー時はロールバック
    setLoading(false);
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between">
          <Badge
            variant={priorityVariants[task.priority] ?? "secondary"}
            className="text-xs"
          >
            {task.priority}
          </Badge>
          <Select
            value={status}
            onValueChange={(v) => handleStatusChange(v as TaskStatus)}
            disabled={loading}
          >
            <SelectTrigger className="h-6 text-xs w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">TODO</SelectItem>
              <SelectItem value="IN_PROGRESS">進行中</SelectItem>
              <SelectItem value="DONE">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
