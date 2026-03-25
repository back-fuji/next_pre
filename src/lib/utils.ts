import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ワークスペース名からURLスラグを生成する
 * 小文字化・スペースをハイフンに変換・英数字とハイフン以外を除去・50文字に切り詰め
 * 日本語などASCII以外の文字で空文字になる場合はタイムスタンプベースでフォールバック
 */
export function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 50);

  // 日本語などASCII以外の文字で空文字になる場合はタイムスタンプでフォールバック
  return slug || Date.now().toString(36);
}
