'use client';

import { Calendar, User, ClipboardList, Award, ArrowRight, Flame } from 'lucide-react';
import { StatusBadge } from './BadgeHelpers';
import { formatDate } from '@/app/_lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AuditItem {
  id: string;
  title: string;
  riskLevel: string;
  status: string;
  auditor?: { name: string | null } | null;
  auditDate: Date | string;
  overallScore?: number | null;
  findings?: Array<{ status: string }>;
  department?: { name: string } | null;
}

// ==========================================
// AUDIT CARD
// ==========================================

export function AuditCard({ audit }: { audit: AuditItem }) {
  const openFindings = audit.findings?.filter((f) => f.status === 'Open').length || 0;
  const resolvedFindings = audit.findings?.filter((f) => f.status === 'Resolved').length || 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between hover:border-border-strong transition-all"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1">
            <Flame size={13} className="text-text-muted" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              {audit.riskLevel} Risk Audit
            </span>
          </div>
          <StatusBadge status={audit.status} />
        </div>

        <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-1">{audit.title}</h4>
        
        {/* Department / Auditor Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <User size={13} />
            <span>Auditor: <strong className="text-text-primary">{audit.auditor?.name || 'Unassigned'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar size={13} />
            <span>Date: <strong className="text-text-primary">{formatDate(new Date(audit.auditDate).toISOString())}</strong></span>
          </div>
        </div>

        {/* Audit Score / Findings Summary */}
        {audit.status === 'Completed' ? (
          <div className="bg-bg/25 border border-border rounded-xl p-3 mb-2 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase text-text-muted block">Audit Score</span>
              <span className="text-sm font-bold text-env">{audit.overallScore}% Passed</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono uppercase text-text-muted block">Findings Logged</span>
              <span className="text-xs text-text-muted font-semibold">{resolvedFindings} Resolved</span>
            </div>
          </div>
        ) : (
          <div className="bg-bg/10 rounded-xl p-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <ClipboardList size={13} className="text-gov" /> Checked findings
            </span>
            <span className="text-xs font-mono font-bold text-red-500">
              {openFindings} Open
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border mt-4">
        <Link
          href={`/governance/audits/${audit.id}`}
          className="text-xs font-bold text-gov hover:text-[#19273c] flex items-center gap-1 group transition-colors"
        >
          Manage checklist & findings <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

// ==========================================
// AUDIT TIMELINE
// ==========================================

export function AuditTimeline({ audits }: { audits: AuditItem[] }) {
  // Sort audits chronologically
  const sortedAudits = [...audits].sort(
    (a, b) => new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime()
  );

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
      <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Internal Audit Schedule Timeline</p>

      {sortedAudits.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-muted">
          No audits currently scheduled or run.
        </div>
      ) : (
        <div className="relative pl-6 border-l border-border space-y-6 ml-2">
          {sortedAudits.map((a) => {
            const isCompleted = a.status === 'Completed';
            const isRunning = a.status === 'In Progress' || a.status === 'Running';
            const isCancelled = a.status === 'Cancelled';

            return (
              <div key={a.id} className="relative">
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-env border-env'
                      : isRunning
                      ? 'bg-amber-500 border-amber-500'
                      : isCancelled
                      ? 'bg-border border-border-strong'
                      : 'bg-white border-gov'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      {formatDate(new Date(a.auditDate).toISOString())} · {a.department?.name || 'Corporate'}
                    </span>
                    <h5 className="text-sm font-bold text-text-primary hover:underline">
                      <Link href={`/governance/audits/${a.id}`}>{a.title}</Link>
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Auditor: {a.auditor?.name}</span>
                    <StatusBadge status={a.status} />
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
