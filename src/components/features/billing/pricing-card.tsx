"use client";

import { createCheckoutSession, createPortalSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Plan } from "@prisma/client";

// Pro プランの機能一覧
const proFeatures = [
  "無制限のプロジェクト",
  "無制限のメンバー招待",
  "ファイル添付（最大 1GB）",
  "優先サポート",
];

export function PricingCard({
  currentPlan,
  workspaceId,
}: {
  currentPlan: Plan;
  workspaceId: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      {/* Free プラン */}
      <Card
        className={currentPlan === "FREE" ? "border-2 border-slate-400" : ""}
      >
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>
            <span className="text-2xl font-bold">¥0</span> / 月
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              3 プロジェクトまで
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              5 メンバーまで
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              基本機能すべて
            </li>
          </ul>
          {currentPlan === "FREE" && (
            <Button variant="outline" className="w-full" disabled>
              現在のプラン
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Pro プラン */}
      <Card
        className={
          currentPlan === "PRO"
            ? "border-2 border-blue-500"
            : "border-2 border-dashed"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pro
            {currentPlan === "PRO" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                現在のプラン
              </span>
            )}
          </CardTitle>
          <CardDescription>
            <span className="text-2xl font-bold">¥1,980</span> / 月
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-gray-600">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {f}
              </li>
            ))}
          </ul>
          {currentPlan === "FREE" ? (
            <form action={createCheckoutSession.bind(null, workspaceId)}>
              <Button type="submit" className="w-full">
                Pro にアップグレード
              </Button>
            </form>
          ) : (
            <form action={createPortalSession.bind(null, workspaceId)}>
              <Button type="submit" variant="outline" className="w-full">
                プランを管理する
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
