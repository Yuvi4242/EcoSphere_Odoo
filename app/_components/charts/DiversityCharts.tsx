'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PieData { name: string; value: number }
interface BarData { group: string; count: number }

const GENDER_COLORS = ['#E8823D', '#22344E', '#7C4DFF'];

export function GenderPieChart({ data }: { data: PieData[] }) {
  return (
    <div className="flex items-center gap-8">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
            formatter={(v) => [`${v}%`]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: GENDER_COLORS[i % GENDER_COLORS.length] }} />
            <span className="text-text-muted font-mono text-xs">{d.name}</span>
            <span className="font-bold text-text-primary ml-auto pl-4">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgeBarChart({ data }: { data: BarData[] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6DF" vertical={false} />
        <XAxis dataKey="group" tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#8C8B84' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#8C8B84' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }}
          formatter={(v) => [`${v}%`, 'Share']}
        />
        <Bar dataKey="count" fill="#E8823D" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  );
}
