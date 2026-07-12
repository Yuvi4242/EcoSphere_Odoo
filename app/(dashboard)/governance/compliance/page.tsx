'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Badge from '@/app/_components/ui/Badge';
import { complianceIssues } from '@/app/_lib/mock-data';
import { isOverdue } from '@/app/_lib/utils';

type Issue = typeof complianceIssues[number];

const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
const statuses   = ['All', 'Open', 'In Progress', 'Resolved'];

const columns: Column<Issue>[] = [
  { key: 'id',       label: 'ID',    render: v => <span className="font-mono text-xs text-gov">{String(v)}</span> },
  { key: 'issue',    label: 'Issue', sortable: true, render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'severity', label: 'Severity', render: v => <Badge variant={String(v).toLowerCase() as 'critical'|'high'|'medium'|'low'} label={String(v)} /> },
  { key: 'owner',    label: 'Owner', render: (v, row) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gov-light text-gov text-[10px] font-bold flex items-center justify-center">
        {(row as unknown as Issue).ownerInitials}
      </div>
      <span className="text-sm">{String(v)}</span>
    </div>
  )},
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'status',  label: 'Status', render: (v, row) => {
    const r = row as unknown as Issue;
    const over = r.status === 'Open' && isOverdue(r.dueDate);
    return (
      <div className="flex items-center gap-2">
        <Badge variant={String(v).toLowerCase().replace(' ', '') as 'open' | 'inprogress' | 'resolved'} label={String(v)} />
        {over && <Badge variant="overdue" label="Overdue" />}
      </div>
    );
  }},
];

export default function CompliancePage() {
  const [severity, setSeverity] = useState('All');
  const [status, setStatus]     = useState('All');

  const filtered = complianceIssues.filter(i =>
    (severity === 'All' || i.severity === severity) &&
    (status === 'All' || i.status === status)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Governance · Compliance Issues"
        title="Compliance Issues"
        subtitle="Open items, overdue flags, and resolved compliance actions"
        accentColor="gov"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 bg-surface rounded-2xl border border-border p-4">
        <select id="severity-filter" value={severity} onChange={e => setSeverity(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-gov bg-bg">
          {severities.map(s => <option key={s}>{s}</option>)}
        </select>
        <select id="status-filter" value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-gov bg-bg">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => { setSeverity('All'); setStatus('All'); }} className="px-3 py-2 text-xs font-mono text-text-muted hover:text-text-primary rounded-xl hover:bg-bg transition-colors">
          Clear
        </button>
      </div>

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={filtered as unknown as Record<string, unknown>[]}
        searchable
      />
    </div>
  );
}
