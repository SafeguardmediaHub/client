'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Trends } from '@/types/dashboard';

interface TrendsLineChartProps {
  data: Trends;
}

export function TrendsLineChart({ data }: TrendsLineChartProps) {
  if (
    data.uploadsOverTime.length === 0 &&
    data.filesProcessedOverTime.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No trend data available
      </div>
    );
  }

  // Combine uploads and processed data by date
  const dateMap = new Map<
    string,
    { date: string; uploads: number; processed: number; avgScore: number }
  >();

  // Add uploads
  data.uploadsOverTime.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    dateMap.set(item.date, {
      date,
      uploads: item.count,
      processed: 0,
      avgScore: 0,
    });
  });

  // Add processed
  data.filesProcessedOverTime.forEach((item) => {
    const existing = dateMap.get(item.date);
    const date = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (existing) {
      existing.processed = item.count;
    } else {
      dateMap.set(item.date, {
        date,
        uploads: 0,
        processed: item.count,
        avgScore: 0,
      });
    }
  });

  // Add integrity scores
  data.integrityScoreTrend.forEach((item) => {
    const existing = dateMap.get(item.date);
    if (existing) {
      existing.avgScore = item.averageScore;
    }
  });

  const formattedData = Array.from(dateMap.values());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="uploads"
          stroke="#3b82f6"
          name="Uploads"
          strokeWidth={2}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="processed"
          stroke="#10b981"
          name="Processed"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avgScore"
          stroke="#8b5cf6"
          name="Avg Integrity Score"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
