import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Overview',           href: '/governance' },
  { label: 'Audits',             href: '/governance/audits' },
  { label: 'Compliance Issues',  href: '/governance/compliance' },
  { label: 'ESG Policies',       href: '/governance/policies' },
  { label: 'Risks Assessment',   href: '/governance/risks' },
  { label: 'Reports',            href: '/governance/reports' },
];

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="gov" />
      {children}
    </div>
  );
}
