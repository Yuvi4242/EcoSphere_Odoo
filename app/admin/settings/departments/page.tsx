import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { departments } from '@/app/_lib/mock-data';

const topLevel = departments.filter(d => !d.parent);
const children = departments.filter(d => d.parent);

export default function DepartmentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings · Departments"
        title="Departments"
        subtitle="Organizational hierarchy — child departments are shown indented under their parent"
        actionLabel="+ Add Department"
        accentColor="neutral"
      />

      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {['Name', 'Code', 'Head', 'Employees', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topLevel.map(dept => {
              const subs = children.filter(c => c.parent === dept.id);
              return (
                <>
                  <tr key={dept.id} className="border-b border-border hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-text-primary">{dept.name}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-text-muted">{dept.code}</td>
                    <td className="px-4 py-3.5">{dept.head}</td>
                    <td className="px-4 py-3.5 font-mono">{dept.employees}</td>
                    <td className="px-4 py-3.5"><Badge variant={dept.status.toLowerCase() as 'active' | 'inactive'} label={dept.status} /></td>
                  </tr>
                  {subs.map(sub => (
                    <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-bg/30 transition-colors bg-bg/20">
                      <td className="px-4 py-3 pl-10 text-text-muted flex items-center gap-2">
                        <span className="text-border-strong">↳</span>
                        <span>{sub.name}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">{sub.code}</td>
                      <td className="px-4 py-3 text-text-muted">{sub.head}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">{sub.employees}</td>
                      <td className="px-4 py-3"><Badge variant="active" label="Active" /></td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
