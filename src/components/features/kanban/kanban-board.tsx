"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Priority, TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "./kanban-column";
import { CreateTaskDialog } from "./create-task-dialog";

// タスクの型定義（assignee は省略可能なユーザー情報を含む）
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignee: { name: string | null; image: string | null } | null;
  dueDate: Date | null;
};

type Props = {
  tasks: Task[];
  projectId: string;
};

// カンバンボードのカラム定義
const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "TODO" },
  { status: "IN_PROGRESS", label: "進行中" },
  { status: "DONE", label: "完了" },
];

/**
 * カンバンボードコンポーネント
 * タスクをステータス別のカラムで表示し、タスク追加ダイアログを提供する
 */
export function KanbanBoard({ tasks, projectId }: Props) {
  const [open, setOpen] = useState(false);

  // ステータスごとにタスクを分類する
  const tasksByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = tasks.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">タスクボード</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          タスク追加
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            tasks={tasksByStatus[col.status] ?? []}
          />
        ))}
      </div>

      <CreateTaskDialog
        open={open}
        onOpenChange={setOpen}
        projectId={projectId}
      />
    </div>
  );
}
