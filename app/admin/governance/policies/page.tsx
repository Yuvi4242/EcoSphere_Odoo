'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Badge from '@/app/_components/ui/Badge';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import { policies, policyAcknowledgements } from '@/app/_lib/mock-data';

type Policy = typeof policies[number];

const columns: Column<Policy>[] = [
  { key: 'id',            label: 'ID',       render: v => <span className="font-mono text-xs text-gov">{String(v)}</span> },
  { key: 'name',          label: 'Policy',   sortable: true, render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'category',      label: 'Category', sortable: true },
  { key: 'version',       label: 'Version',  render: v => <span className="font-mono text-xs">{String(v)}</span> },
  { key: 'effectiveDate', label: 'Effective', sortable: true },
  { key: 'status',        label: 'Status',   render: v => <Badge variant={v === 'Active' ? 'active' : 'under-review'} label={String(v)} /> },
  { key: 'ackRate',       label: 'Ack. Rate', render: v => (
    <div className="flex items-center gap-2 min-w-[100px]">
      <ProgressBar value={Number(v)} color="gov" height="sm" showLabel={false} className="flex-1" />
      <span className="text-xs font-mono text-text-muted">{String(v)}%</span>
    </div>
  )},
];

const ackColumns: Column<Record<string, unknown>>[] = [
  { key: 'employee',   label: 'Employee', render: (v, row) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gov-light text-gov text-[10px] font-bold flex items-center justify-center">
        {String(row.initials)}
      </div>
      <span className="text-sm font-medium">{String(v)}</span>
    </div>
  )},
  { key: 'department', label: 'Department' },
  { key: 'status',     label: 'Status', render: v => <Badge variant={v === 'Acknowledged' ? 'acknowledged' : 'pending'} label={String(v)} /> },
  { key: 'date',       label: 'Date',   render: v => <span className="text-sm text-text-muted font-mono">{v ? String(v) : '—'}</span> },
];

export default function PoliciesPage() {
  const [selected, setSelected] = useState<Policy | null>(null);

  const acksRaw = selected ? (policyAcknowledgements as Record<string, typeof policyAcknowledgements['POL-14']>)[selected.id] ?? [] : [];
  const acks = acksRaw as unknown as Record<string, unknown>[];

  return (
    <div>
      <PageHeader
        eyebrow="Governance · ESG Policies"
        title="ESG Policies"
        subtitle="Policy registry with version history and employee acknowledgement tracking"
        accentColor="gov"
      />

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={policies as unknown as Record<string, unknown>[]}
        onRowClick={row => setSelected(row as unknown as Policy)}
        searchable
      />

      {/* Policy Detail */}
      {selected && (
        <div className="mt-6 bg-surface rounded-2xl border border-gov/20 card-shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-gov mb-1">{selected.id} · {selected.version}</p>
              <h3 className="text-xl font-bold text-text-primary">{selected.name}</h3>
              <p className="text-sm text-text-muted mt-1">Category: {selected.category} · Effective: {selected.effectiveDate}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-xs font-mono text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg hover:bg-bg transition-colors">
              Close ×
            </button>
          </div>
          <div className="mb-4 p-4 bg-gov-light/30 rounded-xl border border-gov/10">
            <p className="text-xs font-mono uppercase tracking-widest text-gov mb-2">Policy Description</p>
            <p className="text-sm text-text-primary">
              This policy establishes the organization&apos;s commitment to responsible {selected.category.toLowerCase()} management and provides a framework for all employees and stakeholders to follow. It is subject to annual review and must be acknowledged by all staff.
            </p>
          </div>
          {acks.length > 0 ? (
            <>
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">Employee Acknowledgements</p>
              <DataTable columns={ackColumns} data={acks} />
            </>
          ) : (
            <p className="text-sm text-text-muted italic">No acknowledgement data available for this policy.</p>
          )}
        </div>
      )}
    </div>
  );
}
