import PageHeader from '@/app/_components/ui/PageHeader';
import DepartmentBarChart from '@/app/_components/charts/DepartmentBarChart';
import { departmentCarbon } from '@/app/_lib/mock-data';

export default function DepartmentTrackingPage() {
  const total = departmentCarbon.reduce((s, d) => s + d.tCO2e, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Environmental · Department Tracking"
        title="Department Carbon Tracking"
        subtitle="Comparing tCO2e across departments — orange indicates near or over threshold"
        accentColor="env"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">tCO2e by Department</p>
          <p className="text-sm text-text-muted mb-6">Q3 2025 — sorted highest to lowest</p>
          <DepartmentBarChart data={departmentCarbon} />
        </div>

        {/* Summary table */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Summary</p>
          <div className="flex flex-col gap-3">
            {[...departmentCarbon].sort((a, b) => b.tCO2e - a.tCO2e).map(d => {
              const pct = Math.round((d.tCO2e / total) * 100);
              const overThreshold = d.limit && d.tCO2e > d.limit * 0.9;
              return (
                <div key={d.department} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-primary">{d.department}</span>
                      <span className={`text-xs font-mono font-bold ${overThreshold ? 'text-social' : 'text-env'}`}>
                        {d.tCO2e}
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${overThreshold ? 'bg-social' : 'bg-env'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-text-muted font-mono w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Total</span>
              <span className="font-black text-text-primary">{total.toFixed(1)} tCO2e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
