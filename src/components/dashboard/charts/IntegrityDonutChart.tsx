'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { IntegrityBreakdown } from '@/types/dashboard';

interface IntegrityDonutChartProps {
  data: IntegrityBreakdown;
}

const COLORS = {
  authentic: '#10b981', // green-500
  likelyAuthentic: '#22c55e', // green-400
  suspicious: '#eab308', // yellow-500
  likelyManipulated: '#f97316', // orange-500
  manipulated: '#ef4444', // red-500
};

export function IntegrityDonutChart({ data }: IntegrityDonutChartProps) {
  const chartData = [
    {
      name: 'Authentic',
      value: data.authentic,
      color: COLORS.authentic,
    },
    {
      name: 'Likely Authentic',
      value: data.likelyAuthentic,
      color: COLORS.likelyAuthentic,
    },
    {
      name: 'Suspicious',
      value: data.suspicious,
      color: COLORS.suspicious,
    },
    {
      name: 'Likely Manipulated',
      value: data.likelyManipulated,
      color: COLORS.likelyManipulated,
    },
    {
      name: 'Manipulated',
      value: data.manipulated,
      color: COLORS.manipulated,
    },
  ].filter((item) => item.value > 0); // Only show categories with data

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No integrity data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
