'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import { leaderboard } from '@/app/_lib/mock-data';
import { cn } from '@/app/_lib/utils';

const rankMedals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'month' | 'alltime'>('month');
  const [scope, setScope] = useState<'org' | 'dept'>('org');

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Leaderboard"
        title="XP Leaderboard"
        subtitle="Top performers by ESG engagement, challenges completed, and emissions logged"
        accentColor="gamif"
      />

      {/* Filter toggles */}
      <div className="flex gap-3 mb-6">
        <div className="flex bg-surface border border-border rounded-xl p-1">
          {(['month', 'alltime'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                period === p ? 'bg-gamif text-white' : 'text-text-muted hover:text-text-primary'
              )}
            >
              {p === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
        <div className="flex bg-surface border border-border rounded-xl p-1">
          {(['org', 'dept'] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                scope === s ? 'bg-gamif text-white' : 'text-text-muted hover:text-text-primary'
              )}
            >
              {s === 'org' ? 'Org-wide' : 'My Department'}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked list */}
      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        {leaderboard.map((person, i) => (
          <div
            key={person.rank}
            className={cn(
              'flex items-center gap-4 px-6 py-4 border-b border-border last:border-0',
              i < 3 && 'bg-gamif-light/30'
            )}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {i < 3
                ? <span className="text-xl">{rankMedals[i]}</span>
                : <span className="text-sm font-mono text-text-muted">{person.rank}</span>
              }
            </div>
            {/* Avatar */}
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
              i === 0 ? 'bg-amber-100 text-amber-700'
                : i === 1 ? 'bg-slate-100 text-slate-600'
                : i === 2 ? 'bg-orange-100 text-orange-700'
                : 'bg-gamif-light text-gamif'
            )}>
              {person.avatar}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{person.name}</p>
              <p className="text-xs text-text-muted font-mono">{person.department}</p>
            </div>
            {/* XP */}
            <div className="text-right">
              <p className="text-sm font-black text-gamif">{person.xp.toLocaleString()}</p>
              <p className="text-xs font-mono text-text-muted">XP</p>
            </div>
            {/* Change */}
            <span className={cn(
              'text-xs font-mono w-12 text-right',
              person.change.startsWith('+') ? 'text-env' : 'text-social'
            )}>
              {person.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
