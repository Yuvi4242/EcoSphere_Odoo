"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/hooks/use-auth";
import { SIDEBAR_MENU } from "@/constants/config";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

/**
 * Enterprise Navigation Sidebar.
 * Restricts rendering items depending on User RBAC roles and supports responsive states.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthUser();
  const { sidebarOpen } = useUiStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-300 z-30">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Icons.Leaf className="h-6 w-6 text-emerald-500 mr-2" />
        <span className="text-xl font-bold tracking-tight text-white">EcoSphere</span>
      </div>
      
      {/* Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {SIDEBAR_MENU.map((item) => {
          // If menu item specifies roles, check user role permissions
          if (item.roles && user && !item.roles.includes(user.role)) {
            return null;
          }

          // Dynamic lookup of Lucide Icons
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
          const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(`${item.path}/`));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-100"
              )}
            >
              <IconComponent
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold ring-1 ring-emerald-500/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 text-center">Not Signed In</div>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
