import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * プロジェクト詳細ページの404コンポーネント
 * プロジェクトが見つからない場合に表示される
 */
export default function ProjectNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold">プロジェクトが見つかりません</h2>
      <p className="text-gray-600 mt-2">
        削除されたか、アクセス権限がない可能性があります。
      </p>
      <Button asChild className="mt-4">
        <Link href="/projects">プロジェクト一覧に戻る</Link>
      </Button>
    </div>
  );
}
