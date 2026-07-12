import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Overview',           href: '/admin/governance' },
  { label: 'Audits',             href: '/admin/governance/audits' },
  { label: 'Compliance Issues',  href: '/admin/governance/compliance' },
  { label: 'ESG Policies',       href: '/admin/governance/policies' },
];

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="gov" />
      {children}
    </div>
  );
}
