"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskStatus, Priority } from "@prisma/client";

// タスク作成入力のバリデーションスキーマ
const createTaskSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  description: z.string().max(2000).optional(),
  projectId: z.string().min(1),
  priority: z.nativeEnum(Priority).default("MEDIUM"),
  dueDate: z.string().optional(),
});

/**
 * タスクを新規作成するServer Action
 */
export async function createTask(input: z.infer<typeof createTaskSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  try {
    const task = await db.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        projectId: parsed.data.projectId,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      },
      include: { assignee: true },
    });

    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { task };
  } catch {
    return { error: "タスクの作成に失敗しました" };
  }
}

/**
 * タスクのステータスを更新するServer Action
 * 楽観的更新と組み合わせて使用する
 */
export async function updateTaskStatus({
  taskId,
  status,
}: {
  taskId: string;
  status: TaskStatus;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  try {
    const task = await db.task.update({
      where: { id: taskId },
      data: { status },
      include: { assignee: true },
    });

    revalidatePath(`/projects/${task.projectId}`);
    return { task };
  } catch {
    return { error: "ステータスの更新に失敗しました" };
  }
}

/**
 * タスクを削除するServer Action
 */
export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  try {
    const task = await db.task.delete({ where: { id: taskId } });
    revalidatePath(`/projects/${task.projectId}`);
    return { success: true };
  } catch {
    return { error: "タスクの削除に失敗しました" };
  }
}

/**
 * プロジェクトのタスク一覧を取得するServer Action
 */
export async function getTasks(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  try {
    const tasks = await db.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: { createdAt: "asc" },
    });

    return { tasks };
  } catch {
    return { error: "タスクの取得に失敗しました" };
  }
}
