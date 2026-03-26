import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace-context";
import { PricingCard } from "@/components/features/billing/pricing-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

export default async function BillingPage({ searchParams }: Props) {
  const { success } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workspaceId = await getCurrentWorkspaceId(session.user.id);
  if (!workspaceId) redirect("/workspace");

  // ワークスペースとメンバーシップを取得
  const [workspace, membership] = await Promise.all([
    db.workspace.findUnique({ where: { id: workspaceId } }),
    db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: session.user.id, workspaceId },
      },
    }),
  ]);

  if (!workspace || !membership) redirect("/workspace");

  // ADMIN ロールのみ課金設定を変更可能
  if (membership.role !== "ADMIN") {
    return <p className="text-gray-600">プランの変更には Admin 権限が必要です。</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プランと課金</h1>

      {success === "true" && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">
            Pro プランへのアップグレードが完了しました！
          </AlertDescription>
        </Alert>
      )}

      <PricingCard
        currentPlan={workspace.plan}
        workspaceId={workspace.id}
      />

      <p className="text-xs text-gray-500">
        ※ テストモードで動作しています。テスト用カード番号: 4242 4242 4242 4242
      </p>
    </div>
  );
}
