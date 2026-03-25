import { PrismaClient } from "@prisma/client";

// グローバルオブジェクトにPrismaClientを保持する型定義
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 開発環境でのホットリロード時に複数インスタンスが生成されないようシングルトンにする
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
