"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ワークスペース作成フォームのバリデーションスキーマ
const schema = z.object({
  name: z.string().min(1, "名前は必須です").max(50, "50文字以内"),
});

type FormValues = z.infer<typeof schema>;

/**
 * ワークスペース新規作成フォームコンポーネント
 * 送信後はダッシュボードへリダイレクト
 */
export function CreateWorkspaceForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await createWorkspace(values);
    if (result.error) {
      form.setError("name", { message: result.error });
      return;
    }
    router.push("/dashboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ワークスペース名</FormLabel>
              <FormControl>
                <Input placeholder="例: 株式会社〇〇" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "作成中..." : "作成する"}
        </Button>
      </form>
    </Form>
  );
}
