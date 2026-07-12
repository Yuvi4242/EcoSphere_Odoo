import PageHeader from '@/app/_components/ui/PageHeader';
import StatCard from '@/app/_components/ui/StatCard';
import { GenderPieChart, AgeBarChart } from '@/app/_components/charts/DiversityCharts';
import { diversityData } from '@/app/_lib/mock-data';

export default function DiversityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Social · Diversity Metrics"
        title="Diversity & Inclusion"
        subtitle="Org-wide demographic breakdown and representation across leadership levels"
        accentColor="social"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees" value={280} dot="social" />
        <StatCard label="Women in Workforce" value="44%" delta="+2% YoY" deltaPositive dot="social" />
        <StatCard label="Women in Leadership" value="38%" delta="+4% YoY" deltaPositive dot="social" />
        <StatCard label="Diversity Score" value={81} unit="/ 100" delta="+6 vs last year" deltaPositive dot="social" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gender */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Gender Balance</p>
          <GenderPieChart data={diversityData.gender} />
        </div>

        {/* Leadership */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Leadership Representation</p>
          <GenderPieChart data={diversityData.leadership} />
        </div>

        {/* Age */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Age Distribution</p>
          <AgeBarChart data={diversityData.ageGroups} />
        </div>
      </div>
    </div>
  );
}
