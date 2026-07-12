'use client';

import StatCard from '@/app/_components/ui/StatCard';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import { emissionsData, carbonTransactions } from '@/app/_lib/mock-data';

type TxRow = typeof carbonTransactions[number];
const columns: Column<TxRow>[] = [
  { key: 'id',         label: 'ID',         render: v => <span className="font-mono text-xs text-text-muted">{String(v)}</span> },
  { key: 'date',       label: 'Date',       sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'source',     label: 'Source',     sortable: true },
  { key: 'amount',     label: 'Amount (tCO2e)', sortable: true, render: v => <span className="font-mono">{String(v)}</span> },
  { key: 'origin',     label: 'Origin' },
];

export default function EnvReportPage() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Emissions YTD" value="4,281" unit="tCO2e" delta="-8.3% vs prior year" deltaPositive dot="env" />
        <StatCard label="Renewable Energy" value="63%" delta="+12% YoY" deltaPositive dot="env" />
        <StatCard label="Goals on Track" value="3 / 4" dot="env" />
      </div>
      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={carbonTransactions as unknown as Record<string, unknown>[]}
        searchable
      />
    </div>
  );
}
