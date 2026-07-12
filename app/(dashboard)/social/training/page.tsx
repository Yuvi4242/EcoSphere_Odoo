import PageHeader from '@/app/_components/ui/PageHeader';
import StatCard from '@/app/_components/ui/StatCard';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import Badge from '@/app/_components/ui/Badge';
import { trainingModules } from '@/app/_lib/mock-data';
import { avg } from '@/app/_lib/utils';

const departments = ['Manufacturing', 'Engineering', 'Sales', 'Finance', 'HR', 'Logistics'];

export default function TrainingPage() {
  const allCompletions = trainingModules.flatMap(m => Object.values(m.deptProgress));
  const orgAvg = Math.round(avg(allCompletions));

  return (
    <div>
      <PageHeader
        eyebrow="Social · Training"
        title="Training Completion"
        subtitle="Module completion rates across departments — hover rows to see details"
        accentColor="social"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Org-wide Completion" value={`${orgAvg}%`} delta="+5% vs last quarter" deltaPositive dot="social" />
        <StatCard label="Modules Active" value={trainingModules.length} dot="social" />
        <StatCard label="Mandatory Modules" value={trainingModules.filter(m => m.type === 'Mandatory').length} dot="social" />
      </div>

      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">Module</th>
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">Type</th>
              {departments.map(d => (
                <th key={d} className="px-3 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">{d.slice(0, 4)}</th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">Avg</th>
            </tr>
          </thead>
          <tbody>
            {trainingModules.map(mod => {
              const vals = departments.map(d => mod.deptProgress[d as keyof typeof mod.deptProgress] ?? 0);
              const modAvg = Math.round(avg(vals));
              return (
                <tr key={mod.id} className="border-b border-border last:border-0 hover:bg-bg/40 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-text-primary">{mod.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={mod.type === 'Mandatory' ? 'mandatory' : 'optional'} label={mod.type} />
                  </td>
                  {vals.map((v, i) => (
                    <td key={departments[i]} className="px-3 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[52px]">
                        <ProgressBar value={v} color="social" height="sm" showLabel={false} />
                        <span className="text-[10px] font-mono text-text-muted">{v}%</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <span className={`font-mono font-bold text-sm ${modAvg >= 80 ? 'text-env' : modAvg >= 60 ? 'text-social' : 'text-red-500'}`}>
                      {modAvg}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
