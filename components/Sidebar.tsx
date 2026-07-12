'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Database,
  FileSpreadsheet,
  Target,
  BarChart3
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  subItems?: { name: string; href: string; icon: React.ComponentType<any> }[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [envOpen, setEnvOpen] = useState(true);

  const menuItems: SidebarItem[] = [
    {
      name: 'Overview Dashboard',
      href: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Environmental',
      icon: Leaf,
      subItems: [
        { name: 'Dashboard', href: '/environmental', icon: BarChart3 },
        { name: 'Emission Factors', href: '/environmental/emission-factors', icon: Database },
        { name: 'Carbon Transactions', href: '/environmental/transactions', icon: FileSpreadsheet },
        { name: 'Sustainability Goals', href: '/environmental/goals', icon: Target },
      ]
    },
    {
      name: 'Social (CSR)',
      href: '/social',
      icon: Users
    },
    {
      name: 'Governance',
      href: '/governance',
      icon: ShieldCheck
    },
    {
      name: 'Gamification',
      href: '/gamification',
      icon: Trophy
    },
    {
      name: 'Settings & Admin',
      href: '/settings',
      icon: Settings
    }
  ];

  const isSubItemActive = (href: string) => pathname === href;
  const isParentActive = (item: SidebarItem) => {
    if (item.href) return pathname === item.href;
    if (item.subItems) {
      return item.subItems.some(sub => pathname === sub.href);
    }
    return false;
  };

  return (
    <aside className="w-64 min-h-screen bg-background border-r border-border flex flex-col font-sans sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Leaf className="w-5 h-5 text-white font-bold" />
        </div>
        <div>
          <span className="font-bold text-lg text-foreground tracking-wide">EcoSphere</span>
          <span className="text-[10px] block text-muted-foreground font-mono -mt-1">ESG OPERATIONS</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const hasSubItems = !!item.subItems;
          const active = isParentActive(item);

          if (hasSubItems) {
            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => setEnvOpen(!envOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    active 
                      ? 'bg-card text-primary shadow-sm border border-border/50 font-semibold' 
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {envOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Sub Menu Items */}
                {envOpen && item.subItems && (
                  <div className="pl-6 space-y-1 mt-1 border-l border-border ml-5">
                    {item.subItems.map((sub, sIdx) => {
                      const subActive = isSubItemActive(sub.href);
                      return (
                        <Link
                          key={sIdx}
                          href={sub.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            subActive
                              ? 'bg-muted text-primary font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <sub.icon className="w-3.5 h-3.5" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={index}
              href={item.href || '#'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-card text-primary shadow-sm border border-border/50 font-semibold'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-background text-[11px] text-muted-foreground font-mono text-center">
        <span>v1.0.4 • ECOSPHERE ESG</span>
      </div>
    </aside>
  );
};
