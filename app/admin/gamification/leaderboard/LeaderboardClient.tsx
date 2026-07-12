'use client';

import { useState } from 'react';
import { cn } from '@/app/_lib/utils';

const rankMedals = ['🥇', '🥈', '🥉'];

export default function LeaderboardClient({ users }: { users: any[] }) {
  const [period, setPeriod] = useState<'month' | 'alltime'>('alltime');
  const [scope, setScope] = useState<'org' | 'dept'>('org');

  return (
    <>
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
        {users.map((person, i) => (
          <div
            key={person.id}
            className={cn(
              'flex items-center gap-4 px-6 py-4 border-b border-border last:border-0',
              i < 3 && 'bg-gamif-light/30'
            )}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {i < 3
                ? <span className="text-xl">{rankMedals[i]}</span>
                : <span className="text-sm font-mono text-text-muted">{i + 1}</span>
              }
            </div>
            {/* Avatar */}
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 uppercase',
              i === 0 ? 'bg-amber-100 text-amber-700'
                : i === 1 ? 'bg-slate-100 text-slate-600'
                : i === 2 ? 'bg-orange-100 text-orange-700'
                : 'bg-gamif-light text-gamif'
            )}>
              {person.name?.[0] || '?'}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{person.name}</p>
              <p className="text-xs text-text-muted font-mono">{person.department?.name || 'Unassigned'}</p>
            </div>
            {/* XP */}
            <div className="text-right">
              <p className="text-sm font-black text-gamif">{person.xpTotal.toLocaleString()}</p>
              <p className="text-xs font-mono text-text-muted">XP</p>
            </div>
            {/* Change */}
            <span className={cn(
              'text-xs font-mono w-12 text-right',
              'text-env' // Mocking the change text to green for now since we don't have historical snapshots
            )}>
              +0
            </span>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-8 text-center text-text-muted">No users found.</div>
        )}
      </div>
    </>
  );
}
