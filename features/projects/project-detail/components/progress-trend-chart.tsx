'use client';

import { css } from 'styled-system/css';
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
import type { TrendPoint } from '@/mocks/data/project-progress-detail-data';

interface ProgressTrendChartProps {
  trend: TrendPoint[];
  currentIteration: string;
}

const extractNumber = (key: string) => {
  const m = key.match(/\d+/);
  return m ? Number(m[0]) : 0;
};

export const ProgressTrendChart = ({
  trend,
  currentIteration,
}: ProgressTrendChartProps) => {
  if (trend.length === 0) {
    return (
      <p className={emptyStyle}>進捗データがありません。</p>
    );
  }

  const currentNumber = extractNumber(currentIteration);

  const data = trend.map((point) => {
    const num = extractNumber(point.iteration);
    const isCurrent = num === currentNumber;
    const isFuture = num > currentNumber;
    return {
      name: `IT#${num}`,
      実績: !isFuture && point.actualRate != null ? point.actualRate : null,
      予定: point.idealRate,
      // 現在イテレーションの実績値を起点にして未来へ延ばす（実績線に接続）
      予想: isCurrent ? point.actualRate : (isFuture ? point.predictedRate : null),
    };
  });

  return (
    <div className={containerStyle}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={false}
          />
          <YAxis
            unit="%"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            formatter={(value, name) => {
              if (value == null) return ['-', String(name)];
              return [`${Number(value).toFixed(1)}%`, String(name)];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="実績"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 3 }}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="予定"
            stroke="#9ca3af"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="予想"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ fill: '#f59e0b', r: 3 }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const containerStyle = css({
  w: '100%',
  pt: '4px',
});

const emptyStyle = css({
  fontSize: '13px',
  color: 'ksTheme.text.inactive',
  py: '16px',
  textAlign: 'center',
});
