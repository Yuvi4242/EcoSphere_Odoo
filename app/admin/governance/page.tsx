import StatCard from '@/app/_components/ui/StatCard';
import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import ProgressBar from '@/app/_components/ui/ProgressBar';

export default function GovernancePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Governance"
        title="Governance Overview"
        subtitle="Policy compliance, audit health, and open issues across the organization"
        accentColor="gov"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Policies Active" value={6} dot="gov" />
        <StatCard label="Audit Pass Rate" value="67%" delta="1 failed audit" deltaPositive={false} dot="gov" />
        <StatCard label="Open Issues" value={5} delta="2 critical" deltaPositive={false} dot="social" />
        <StatCard label="Policy Ack. Rate" value="88%" delta="+3% vs last month" deltaPositive dot="env" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent audit summary */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Recent Audits</p>
          {[
            { name: 'ISO 14001 Environmental Audit', status: 'Passed', date: '2025-07-10' },
            { name: 'GDPR Data Compliance Review',   status: 'Failed',    date: '2025-07-01' },
            { name: 'Health & Safety Audit',         status: 'Passed',   date: '2025-06-25' },
          ].map(a => (
            <div key={a.name} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === 'Passed' ? 'bg-env' : 'bg-red-500'}`} />
              <span className="flex-1 text-sm text-text-primary">{a.name}</span>
              <Badge variant={a.status.toLowerCase() as 'passed' | 'failed'} label={a.status} />
            </div>
          ))}
        </div>

        {/* Policy coverage */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Policy Coverage by Dept</p>
          {[
            { dept: 'Finance', pct: 95 },
            { dept: 'HR', pct: 100 },
            { dept: 'Engineering', pct: 87 },
            { dept: 'Manufacturing', pct: 79 },
            { dept: 'Sales', pct: 74 },
          ].map(d => (
            <div key={d.dept} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-sm text-text-primary w-28 flex-shrink-0">{d.dept}</span>
              <ProgressBar value={d.pct} color="gov" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
