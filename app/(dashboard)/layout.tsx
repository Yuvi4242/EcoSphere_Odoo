"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { formatDate } from "@/utils/formatters";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "Info" | "Alert" | "Achievement";
  isRead: boolean;
  createdAt: string;
}

/**
 * Main Layout for protected dashboard pages.
 * Handles Sidebar toggle transitions and slide-out notifications panel drawer.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { notificationsOpen, setNotificationsOpen } = useUiStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.error("Error loading notifications:", e);
    }
  };

  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen]);

  const markAllRead = async () => {
    try {
      await api.patch("/notifications", {});
      fetchNotifications();
    } catch (e) {
      console.error("Failed to mark notifications read:", e);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation Drawer */}
      <Sidebar />

      {/* Main content body wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Dashboard Header controls */}
        <Header />
        
        {/* Render child dashboard pages */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {children}
        </main>
      </div>

      {/* Right Notifications Drawer Panel */}
      {notificationsOpen && (
        <>
          {/* Overlay background */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 transition-opacity" 
            onClick={() => setNotificationsOpen(false)}
          />
          
          {/* Notification Sidebar */}
          <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-250">
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-emerald-600 hover:text-emerald-500 font-bold cursor-pointer"
                >
                  Mark All Read
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-655 p-1 rounded hover:bg-slate-100 transition-colors text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* Notification List items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={cn(
                      "p-3 border rounded-lg text-xs transition-colors",
                      !notif.isRead && "bg-slate-50/80 border-slate-200 font-medium",
                      notif.isRead && "bg-white border-slate-100 text-slate-400",
                      notif.type === "Alert" && "border-rose-100 bg-rose-50/20",
                      notif.type === "Achievement" && "border-amber-100 bg-amber-50/20"
                    )}
                  >
                    <p className={cn(
                      "font-semibold",
                      notif.type === "Alert" && "text-rose-700",
                      notif.type === "Achievement" && "text-amber-700",
                      notif.type === "Info" && "text-slate-850"
                    )}>{notif.title}</p>
                    <p className="mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[9px] text-slate-405 block mt-2">{formatDate(notif.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

