'use client';

import React, { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import { useToast } from '@/app/_components/ui/Toast';
import { markNotificationRead, deleteNotification } from '@/app/_actions/governance';
import { formatDate } from '@/app/_lib/utils';
import { Bell, Check, Trash2, ShieldAlert, FileText, ClipboardList, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to resolve icon based on notification type
function getNotifIcon(type: string) {
  const norm = type.toLowerCase();
  if (norm === 'policy') return { icon: FileText, color: 'text-blue-500 bg-blue-50' };
  if (norm === 'audit') return { icon: ClipboardList, color: 'text-env bg-env-light' };
  if (norm === 'compliance') return { icon: ShieldAlert, color: 'text-red-600 bg-red-50' };
  if (norm === 'risk') return { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' };
  return { icon: Info, color: 'text-text-muted bg-[#f0f0ec]' };
}

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationsClient({
  initialNotifications
}: {
  initialNotifications: NotificationItem[];
}) {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unread = notifications.filter(n => !n.isRead);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      showToast('Notification marked read.');
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      showToast('Failed to mark read.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      showToast('Notification deleted.');
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
      showToast('Failed to delete notification.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      for (const n of unread) {
        await markNotificationRead(n.id);
      }
      showToast('All notifications marked read.');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      showToast('Failed to complete action.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Alert Center"
          title="Governance Notifications"
          subtitle="System warnings, policy requests, audit checklist tasks, and compliance alerts"
          accentColor="gov"
        />

        {unread.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 bg-surface hover:bg-bg/40 border border-border rounded-xl text-xs font-semibold text-text-primary shadow-sm self-start sm:self-center transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-2xl card-shadow divide-y divide-border overflow-hidden">
        <div className="px-5 py-4 bg-bg/10 flex justify-between items-center text-xs font-mono font-bold uppercase text-text-muted">
          <span>Alert Logs</span>
          <span>{unread.length} Unread</span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-muted">
            <div className="flex flex-col items-center gap-2">
              <Bell size={36} className="text-text-muted opacity-40 animate-pulse" />
              <span>You are fully caught up! No recent notifications.</span>
            </div>
          </div>
        ) : (
          notifications.map((n) => {
            const { icon: Icon, color } = getNotifIcon(n.type);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 flex gap-4 items-start transition-all ${
                  !n.isRead ? 'bg-bg/25 border-l-4 border-gov' : 'border-l-4 border-transparent'
                }`}
              >
                {/* Type Icon */}
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-text-primary">{n.title}</h4>
                    <span className="text-[10px] font-mono text-text-muted">
                      {formatDate(n.createdAt.toISOString())}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mt-1.5">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-center flex-shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 bg-surface hover:bg-bg border border-border hover:border-border-strong text-env rounded-lg transition-all"
                      title="Mark as read"
                    >
                      <Check size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 bg-surface hover:bg-red-50 border border-border hover:border-red-200 text-red-600 rounded-lg transition-all"
                    title="Delete alert"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
