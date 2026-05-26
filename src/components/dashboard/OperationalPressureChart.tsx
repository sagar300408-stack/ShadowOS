"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = ["#67e8f9", "#34d399", "#facc15", "#fb7185", "#a78bfa"];

type OperationalPressureChartProps = {
  data: Array<{
    name: string;
    value: number;
  }>;
};

export function OperationalPressureChart({ data }: OperationalPressureChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(103,232,249,0.08)" }}
          contentStyle={{
            background: "#020617",
            border: "1px solid rgba(103,232,249,0.22)",
            color: "#f8fafc",
          }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

