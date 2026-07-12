import TabNav from '@/app/_components/ui/TabNav';
import { redirect } from 'next/navigation';

const tabs = [
  { label: 'Environmental',   href: '/reports/environmental' },
  { label: 'Social',          href: '/reports/social' },
  { label: 'Governance',      href: '/reports/governance' },
  { label: 'ESG Summary',     href: '/reports/esg-summary' },
  { label: 'Custom Builder',  href: '/reports/custom' },
];

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">Reports</p>
        <h1 className="text-3xl font-black text-text-primary">ESG Reports</h1>
        <p className="text-sm text-text-muted mt-1">Structured reports across all ESG pillars with export capabilities</p>
      </div>
      <TabNav tabs={tabs} accentColor="action" />
      {children}
    </div>
  );
}

export function ReportsIndex() {
  redirect('/reports/environmental');
}
