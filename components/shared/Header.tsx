"use client";

import React from "react";
import * as Icons from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth";
import { useUiStore } from "@/store";
import { logoutAction } from "@/actions/auth";

/**
 * Top Header Control Panel.
 * Includes sidebar toggle, gamification (XP/Level progress tracker), and secure logout action.
 */
export function Header() {
  const { user, logout } = useAuthUser();
  const { toggleSidebar, notificationsOpen, setNotificationsOpen } = useUiStore();

  const handleLogout = async () => {
    await logoutAction();
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 px-6 flex items-center justify-between z-20">
      {/* Sidebar toggle & title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Icons.Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">EcoSphere ESG Management Platform</h1>
      </div>

      {/* Gamification tracker, notifications and profiles */}
      <div className="flex items-center space-x-6">
        
        {/* Gamification level status */}
        {user && (
          <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-1.5">
            <Icons.Award className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-emerald-800">Level {user.level}</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-24 bg-emerald-250 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-650 h-full transition-all duration-300"
                    style={{ width: `${user.xp % 100}%` }}
                  />
                </div>
                <span className="text-slate-500 text-[10px] font-medium">{user.xp % 100}/100 XP</span>
              </div>
            </div>
          </div>
        )}

        {/* Notification bell */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative text-slate-500 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Open notifications drawer"
        >
          <Icons.Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
        </button>

        {/* User logout action */}
        <button
          onClick={handleLogout}
          className="flex items-center text-slate-650 hover:text-rose-650 transition-colors text-sm font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-rose-50/50"
        >
          <Icons.LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
export default Header;
