'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendDataPoint } from '@/types/dashboard';

interface TamperingBarChartProps {
  data: TrendDataPoint[];
}

export function TamperingBarChart({ data }: TamperingBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No tampering data available
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#ef4444" name="Tampering Detected" />
      </BarChart>
    </ResponsiveContainer>
  );
}
