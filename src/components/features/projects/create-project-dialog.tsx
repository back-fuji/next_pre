"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProject } from "@/actions/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// フォームのバリデーションスキーマ
const schema = z.object({
  name: z.string().min(1, "名前は必須です").max(100),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
};

/**
 * プロジェクト作成ダイアログ
 * React Hook Form + Zod でバリデーション
 * Server Action（createProject）を直接呼び出す
 */
export function CreateProjectDialog({ open, onOpenChange, workspaceId }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await createProject({ ...values, workspaceId });
    if (result.error) {
      form.setError("name", { message: result.error });
      return;
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロジェクトを作成</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロジェクト名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: ウェブサイトリニューアル" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明（任意）</FormLabel>
                  <FormControl>
                    <Input placeholder="プロジェクトの概要" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "作成中..." : "作成する"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
