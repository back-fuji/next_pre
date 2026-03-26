"use client";

import { Button } from "@/components/ui/button";

// ダッシュボードのエラーバウンダリ
export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-xl font-bold">データの読み込みに失敗しました</h2>
      <p className="text-gray-600 text-sm">{error.message}</p>
      <Button onClick={reset} variant="outline">再試行する</Button>
    </div>
  );
}
