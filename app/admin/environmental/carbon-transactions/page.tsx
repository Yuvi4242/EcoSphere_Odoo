'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Badge from '@/app/_components/ui/Badge';
import Modal from '@/app/_components/ui/Modal';
import { carbonTransactions } from '@/app/_lib/mock-data';

type Transaction = typeof carbonTransactions[number];

const columns: Column<Transaction>[] = [
  { key: 'id',         label: 'ID',         render: v => <span className="font-mono text-xs text-text-muted">{String(v)}</span> },
  { key: 'date',       label: 'Date',       sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'source',     label: 'Source',     sortable: true },
  { key: 'amount',     label: 'Amount (tCO2e)', sortable: true, render: v => <span className="font-mono font-semibold">{String(v)}</span> },
  { key: 'origin',     label: 'Origin',     render: v => (
      <Badge variant={String(v).toLowerCase() === 'auto' ? 'auto' : 'manual'} label={String(v)} />
    )
  },
];

const departments = ['All', 'Manufacturing', 'Logistics', 'Finance', 'Engineering', 'HR', 'Sales'];
const sources = ['All', 'Purchase', 'Manufacturing', 'Expense', 'Fleet'];

export default function CarbonTransactionsPage() {
  const [dept, setDept] = useState('All');
  const [source, setSource] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ date: '', department: '', source: '', amount: '', notes: '' });

  const filtered = carbonTransactions.filter(t =>
    (dept === 'All' || t.department === dept) &&
    (source === 'All' || t.source === source) &&
    (!dateFrom || t.date >= dateFrom) &&
    (!dateTo || t.date <= dateTo)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Environmental · Carbon Transactions"
        title="Carbon Transactions"
        subtitle="All emission events — automatic from ERP integration and manual entries"
        actionLabel="+ Log Emission"
        onAction={() => setLogOpen(true)}
        accentColor="env"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 bg-surface rounded-2xl border border-border p-4">
        <select id="dept-filter" value={dept} onChange={e => setDept(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select id="source-filter" value={source} onChange={e => setSource(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg">
          {sources.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input id="date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg" />
          <span className="text-text-muted text-xs font-mono">to</span>
          <input id="date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-bg" />
        </div>
        <button onClick={() => { setDept('All'); setSource('All'); setDateFrom(''); setDateTo(''); }} className="px-3 py-2 text-xs font-mono text-text-muted hover:text-text-primary rounded-xl hover:bg-bg transition-colors">
          Clear
        </button>
      </div>

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={filtered as unknown as Record<string, unknown>[]}
        searchable={false}
      />

      <Modal open={logOpen} onClose={() => setLogOpen(false)} title="Log Manual Emission">
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); setLogOpen(false); }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="log-date">Date</label>
              <input id="log-date" type="date" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="log-dept">Department</label>
              <select id="log-dept" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-surface" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required>
                <option value="">Select…</option>
                {departments.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="log-source">Source</label>
              <select id="log-source" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-surface" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} required>
                <option value="">Select…</option>
                {sources.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="log-amount">Amount (tCO2e)</label>
              <input id="log-amount" type="number" step="0.01" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="log-notes">Notes (optional)</label>
            <textarea id="log-notes" rows={2} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env resize-none" placeholder="Describe the emission source…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setLogOpen(false)} className="flex-1 py-2.5 rounded-full border border-border text-sm font-medium text-text-muted hover:bg-bg transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-full bg-env text-white text-sm font-semibold hover:bg-[#147a45] transition-colors">Log Emission</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
