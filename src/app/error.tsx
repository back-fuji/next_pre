"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// グローバルエラーバウンダリ
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをコンソールに出力
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">予期しないエラーが発生しました</h2>
        <p className="text-gray-600 text-sm">{error.message}</p>
        <Button onClick={reset}>再試行する</Button>
      </div>
    </div>
  );
}
