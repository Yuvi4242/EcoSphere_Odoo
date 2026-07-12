import StatCard from '@/app/_components/ui/StatCard';
import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import ProgressBar from '@/app/_components/ui/ProgressBar';

const approvalQueue = [
  { id: 'CSR-19', title: 'Coastal Cleanup Initiative', type: 'CSR Activity', submitted: 'Sarah K.', initials: 'SK', color: 'bg-social' },
  { id: 'CH-32', title: 'Green Supply Chain Audit', type: 'Challenge', submitted: 'Tom R.', initials: 'TR', color: 'bg-env' },
  { id: 'CSR-20', title: 'STEM Workshop Partnership', type: 'CSR Activity', submitted: 'Maria L.', initials: 'ML', color: 'bg-social' },
];

const pillarScores = [
  { label: 'Environmental', score: 71, color: 'env' as const },
  { label: 'Social', score: 78, color: 'social' as const },
  { label: 'Governance', score: 73, color: 'gov' as const },
  { label: 'Gamification', score: 84, color: 'gamif' as const },
];

const deptRankings = [
  { dept: 'Engineering', score: 91, change: '+3' },
  { dept: 'HR', score: 88, change: '+1' },
  { dept: 'Finance', score: 85, change: '0' },
  { dept: 'Manufacturing', score: 79, change: '+5' },
  { dept: 'Sales', score: 74, change: '-2' },
  { dept: 'Logistics', score: 68, change: '+4' },
];

export default function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Overview"
        title="ESG Dashboard"
        subtitle="Real-time sustainability performance across all pillars"
        actionLabel="Download Report"
        accentColor="neutral"
      />

      {/* Overall ESG Score */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">Overall ESG Score</p>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-text-primary leading-none">74</span>
              <span className="text-lg text-text-muted mb-1">/ 100</span>
            </div>
          </div>
          <Badge variant="active" label="LIVE ERP SYNC" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pillarScores.map(p => (
            <div key={p.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono uppercase tracking-wide text-text-muted">{p.label}</span>
                <span className="text-sm font-bold text-text-primary">{p.score}</span>
              </div>
              <ProgressBar value={p.score} color={p.color} showLabel={false} height="md" />
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Emissions" value="4,281" unit="tCO2e" delta="-8.3% vs last quarter" deltaPositive dot="env" />
        <StatCard label="CSR Activities" value="22" delta="+4 this quarter" deltaPositive dot="social" />
        <StatCard label="Policies Active" value="6" delta="2 under review" deltaPositive={false} dot="gov" />
        <StatCard label="XP Distributed" value="128K" delta="+12% this month" deltaPositive dot="gamif" />
      </div>

      {/* Department Rankings + Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rankings */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Department Rankings</p>
          <div className="flex flex-col gap-3">
            {deptRankings.map((dept, i) => (
              <div key={dept.dept} className="flex items-center gap-3">
                <span className="text-sm font-mono text-text-muted w-5 text-center">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-text-primary">{dept.dept}</span>
                <ProgressBar value={dept.score} color={i < 2 ? 'env' : i < 4 ? 'social' : 'neutral'} height="sm" className="flex-1 max-w-[120px]" />
                <span className="text-sm font-bold text-text-primary w-8 text-right">{dept.score}</span>
                <span className={`text-xs font-mono w-8 text-right ${dept.change.startsWith('+') ? 'text-env' : dept.change === '0' ? 'text-text-muted' : 'text-social'}`}>
                  {dept.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Approval Queue</p>
          <div className="flex flex-col gap-3">
            {approvalQueue.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                  <p className="text-xs text-text-muted font-mono">{item.id} · {item.type}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-env text-white hover:bg-[#147a45] transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-semibold bg-border text-text-muted hover:bg-border-strong transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
