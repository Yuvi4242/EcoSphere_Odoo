'use client';

import { useState, useMemo } from 'react';
import { useToast } from '@/app/_components/ui/Toast';
import { carbonTransactions } from '@/app/_lib/mock-data';
import { FileDown } from 'lucide-react';

const departments = ['All', 'Manufacturing', 'Logistics', 'Finance', 'Engineering', 'HR', 'Sales'];
const modules = ['All', 'Environmental', 'Social', 'Governance'];
const sources = ['All', 'Purchase', 'Manufacturing', 'Expense', 'Fleet'];

export default function CustomReportPage() {
  const { showToast } = useToast();
  const [dept, setDept] = useState('All');
  const [module, setModule] = useState('All');
  const [source, setSource] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() =>
    carbonTransactions.filter(t =>
      (dept === 'All' || t.department === dept) &&
      (source === 'All' || t.source === source) &&
      (!dateFrom || t.date >= dateFrom) &&
      (!dateTo || t.date <= dateTo)
    ), [dept, source, dateFrom, dateTo]
  );

  return (
    <div className="flex gap-6 h-full">
      {/* Filter panel */}
      <div className="w-60 flex-shrink-0 bg-surface border border-border rounded-2xl card-shadow p-5 h-fit">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Filters</p>
        <div className="flex flex-col gap-3">
          {[
            { id: 'cb-module', label: 'Module', value: module, options: modules, set: setModule },
            { id: 'cb-dept', label: 'Department', value: dept, options: departments, set: setDept },
            { id: 'cb-source', label: 'Source', value: source, options: sources, set: setSource },
          ].map(f => (
            <div key={f.id}>
              <label className="block text-xs font-mono text-text-muted mb-1" htmlFor={f.id}>{f.label}</label>
              <select id={f.id} value={f.value} onChange={e => f.set(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-border-strong bg-bg">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1" htmlFor="cb-date-from">From Date</label>
            <input id="cb-date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-border-strong bg-bg" />
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted mb-1" htmlFor="cb-date-to">To Date</label>
            <input id="cb-date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:border-border-strong bg-bg" />
          </div>
          <button onClick={() => { setDept('All'); setModule('All'); setSource('All'); setDateFrom(''); setDateTo(''); }} className="w-full py-2 text-xs font-mono text-text-muted hover:text-text-primary rounded-xl border border-border hover:bg-bg transition-colors">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-text-primary">Preview ({filtered.length} records)</p>
          <div className="flex gap-2">
            {(['PDF', 'Excel', 'CSV'] as const).map(fmt => (
              <button
                key={fmt}
                id={`export-${fmt.toLowerCase()}`}
                onClick={() => showToast(`${fmt} export started successfully.`, 'success')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs font-mono text-text-muted hover:bg-bg hover:text-text-primary transition-colors"
              >
                <FileDown size={12} />
                {fmt}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border card-shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg/60">
                {['ID', 'Date', 'Department', 'Source', 'Amount (tCO2e)', 'Origin'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-bg/30">
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.department}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{row.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${row.origin === 'Auto' ? 'bg-env-light text-env' : 'bg-border text-text-muted'}`}>
                      {row.origin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
