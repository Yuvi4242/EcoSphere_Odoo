'use client';

import { Bell, Search, LogOut, ArrowRightLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/app/_lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { getUserProfile } from '@/app/_actions/gamification';

export default function AppTopBar() {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [xpData, setXpData] = useState<{ xpTotal: number; level: number } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        if (profile) {
          const calculatedLevel = Math.floor(profile.xpTotal / 400) + 1;
          setXpData({
            xpTotal: profile.xpTotal,
            level: calculatedLevel,
          });
        }
      } catch (err) {
        console.error('Error loading top bar profile:', err);
      }
    }
    loadProfile();
  }, [pathname]);

  const user = session?.user;
  const role = (user as any)?.role;
  const isAdmin = role === 'ADMIN';

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const isCurrentlyAdminView = pathname.startsWith('/admin');

  return (
    <header className="h-14 flex-shrink-0 bg-surface border-b border-border flex items-center px-6 gap-4 font-sans">
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
        <span>{(xpData?.xpTotal ?? 0).toLocaleString()} XP</span>
        <span className="opacity-50">·</span>
        <span>LVL {xpData?.level ?? 1}</span>
      </div>

      {/* Notifications */}
      <button
        id="notifications-btn"
        className="relative p-2 rounded-xl hover:bg-bg transition-colors text-text-muted hover:text-text-primary"
        aria-label="Notifications"
      >
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-social rounded-full" />
      </button>

      {/* Custom Dropdown Menu for Avatar */}
      <div className="relative">
        <button
          id="user-avatar-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-full bg-env flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-env/30 transition-all cursor-pointer"
          aria-label="User menu"
        >
          {getInitials()}
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop to close dropdown on click outside */}
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            
            <div className="absolute right-0 mt-2 bg-surface border border-border shadow-lg rounded-xl p-1 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-3 py-2 text-xs font-mono uppercase tracking-widest text-text-muted text-left">
                My Account
              </div>
              <div className="px-3 py-2 border-b border-border text-left">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-text-muted truncate font-mono">{user?.email}</p>
                <span className={cn(
                  'inline-block text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded mt-1',
                  isAdmin ? 'bg-env-light text-env border border-env/20' : 'bg-social-light text-social border border-social/20'
                )}>
                  {role ?? 'EMPLOYEE'}
                </span>
              </div>

              {/* Quick-Switch for Admin */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (isCurrentlyAdminView) {
                      router.push('/app');
                    } else {
                      router.push('/admin/overview');
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text-primary hover:bg-bg rounded-lg cursor-pointer transition-colors text-left border-0 bg-transparent font-medium"
                >
                  <ArrowRightLeft size={14} className="text-text-muted" />
                  <span>Switch to {isCurrentlyAdminView ? 'Employee' : 'Admin'} View</span>
                </button>
              )}

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut({ callbackUrl: '/login' });
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium text-left border-0 bg-transparent"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
