'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const ENV_COLOR = '#189A57';
const SOCIAL_COLOR = '#E8823D';
const GOV_COLOR = '#22344E';
const GAMIF_COLOR = '#7C4DFF';
const MUTED_COLOR = '#8C8B84';

// Mock/Standard data to represent trends if none is provided dynamically
const defaultComplianceTrend = [
  { month: 'Jan', rate: 70 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 75 },
  { month: 'Apr', rate: 78 },
  { month: 'May', rate: 82 },
  { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 91 },
];

const defaultAuditTrend = [
  { month: 'Jan', scheduled: 2, completed: 1 },
  { month: 'Feb', scheduled: 3, completed: 2 },
  { month: 'Mar', scheduled: 4, completed: 4 },
  { month: 'Apr', scheduled: 2, completed: 2 },
  { month: 'May', scheduled: 3, completed: 3 },
  { month: 'Jun', scheduled: 5, completed: 4 },
  { month: 'Jul', scheduled: 1, completed: 1 },
];

const defaultPolicyAcceptance = [
  { week: 'Wk 1', rate: 45 },
  { week: 'Wk 2', rate: 58 },
  { week: 'Wk 3', rate: 69 },
  { week: 'Wk 4', rate: 74 },
  { week: 'Wk 5', rate: 82 },
  { week: 'Wk 6', rate: 88 },
  { week: 'Wk 7', rate: 93 },
];

interface ChartsProps {
  deptCompliance?: { department: string; score: number }[];
  riskDistribution?: { name: string; value: number }[];
}

export default function AnalyticsChart({ deptCompliance, riskDistribution }: ChartsProps) {
  // Setup standard department comparisons if none is passed
  const deptData = deptCompliance || [
    { department: 'Finance', score: 95 },
    { department: 'HR', score: 100 },
    { department: 'IT', score: 88 },
    { department: 'Operations', score: 79 },
    { department: 'Legal', score: 85 },
  ];

  // Setup risk distribution data
  const riskData = riskDistribution || [
    { name: 'Critical', value: 2 },
    { name: 'High', value: 5 },
    { name: 'Medium', value: 8 },
    { name: 'Low', value: 5 },
  ];

  // Risk Color Mapping
  const riskColors: Record<string, string> = {
    Critical: '#ef4444', // Red
    High: '#f97316',     // Orange
    Medium: '#eab308',   // Yellow
    Low: '#3b82f6',      // Blue
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Compliance Score Trend */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Compliance Score Trend (%)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultComplianceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="complianceGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ENV_COLOR} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={ENV_COLOR} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DF" />
              <XAxis dataKey="month" stroke={MUTED_COLOR} fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke={MUTED_COLOR} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#FFF', border: '1px solid #E8E6DF', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="rate" stroke={ENV_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#complianceGlow)" name="Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Audit Completion Trend */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Audits Scheduled vs Completed</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defaultAuditTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DF" />
              <XAxis dataKey="month" stroke={MUTED_COLOR} fontSize={11} tickLine={false} />
              <YAxis stroke={MUTED_COLOR} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#FFF', border: '1px solid #E8E6DF', borderRadius: '12px' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="scheduled" fill={GOV_COLOR} radius={[4, 4, 0, 0]} name="Scheduled" />
              <Bar dataKey="completed" fill={ENV_COLOR} radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Department Compliance */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Compliance Rating by Department</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E6DF" />
              <XAxis type="number" domain={[0, 100]} stroke={MUTED_COLOR} fontSize={11} tickLine={false} />
              <YAxis dataKey="department" type="category" stroke={MUTED_COLOR} fontSize={11} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#FFF', border: '1px solid #E8E6DF', borderRadius: '12px' }} />
              <Bar dataKey="score" fill={GAMIF_COLOR} radius={[0, 4, 4, 0]} name="Score %" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Risk Level Distribution & Policy Acceptance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Risk distribution donut */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Risk Register Split</p>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={riskColors[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-primary leading-none">
                {riskData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wide text-text-muted">Risks</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] font-mono text-text-muted">
            {riskData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 justify-start">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riskColors[d.name] }} />
                <span>{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policy acceptance trend */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Policy Sign-off Rate</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultPolicyAcceptance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E8E6DF" />
                <XAxis dataKey="week" stroke={MUTED_COLOR} fontSize={9} tickLine={false} />
                <YAxis domain={[30, 100]} stroke={MUTED_COLOR} fontSize={9} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke={SOCIAL_COLOR} strokeWidth={2.5} dot={false} name="Sign-off %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-text-muted mt-2">
            Average employee policy acceptance rate over the last 7 weeks.
          </p>
        </div>
      </div>
    </div>
  );
}
