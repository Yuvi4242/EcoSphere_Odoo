'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Leaf, Users, Shield, Trophy, BarChart2, Settings, ChevronRight
} from 'lucide-react';
import { cn } from '@/app/_lib/utils';

const navItems = [
  { label: 'Overview',        href: '/overview',        icon: LayoutDashboard, accent: 'action' },
  { label: 'Environmental',   href: '/environmental',   icon: Leaf,            accent: 'env'    },
  { label: 'Social',          href: '/social',          icon: Users,           accent: 'social' },
  { label: 'Governance',      href: '/governance',      icon: Shield,          accent: 'gov'    },
  { label: 'Gamification',    href: '/gamification',    icon: Trophy,          accent: 'gamif'  },
  { label: 'Reports',         href: '/reports',         icon: BarChart2,       accent: 'action' },
  { label: 'Settings',        href: '/settings',        icon: Settings,        accent: 'action' },
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

  return (
    <aside className="w-60 flex-shrink-0 h-full bg-bg border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-env flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-black text-base text-text-primary tracking-tight">EcoSphere</span>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-0.5 ml-9">ESG Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-3 mb-2">Navigation</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));
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

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-env-light flex items-center justify-center text-env font-bold text-xs">
            SK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">Sarah K.</p>
            <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
