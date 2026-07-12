'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { getNotifications, markNotificationRead, getUnreadNotificationCount } from '@/app/_actions/governance';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications with active lifecycle guards
  useEffect(() => {
    let active = true;

    const fetchNotifs = async () => {
      try {
        const list = await getNotifications();
        if (!active) return;
        setNotifications(list.slice(0, 5)); // show top 5 in dropdown

        const count = await getUnreadNotificationCount();
        if (!active) return;
        setUnreadCount(count);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifs();
    
    // Poll every 30 seconds for live notification check
    const t = setInterval(fetchNotifs, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      // Trigger a manual reload
      const list = await getNotifications();
      setNotifications(list.slice(0, 5));
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-primary bg-surface border border-border hover:border-border-strong rounded-xl transition-all shadow-sm"
        title="Toggle Notification Dropdown"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-surface animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
            <div className="px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="font-bold text-sm text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <div className="divide-y divide-border max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-muted">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition-colors flex gap-2.5 items-start ${
                      !n.isRead ? 'bg-bg/25' : 'hover:bg-bg/10'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{n.title}</p>
                      <p className="text-[11px] text-text-muted line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[9px] font-mono text-text-muted mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkRead(n.id, e)}
                        className="p-1 hover:bg-surface border border-border rounded text-env transition-colors"
                        title="Mark as read"
                      >
                        <Check size={10} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <Link
              href="/governance/notifications"
              onClick={() => setIsOpen(false)}
              className="p-3 border-t border-border text-center text-xs font-semibold text-gov hover:bg-bg/15 transition-all flex items-center justify-center gap-1 block"
            >
              Go to Notification Center <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
