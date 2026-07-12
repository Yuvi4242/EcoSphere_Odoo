'use client';

import StatCard from '@/app/_components/ui/StatCard';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Badge from '@/app/_components/ui/Badge';
import { audits } from '@/app/_lib/mock-data';

type Audit = typeof audits[number];
const columns: Column<Audit>[] = [
  { key: 'id',           label: 'ID',     render: v => <span className="font-mono text-xs text-gov">{String(v)}</span> },
  { key: 'name',         label: 'Audit',  sortable: true, render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'department',   label: 'Dept',   sortable: true },
  { key: 'date',         label: 'Date',   sortable: true },
  { key: 'status',       label: 'Status', render: v => <Badge variant={String(v).toLowerCase() as 'passed'|'failed'|'scheduled'} label={String(v)} /> },
  { key: 'linkedIssues', label: 'Issues', render: v => <span className={`font-mono font-bold ${Number(v) > 0 ? 'text-social' : 'text-text-muted'}`}>{String(v)}</span> },
];

export default function GovernanceReportPage() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Audit Pass Rate" value="67%" delta="4 of 6 audits passed" deltaPositive dot="gov" />
        <StatCard label="Open Issues" value={5} delta="2 critical" deltaPositive={false} dot="gov" />
        <StatCard label="Policy Ack. Rate" value="88%" dot="gov" />
      </div>
      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={audits as unknown as Record<string, unknown>[]}
        searchable
      />
    </div>
  );
}
