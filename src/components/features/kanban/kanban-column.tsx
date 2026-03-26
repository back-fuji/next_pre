import { Priority, TaskStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./kanban-card";

// タスクの型定義
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
  status: TaskStatus;
  label: string;
  tasks: Task[];
};

// ステータス別の背景色定義
const columnColors: Record<TaskStatus, string> = {
  TODO: "bg-slate-100",
  IN_PROGRESS: "bg-blue-50",
  DONE: "bg-green-50",
};

/**
 * カンバンカラムコンポーネント
 * 1つのステータスに対応するカラムを表示する
 */
export function KanbanColumn({ status, label, tasks }: Props) {
  return (
    <div className={`rounded-lg p-3 ${columnColors[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-sm">{label}</span>
        <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
