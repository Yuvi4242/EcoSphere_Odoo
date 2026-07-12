'use client';

import { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import DataTable, { Column } from '@/app/_components/ui/DataTable';
import Modal from '@/app/_components/ui/Modal';
import { emissionFactors } from '@/app/_lib/mock-data';

type Factor = typeof emissionFactors[number];

const columns: Column<Factor>[] = [
  { key: 'id',          label: 'ID',           sortable: true,  render: v => <span className="font-mono text-xs text-text-muted">{String(v)}</span> },
  { key: 'name',        label: 'Name',         sortable: true,  render: v => <span className="font-medium">{String(v)}</span> },
  { key: 'category',    label: 'Category',     sortable: true },
  { key: 'value',       label: 'Value',        sortable: true,  render: v => <span className="font-mono">{String(v)}</span> },
  { key: 'unit',        label: 'Unit',         render: v => <span className="text-text-muted text-xs font-mono">{String(v)}</span> },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true,  render: v => <span className="text-text-muted text-xs">{String(v)}</span> },
];

const categories = ['Energy', 'Fleet', 'Travel', 'Refrigerants', 'Materials', 'Waste'];

export default function EmissionFactorsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', value: '', unit: '' });

  return (
    <div>
      <PageHeader
        eyebrow="Environmental · Emission Factors"
        title="Emission Factors"
        subtitle="Reference coefficients used to convert activity data into carbon equivalents"
        actionLabel="+ New Factor"
        onAction={() => setModalOpen(true)}
        accentColor="env"
      />

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={emissionFactors as unknown as Record<string, unknown>[]}
        searchable
        searchPlaceholder="Search factors…"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Emission Factor">
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); setModalOpen(false); }}>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="ef-name">Factor Name</label>
            <input id="ef-name" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env" placeholder="e.g. Diesel — Road Transport" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="ef-category">Category</label>
            <select id="ef-category" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env bg-surface" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
              <option value="">Select category…</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="ef-value">Value</label>
              <input id="ef-value" type="number" step="any" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env" placeholder="0.000" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-1.5" htmlFor="ef-unit">Unit</label>
              <input id="ef-unit" className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-env" placeholder="kgCO2e/kWh" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-full border border-border text-sm font-medium text-text-muted hover:bg-bg transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-full bg-env text-white text-sm font-semibold hover:bg-[#147a45] transition-colors">Save Factor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
