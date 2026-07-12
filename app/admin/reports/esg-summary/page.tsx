import StatCard from '@/app/_components/ui/StatCard';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import { reportSummaries } from '@/app/_lib/mock-data';

const pillars = [
  { label: 'Environmental', score: reportSummaries.esgScore.environmental, color: 'env' as const },
  { label: 'Social',        score: reportSummaries.esgScore.social,        color: 'social' as const },
  { label: 'Governance',    score: reportSummaries.esgScore.governance,    color: 'gov' as const },
];

export default function EsgSummaryPage() {
  return (
    <div>
      {/* Overall score */}
      <div className="bg-text-primary rounded-2xl p-8 mb-6 flex items-center gap-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted/60 mb-1">Overall ESG Score</p>
          <p className="text-7xl font-black text-white leading-none">{reportSummaries.esgScore.total}</p>
          <p className="text-sm text-text-muted/60 mt-2">/ 100 · FY 2025</p>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {pillars.map(p => (
            <div key={p.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono uppercase tracking-widest text-surface/60">{p.label}</span>
                <span className="text-sm font-bold text-surface">{p.score}</span>
              </div>
              <ProgressBar value={p.score} color={p.color} height="md" showLabel={false} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Emissions" value="4,281" unit="tCO2e" dot="env" />
        <StatCard label="CSR Activities" value={22} dot="social" />
        <StatCard label="Audit Pass Rate" value="67%" dot="gov" />
        <StatCard label="XP Distributed" value="128K" dot="gamif" />
      </div>
    </div>
  );
}
