import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Supabase の自動一時停止対策用 ping エンドポイント
// Vercel Cron で定期的に呼び出す
export async function GET() {
  await db.$queryRaw`SELECT 1`;
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
