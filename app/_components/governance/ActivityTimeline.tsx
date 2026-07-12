'use client';

import React from 'react';
import { FileText, CheckCircle, ShieldAlert, Award, AlertCircle, Settings, ClipboardList, PenTool } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date | string;
  user?: { name: string | null; role: string } | null;
  entity: string;
  entityId: string;
}

// Helper to resolve Lucide Icon based on action string
function getActionIcon(action: string) {
  const norm = action.toLowerCase();
  if (norm.includes('policy')) {
    if (norm.includes('accept') || norm.includes('acknowledge')) {
      return { icon: CheckCircle, bg: 'bg-env-light text-env' };
    }
    if (norm.includes('create')) {
      return { icon: FileText, bg: 'bg-gov-light text-gov' };
    }
    return { icon: PenTool, bg: 'bg-blue-50 text-blue-600' };
  }
  if (norm.includes('audit')) {
    if (norm.includes('complete')) {
      return { icon: Award, bg: 'bg-env-light text-env' };
    }
    if (norm.includes('finding')) {
      return { icon: ShieldAlert, bg: 'bg-red-50 text-red-600' };
    }
    return { icon: ClipboardList, bg: 'bg-blue-50 text-blue-600' };
  }
  if (norm.includes('compliance')) {
    return { icon: CheckCircle, bg: 'bg-env-light text-env' };
  }
  if (norm.includes('risk')) {
    return { icon: AlertCircle, bg: 'bg-amber-50 text-amber-600' };
  }
  return { icon: Settings, bg: 'bg-[#f0f0ec] text-text-muted' };
}

export default function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Recent Governance Activities</p>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-muted">
          No recent activity logged.
        </div>
      ) : (
        <div className="relative pl-6 border-l border-border space-y-6 ml-2">
          {logs.map((log) => {
            const { icon: Icon, bg } = getActionIcon(log.action);
            return (
              <div key={log.id} className="relative">
                {/* Timeline Dot Icon */}
                <div
                  className={`absolute -left-[37px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface ${bg} shadow-sm`}
                >
                  <Icon size={13} />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-text-muted block">
                    {new Date(log.timestamp).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div className="text-sm font-semibold text-text-primary mt-0.5">
                    {log.action}
                  </div>
                  <div className="text-xs text-text-muted font-mono mt-0.5">
                    User: {log.user?.name || 'System'} ({log.user?.role || 'SYSTEM'}) · Entity: {log.entity} ID {log.entityId}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
