import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 未認証ユーザーをログインページにリダイレクト
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">TaskFlow</span>
        <span className="text-sm text-gray-600">{session.user?.email}</span>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
