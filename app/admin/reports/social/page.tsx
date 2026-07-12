'use client';

import StatCard from '@/app/_components/ui/StatCard';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import { csrActivities } from '@/app/_lib/mock-data';

type CSR = typeof csrActivities[number];
const columns: Column<CSR>[] = [
  { key: 'id',           label: 'ID',           render: v => <span className="font-mono text-xs text-text-muted">{String(v)}</span> },
  { key: 'name',         label: 'Activity',     sortable: true, render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'category',     label: 'Category',     sortable: true },
  { key: 'date',         label: 'Date',         sortable: true },
  { key: 'participants', label: 'Participants',  sortable: true },
  { key: 'status',       label: 'Status' },
];

export default function SocialReportPage() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="CSR Activities YTD" value={22} dot="social" />
        <StatCard label="Volunteers Engaged" value={189} delta="+24 this month" deltaPositive dot="social" />
        <StatCard label="Training Completion" value="78%" delta="+5% vs target" deltaPositive dot="social" />
      </div>
      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={csrActivities as unknown as Record<string, unknown>[]}
        searchable
      />
    </div>
  );
}
