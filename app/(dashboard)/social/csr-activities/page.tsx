import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import StatCard from '@/app/_components/ui/StatCard';
import { csrActivities } from '@/app/_lib/mock-data';

export default function CsrActivitiesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Social · CSR Activities"
        title="CSR Activities"
        subtitle="Community, environmental, and employee wellbeing initiatives across the organization"
        actionLabel="+ New Activity"
        accentColor="social"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total YTD" value={22} dot="social" />
        <StatCard label="Budget Spent" value="€12,400" delta="67% of allocation" deltaPositive dot="social" />
        <StatCard label="Volunteers" value={189} delta="+24 this month" deltaPositive dot="social" />
      </div>
      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {['ID', 'Activity', 'Category', 'Date', 'Participants', 'Budget (€)', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csrActivities.map(a => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-bg/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs text-social">{a.id}</td>
                <td className="px-4 py-3.5 font-medium text-text-primary">{a.name}</td>
                <td className="px-4 py-3.5 text-text-muted">{a.category}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-text-muted">{a.date}</td>
                <td className="px-4 py-3.5 font-mono">{a.participants}</td>
                <td className="px-4 py-3.5 font-mono">{a.budget.toLocaleString() || '—'}</td>
                <td className="px-4 py-3.5">
                  <Badge
                    variant={a.status === 'Completed' ? 'completed' : a.status === 'Upcoming' ? 'upcoming' : 'pending'}
                    label={a.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
