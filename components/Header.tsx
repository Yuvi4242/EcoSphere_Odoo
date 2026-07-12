'use client';

import React, { useState } from 'react';
import { useESG } from '../context/ESGContext';
import { 
  Bell, 
  Award, 
  Trophy, 
  User, 
  Check, 
  Trash2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    resetAllData 
  } = useESG();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all EcoSphere data to default? This will clear all changes.')) {
      resetAllData();
      window.location.reload();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'compliance':
        return 'border-red-500/30 bg-red-50 text-red-500';
      case 'badge':
        return 'border-yellow-500/30 bg-yellow-50 text-yellow-500';
      case 'goal':
        return 'border-emerald-500/30 bg-emerald-50 text-emerald-500';
      case 'approval':
        return 'border-blue-500/30 bg-blue-50 text-blue-500';
      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Search / Context Info */}
      <div className="flex items-center gap-4">
        <h2 className="text-muted-foreground text-xs font-mono tracking-widest uppercase">
          OPERATIONAL COMMAND
        </h2>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-6">
        
        {/* Reset Mock Data */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted hover:bg-red-50 hover:text-red-500 border border-border hover:border-red-200 rounded-lg text-xs font-medium text-muted-foreground transition-all cursor-pointer"
          title="Reset to default mock data"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Data</span>
        </button>

        {/* Gamification Stats */}
        <div className="flex items-center gap-4 bg-muted border border-border rounded-full px-4 py-1.5 shadow-sm">
          {/* Level */}
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Lvl</span>
            <span className="text-sm font-bold text-foreground">{currentUser.level}</span>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-border"></div>

          {/* XP / Points */}
          <div className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-medium text-muted-foreground">XP</span>
            <span className="text-sm font-bold text-yellow-500">{currentUser.points}</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border"></div>

          {/* Badges unlocked */}
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Badges</span>
            <span className="text-sm font-bold text-primary">
              {currentUser.badges.length}
            </span>
          </div>
        </div>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full border border-border bg-muted hover:bg-muted/80 hover:text-foreground text-muted-foreground transition-all relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border border-background rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col animate-fade-in">
              <div className="p-3.5 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Notifications ({unreadCount} new)</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] flex items-center gap-1 text-muted-foreground hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-border flex-1 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 transition-colors ${
                        notif.read ? 'bg-muted/30' : 'bg-muted/80'
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${getNotificationIcon(notif.type)}`}>
                          {notif.type[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                            {!notif.read && (
                              <button
                                onClick={() => markNotificationRead(notif.id)}
                                className="text-primary hover:text-emerald-700 shrink-0 cursor-pointer"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[9px] text-muted-foreground block mt-1 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            SJ
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-foreground">{currentUser.name}</p>
            <p className="text-[10px] text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>

      </div>
    </header>
  );
};
