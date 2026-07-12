'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

interface EmissionsLineChartProps {
  data: { month: string; tCO2e: number }[];
}

export default function EmissionsLineChart({ data }: EmissionsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="envGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#189A57" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#189A57" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6DF" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#8C8B84' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#8C8B84' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}`}
        />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E8E6DF',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
          formatter={(value) => [`${value} tCO2e`, 'Emissions']}
        />
        <Area
          type="monotone"
          dataKey="tCO2e"
          stroke="#189A57"
          strokeWidth={2.5}
          fill="url(#envGradient)"
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
