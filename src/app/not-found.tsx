import Link from "next/link";
import { Button } from "@/components/ui/button";

// 404ページ
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="text-xl font-bold">ページが見つかりません</h2>
        <p className="text-gray-600">お探しのページは削除されたか、URLが間違っている可能性があります。</p>
        <Button asChild>
          <Link href="/dashboard">ダッシュボードに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
