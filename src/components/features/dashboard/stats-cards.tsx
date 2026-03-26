import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, FolderOpen, TrendingUp } from "lucide-react";

type Props = {
  total: number;
  done: number;
  inProgress: number;
  completionRate: number;
  projectCount: number;
};

export function StatsCards({ total, done, inProgress, completionRate }: Props) {
  const stats = [
    { title: "総タスク数", value: total, icon: CheckSquare, color: "text-slate-600" },
    { title: "完了", value: done, icon: TrendingUp, color: "text-green-600" },
    { title: "進行中", value: inProgress, icon: Clock, color: "text-blue-600" },
    { title: "達成率", value: `${completionRate}%`, icon: FolderOpen, color: "text-purple-600" },
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
