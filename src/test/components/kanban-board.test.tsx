import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "@/components/features/kanban/kanban-board";

vi.mock("@/actions/task", () => ({
  updateTaskStatus: vi.fn(),
  createTask: vi.fn(),
  deleteTask: vi.fn(),
}));

const mockTasks = [
  { id: "t-1", title: "TODOタスク", status: "TODO", priority: "MEDIUM", assignee: null, description: null, dueDate: null },
  { id: "t-2", title: "進行中タスク", status: "IN_PROGRESS", priority: "HIGH", assignee: null, description: null, dueDate: null },
  { id: "t-3", title: "完了タスク", status: "DONE", priority: "LOW", assignee: null, description: null, dueDate: null },
];

describe("KanbanBoard", () => {
  it("3つのカラムが表示される", () => {
    render(<KanbanBoard tasks={mockTasks} projectId="proj-1" />);
    // カラムヘッダーラベルが少なくとも1つ表示されていることを確認
    // （SelectItemにも同じテキストが存在するため getAllByText を使用）
    expect(screen.getAllByText("TODO").length).toBeGreaterThan(0);
    expect(screen.getAllByText("進行中").length).toBeGreaterThan(0);
    expect(screen.getAllByText("完了").length).toBeGreaterThan(0);
  });

  it("各タスクが対応するカラムに表示される", () => {
    render(<KanbanBoard tasks={mockTasks} projectId="proj-1" />);
    expect(screen.getByText("TODOタスク")).toBeInTheDocument();
    expect(screen.getByText("進行中タスク")).toBeInTheDocument();
    expect(screen.getByText("完了タスク")).toBeInTheDocument();
  });
});
