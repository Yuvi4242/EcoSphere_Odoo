'use client';

import React, { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import { AuditCard, AuditTimeline } from '@/app/_components/governance/AuditComponents';
import { Search, Plus, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface Audit {
  id: string;
  title: string;
  departmentId: string;
  department?: { id: string; name: string } | null;
  auditorId: string;
  auditor?: { name: string | null; email: string | null } | null;
  auditDate: Date;
  status: string;
  riskLevel: string;
  overallScore?: number | null;
  recommendation?: string | null;
  summary?: string | null;
}

interface Department {
  id: string;
  name: string;
}

export default function AuditsClient({
  initialAudits,
  departments,
  userRole
}: {
  initialAudits: Audit[];
  departments: Department[];
  userRole: string;
}) {
  const audits = initialAudits;
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const canSchedule = userRole === 'ADMIN' || userRole === 'MANAGER';

  // Client-side search and filters
  const filtered = audits.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? a.departmentId === deptFilter : true;
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Governance"
          title="Internal Audits Registry"
          subtitle="Plan site audits, assign external or internal auditors, and track checklist compliance and logs"
          accentColor="gov"
        />

        {canSchedule && (
          <Link
            href="/governance/audits/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gov hover:bg-[#19273c] text-white rounded-xl text-xs font-semibold shadow-sm self-start sm:self-center transition-colors"
          >
            <Plus size={14} /> Schedule Audit
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search audits by title or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-bg/25 text-sm focus:outline-none focus:border-border-strong"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-2 border border-border rounded-xl text-xs focus:outline-none bg-surface text-text-primary"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-border rounded-xl text-xs focus:outline-none bg-surface text-text-primary"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Grid of Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 p-12 text-center bg-surface border border-border rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <ShieldAlert size={36} className="text-text-muted opacity-50" />
              <span className="text-sm font-semibold text-text-muted">No audits found matching current filters.</span>
            </div>
          </div>
        ) : (
          filtered.map((a) => <AuditCard key={a.id} audit={a} />)
        )}
      </div>

      {/* Visual Timeline Section */}
      <AuditTimeline audits={filtered} />
    </div>
  );
}
