'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Badge from '@/app/_components/ui/Badge';
import { audits, auditFindings } from '@/app/_lib/mock-data';

type Audit = typeof audits[number];

const columns: Column<Audit>[] = [
  { key: 'id',           label: 'ID',         render: v => <span className="font-mono text-xs text-gov">{String(v)}</span> },
  { key: 'name',         label: 'Audit Name', sortable: true, render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'department',   label: 'Department', sortable: true },
  { key: 'date',         label: 'Date',       sortable: true },
  { key: 'status',       label: 'Status',     render: v => <Badge variant={String(v).toLowerCase() as 'passed' | 'failed' | 'scheduled'} label={String(v)} /> },
  { key: 'linkedIssues', label: 'Linked Issues', render: v => (
    <span className={`font-mono font-bold ${Number(v) > 0 ? 'text-social' : 'text-text-muted'}`}>{String(v)}</span>
  )},
];

export default function AuditsPage() {
  const [selected, setSelected] = useState<Audit | null>(null);

  const findings = selected ? (auditFindings as Record<string, typeof auditFindings['AUD-014']>)[selected.id] ?? [] : [];

  return (
    <div>
      <PageHeader
        eyebrow="Governance · Audits"
        title="Audit Log"
        subtitle="All scheduled, completed, and failed audits — click a row to view findings"
        accentColor="gov"
      />

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={audits as unknown as Record<string, unknown>[]}
        onRowClick={row => setSelected(row as unknown as Audit)}
        searchable
      />

      {/* Audit Detail Panel */}
      {selected && (
        <div className="mt-6 bg-surface rounded-2xl border border-gov/20 card-shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-gov mb-1">{selected.id}</p>
              <h3 className="text-lg font-bold text-text-primary">{selected.name}</h3>
              <p className="text-sm text-text-muted font-mono">{selected.department} · {selected.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={selected.status.toLowerCase() as 'passed' | 'failed' | 'scheduled'} label={selected.status} />
              <button onClick={() => setSelected(null)} className="text-xs font-mono text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg hover:bg-bg transition-colors">
                Close ×
              </button>
            </div>
          </div>
          {findings.length === 0 ? (
            <p className="text-sm text-text-muted italic">No findings recorded for this audit.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {findings.map(f => (
                <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <span className="font-mono text-xs text-text-muted w-14">{f.id}</span>
                  <span className="flex-1 text-sm text-text-primary">{f.title}</span>
                  <Badge variant={f.severity.toLowerCase() as 'critical' | 'high' | 'medium' | 'low'} label={f.severity} />
                  <Badge variant={f.status.toLowerCase() as 'open' | 'resolved'} label={f.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
