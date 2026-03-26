import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PricingCard } from "@/components/features/billing/pricing-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

export default async function BillingPage({ searchParams }: Props) {
  const { success } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // ADMIN ロールのワークスペースを取得
  const membership = await db.workspaceMember.findFirst({
    where: { userId: session.user.id, role: "ADMIN" },
    include: { workspace: true },
  });

  if (!membership) {
    return <p className="text-gray-600">Admin 権限が必要です。</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プランと課金</h1>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">
            Pro プランへのアップグレードが完了しました！
          </AlertDescription>
        </Alert>
      )}

      <PricingCard
        currentPlan={membership.workspace.plan}
        workspaceId={membership.workspace.id}
      />

      <p className="text-xs text-gray-500">
        ※ テストモードで動作しています。テスト用カード番号: 4242 4242 4242
        4242
      </p>
    </div>
  );
}
