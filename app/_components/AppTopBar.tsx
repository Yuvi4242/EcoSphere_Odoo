'use client';

import NotificationBell from '@/app/_components/governance/NotificationBell';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/app/_lib/utils';

export default function AppTopBar() {
  const [query, setQuery] = useState('');

  return (
    <header className="h-14 flex-shrink-0 bg-surface border-b border-border flex items-center px-6 gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          id="topbar-search"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-bg border border-border rounded-full outline-none focus:border-border-strong placeholder:text-text-muted"
        />
      </div>

      <div className="flex-1" />

      {/* XP pill */}
      <div className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold',
        'bg-gamif-light text-gamif border border-gamif/20'
      )}>
        <span className="text-base leading-none">⭐</span>
        <span>9,847 XP</span>
        <span className="opacity-50">·</span>
        <span>LVL 24</span>
      </div>

      {/* Notifications */}
      <NotificationBell />

      {/* Avatar */}
      <button
        id="user-avatar-btn"
        className="w-8 h-8 rounded-full bg-env flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-env/30 transition-all"
        aria-label="User menu"
      >
        SK
      </button>
    </header>
  );
}
