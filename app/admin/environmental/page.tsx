import PageHeader from '@/app/_components/ui/PageHeader';
import StatCard from '@/app/_components/ui/StatCard';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import EmissionsLineChart from '@/app/_components/charts/EmissionsLineChart';
import { emissionsData, sustainabilityGoals } from '@/app/_lib/mock-data';

export default function EnvironmentalDashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Environmental"
        title="Carbon, Goals & Emissions"
        subtitle="Tracking emission factors, carbon transactions, and sustainability targets"
        accentColor="env"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Emissions — Q3" value="1,042" unit="tCO2e" delta="-11.4% vs Q2" deltaPositive dot="env" />
        <StatCard label="Goals on Track" value="3" unit="/ 4" delta="1 needs attention" deltaPositive={false} dot="env" />
        <StatCard label="Depts Over Threshold" value="2" delta="Manufacturing, Logistics" deltaPositive={false} dot="social" />
      </div>

      {/* Emissions Trend Chart */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6 mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">Emissions Trend</p>
        <p className="text-sm text-text-muted mb-4">Monthly tCO2e — Jan to Dec 2025</p>
        <EmissionsLineChart data={emissionsData} />
      </div>

      {/* Sustainability Goals */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Sustainability Goals</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sustainabilityGoals.map(goal => (
            <div key={goal.id} className="border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-env mb-1">{goal.id}</p>
                  <p className="text-sm font-semibold text-text-primary">{goal.name}</p>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${goal.progress >= 70 ? 'bg-env-light text-env' : 'bg-social-light text-social'}`}>
                  {goal.progress}%
                </span>
              </div>
              <ProgressBar value={goal.progress} color={goal.progress >= 70 ? 'env' : 'social'} />
              <div className="flex items-center justify-between mt-3 text-xs text-text-muted font-mono">
                <span>Actual: {goal.actual} {goal.unit}</span>
                <span>Target: {goal.target} {goal.unit}</span>
                <span>Due: {goal.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
