"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ChartData = { name: string; value: number; fill: string };

export function TaskStatusChart({ data }: { data: ChartData[] }) {
  // データがすべて0の場合は空状態を表示
  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        タスクがまだありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} タスク`]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
