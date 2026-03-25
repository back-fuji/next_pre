export { auth as middleware } from "@/lib/auth";

export const config = {
  // Next.js 推奨パターン: 静的ファイルと API 以外の全ルートに認証を適用する
  // パスベースの列挙方式だと将来のルート追加時に漏れが生じるため、除外方式を採用
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
