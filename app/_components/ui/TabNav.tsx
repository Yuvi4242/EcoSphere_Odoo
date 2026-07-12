'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/_lib/utils';

export interface Tab {
  label: string;
  href: string;
}

interface TabNavProps {
  tabs: Tab[];
  accentColor?: 'env' | 'social' | 'gov' | 'gamif' | 'action';
  className?: string;
}

const accentBorder: Record<string, string> = {
  env:    'border-env text-env',
  social: 'border-social text-social',
  gov:    'border-gov text-gov',
  gamif:  'border-gamif text-gamif',
  action: 'border-action text-text-primary',
};

export default function TabNav({ tabs, accentColor = 'action', className }: TabNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex border-b border-border mb-8 -mt-2 overflow-x-auto', className)}>
      {tabs.map(tab => {
        // Exact match for first tab (index route), prefix match for sub-routes
        const isActive =
          pathname === tab.href ||
          (tab.href !== tabs[0].href && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
              isActive
                ? accentBorder[accentColor]
                : 'border-transparent text-text-muted hover:text-text-primary'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
