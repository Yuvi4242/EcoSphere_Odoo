'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/app/_lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No records found.',
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    let rows = [...data];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, query, sortKey, sortAsc]);

  return (
    <div className={cn('bg-surface rounded-2xl border border-border card-shadow overflow-hidden', className)}>
      {searchable && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="datatable-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm bg-bg border border-border rounded-xl outline-none focus:border-border-strong placeholder:text-text-muted"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted',
                    col.sortable && 'cursor-pointer select-none hover:text-text-primary',
                    col.className
                  )}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          size={10}
                          className={cn(sortKey === String(col.key) && sortAsc ? 'text-text-primary' : 'opacity-30')}
                        />
                        <ChevronDown
                          size={10}
                          className={cn(sortKey === String(col.key) && !sortAsc ? 'text-text-primary' : 'opacity-30')}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border last:border-0',
                    onRowClick && 'cursor-pointer hover:bg-bg/50 active:bg-border/50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => {
                    const val = row[col.key as string];
                    return (
                      <td key={String(col.key)} className={cn('px-4 py-3.5 text-text-primary', col.className)}>
                        {col.render ? col.render(val, row) : String(val ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-bg/40 flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-text-muted hover:text-text-primary font-mono">
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
