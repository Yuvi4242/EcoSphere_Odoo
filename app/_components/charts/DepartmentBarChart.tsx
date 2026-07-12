'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DeptData {
  department: string;
  tCO2e: number;
  limit?: number;
}

interface DepartmentBarChartProps {
  data: DeptData[];
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 12, padding: '8px 14px', fontSize: 12, fontFamily: 'monospace' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#189A57' }}>{payload[0].value} tCO2e</p>
      </div>
    );
  }
  return null;
};

export default function DepartmentBarChart({ data, color = '#189A57' }: DepartmentBarChartProps) {
  const sorted = [...data].sort((a, b) => b.tCO2e - a.tCO2e);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 40, left: 20, bottom: 4 }}
        barSize={18}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6DF" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#8C8B84' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}`}
        />
        <YAxis
          dataKey="department"
          type="category"
          tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#8C8B84' }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F7F5EF' }} />
        <Bar dataKey="tCO2e" radius={[0, 6, 6, 0]}>
          {sorted.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.limit && entry.tCO2e > entry.limit * 0.9 ? '#E8823D' : color}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
