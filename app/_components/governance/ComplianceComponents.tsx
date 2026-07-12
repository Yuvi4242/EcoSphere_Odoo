'use client';

import React from 'react';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './BadgeHelpers';
import { formatDate } from '@/app/_lib/utils';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import Link from 'next/link';

interface ComplianceTask {
  id: string;
  completedAt: Date | string | null;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  frequency: string;
  priority: string;
  status: string;
  dueDate: Date | string;
  owner?: { name: string | null } | null;
  tasks?: ComplianceTask[];
}

// ==========================================
// COMPLIANCE CARD
// ==========================================

export function ComplianceCard({ req }: { req: ComplianceRequirement }) {
  // Count task completions
  const totalTasks = req.tasks?.length || 0;
  const completedTasks = req.tasks?.filter((t) => t.completedAt !== null).length || 0;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isOverdue = new Date(req.dueDate) < new Date() && req.status !== 'Completed';

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between hover:border-border-strong transition-all">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            {req.frequency} Frequency
          </span>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={req.priority} />
            <StatusBadge status={isOverdue ? 'Overdue' : req.status} />
          </div>
        </div>

        <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-1">{req.title}</h4>
        <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">{req.description}</p>

        {/* Task progress bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-text-muted font-medium">Compliance Sub-Tasks</span>
              <span className="font-mono text-text-primary font-bold">{completedTasks}/{totalTasks} ({taskProgress}%)</span>
            </div>
            <ProgressBar value={taskProgress} color="gov" height="sm" />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <User size={13} />
            <span className="truncate max-w-[80px]">{req.owner?.name || 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>{formatDate(new Date(req.dueDate).toISOString())}</span>
          </div>
        </div>

        <Link
          href={`/governance/compliance/${req.id}`}
          className="text-xs font-semibold text-gov flex items-center gap-0.5 hover:underline"
        >
          Manage <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ==========================================
// COMPLIANCE PROGRESS / STATS WIDGETS
// ==========================================

interface DeptComparison {
  department: string;
  score: number;
}

interface ComplianceStats {
  score: number;
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  pending: number;
  deptComparisons: DeptComparison[];
}

export function ComplianceProgress({ stats }: { stats: ComplianceStats }) {
  // SVG circular gauge params
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (stats.score / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Progress Ring / Overall Score */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Overall ESG Compliance Score</p>
        
        <div className="relative flex items-center justify-center mb-3">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              stroke="#E8E6DF"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Foreground progress circle */}
            <circle
              stroke="#189A57"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-text-primary leading-none">{stats.score}%</span>
            <span className="text-[10px] uppercase font-mono tracking-wide text-text-muted mt-0.5">COMPLIANT</span>
          </div>
        </div>

        <p className="text-xs text-text-muted max-w-[200px]">
          {stats.completed} of {stats.total} regulations met. Overdue audits reduce this score immediately.
        </p>
      </div>

      {/* 2. Status Split Breakdown */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4 font-bold">Requirement Status Breakdown</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-env" /> Completed
            </span>
            <span className="font-bold text-text-primary">{stats.completed}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress
            </span>
            <span className="font-bold text-text-primary">{stats.inProgress}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f0f0ec]" /> Pending
            </span>
            <span className="font-bold text-text-primary">{stats.pending}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Overdue
            </span>
            <span className="font-bold text-red-600 font-semibold">{stats.overdue}</span>
          </div>
        </div>
      </div>

      {/* 3. Department comparisons */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Compliance by Department</p>
        <div className="space-y-3 overflow-y-auto max-h-48">
          {stats.deptComparisons?.slice(0, 4).map((d) => (
            <div key={d.department} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-primary font-medium">{d.department}</span>
                <span className="font-bold text-text-primary font-mono">{d.score}%</span>
              </div>
              <ProgressBar value={d.score} color={d.score >= 90 ? 'env' : d.score >= 70 ? 'social' : 'neutral'} height="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
