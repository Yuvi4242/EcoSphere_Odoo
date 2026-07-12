'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard, Leaf, Users, Shield, Trophy, BarChart2, Settings, ChevronRight, Home, Gift, Award
} from 'lucide-react';
import { cn } from '@/app/_lib/utils';
import { getUserProfile } from '@/app/_actions/gamification';

const adminNavItems = [
  { label: 'Overview',        href: '/admin/overview',        icon: LayoutDashboard, accent: 'action' },
  { label: 'Environmental',   href: '/admin/environmental',   icon: Leaf,            accent: 'env'    },
  { label: 'Social',          href: '/admin/social',          icon: Users,           accent: 'social' },
  { label: 'Governance',      href: '/admin/governance',      icon: Shield,          accent: 'gov'    },
  { label: 'Gamification',    href: '/admin/gamification',    icon: Trophy,          accent: 'gamif'  },
  { label: 'Reports',         href: '/admin/reports',         icon: BarChart2,       accent: 'action' },
  { label: 'Settings',        href: '/admin/settings',        icon: Settings,        accent: 'action' },
];

const employeeNavItems = [
  { label: 'Home',            href: '/app',                   icon: Home,            accent: 'action' },
  { label: 'CSR Activities',  href: '/app/csr-activities',    icon: Users,           accent: 'social' },
  { label: 'Challenges',      href: '/app/challenges',        icon: Trophy,          accent: 'gamif'  },
  { label: 'Rewards',         href: '/app/rewards',           icon: Gift,            accent: 'gamif'  },
  { label: 'Badges',          href: '/app/badges',            icon: Award,           accent: 'gamif'  },
  { label: 'Leaderboard',     href: '/app/leaderboard',       icon: BarChart2,       accent: 'gamif'  },
  { label: 'Policies',        href: '/app/policies',          icon: Shield,          accent: 'gov'    },
];

const accentTextMap: Record<string, string> = {
  env:    'text-env bg-env-light',
  social: 'text-social bg-social-light',
  gov:    'text-gov bg-gov-light',
  gamif:  'text-gamif bg-gamif-light',
  action: 'text-text-primary bg-border',
};

const accentBorderMap: Record<string, string> = {
  env:    'border-env',
  social: 'border-social',
  gov:    'border-gov',
  gamif:  'border-gamif',
  action: 'border-action',
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [xpData, setXpData] = useState<{ xpTotal: number; level: number } | null>(null);

  const isEmployeeView = pathname.startsWith('/app');
  const navItems = isEmployeeView ? employeeNavItems : adminNavItems;
  const user = session?.user;
  const role = (user as any)?.role;

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
        console.error('Error loading sidebar profile:', err);
      }
    }
    loadProfile();
  }, [pathname]);

  // Get user initials
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <aside className="w-60 flex-shrink-0 h-full bg-bg border-r border-border flex flex-col font-sans">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-env flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-black text-base text-text-primary tracking-tight">EcoSphere</span>
        </div>
        {/* Dynamic header label based on current shell */}
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-0.5 ml-9">
          {isEmployeeView ? 'ESG PLATFORM' : 'Admin Panel'}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-3 mb-2">Navigation</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(item => {
            const isHomePath = item.href === '/admin/overview' || item.href === '/app';
            const isActive = pathname === item.href || (!isHomePath && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? cn('text-text-primary bg-surface card-shadow border-l-2', accentBorderMap[item.accent])
                      : 'text-text-muted hover:text-text-primary hover:bg-surface/60 border-l-2 border-transparent'
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    isActive ? accentTextMap[item.accent] : 'text-text-muted group-hover:text-text-primary'
                  )}>
                    <Icon size={15} />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-40" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* XP Widget for employee view */}
      {isEmployeeView && xpData !== null && (
        <div className="mx-4 my-3 p-4 bg-gamif-light border border-gamif/20 rounded-2xl flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center justify-between font-mono font-bold text-xs text-gamif">
            <span>⭐ {xpData.xpTotal.toLocaleString()} XP</span>
            <span>LVL {xpData.level}</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden mt-1 bg-gray-200">
            <div 
              className="bg-gamif h-2 rounded-full transition-all duration-500" 
              style={{ width: `${((xpData.xpTotal % 400) / 400) * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider mt-1 text-center">
            {400 - (xpData.xpTotal % 400)} XP to Next Level
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-env-light flex items-center justify-center text-env font-bold text-xs flex-shrink-0">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'Loading...'}</p>
            <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">{role ?? 'EMPLOYEE'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
