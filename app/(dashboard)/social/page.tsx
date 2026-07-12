import StatCard from '@/app/_components/ui/StatCard';
import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { csrActivities } from '@/app/_lib/mock-data';

export default function SocialPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Social"
        title="Social Overview"
        subtitle="CSR activities, employee wellbeing, training, and community engagement metrics"
        accentColor="social"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="CSR Activities" value={22} delta="+4 this quarter" deltaPositive dot="social" />
        <StatCard label="Volunteers Engaged" value={189} delta="+24 this month" deltaPositive dot="social" />
        <StatCard label="Training Completion" value="78%" delta="+5% vs target" deltaPositive dot="social" />
        <StatCard label="Diversity Score" value={81} unit="/ 100" dot="social" />
      </div>

      <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted">CSR Activities</p>
          <button className="px-4 py-1.5 rounded-full bg-social text-white text-xs font-semibold hover:bg-[#cc7133] transition-colors">
            + New Activity
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {csrActivities.map(a => (
            <div key={a.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
              <div>
                <p className="text-[10px] font-mono text-social mb-0.5">{a.id}</p>
                <p className="text-sm font-medium text-text-primary">{a.name}</p>
                <p className="text-xs text-text-muted font-mono">{a.category} · {a.date}</p>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs text-text-muted">{a.participants} participants</span>
                <Badge
                  variant={
                    a.status === 'Completed' ? 'completed'
                    : a.status === 'Upcoming' ? 'upcoming'
                    : 'pending'
                  }
                  label={a.status}
                />
                {a.status === 'Pending Approval' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-full text-xs font-semibold bg-env text-white hover:bg-[#147a45] transition-colors">Approve</button>
                    <button className="px-3 py-1 rounded-full text-xs font-semibold bg-border text-text-muted hover:bg-border-strong transition-colors">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
