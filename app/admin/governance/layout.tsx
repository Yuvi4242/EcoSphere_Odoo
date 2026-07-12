import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
<<<<<<< HEAD:app/(dashboard)/governance/layout.tsx
  { label: 'Overview',           href: '/governance' },
  { label: 'Audits',             href: '/governance/audits' },
  { label: 'Compliance Issues',  href: '/governance/compliance' },
  { label: 'ESG Policies',       href: '/governance/policies' },
  { label: 'Risks Assessment',   href: '/governance/risks' },
  { label: 'Reports',            href: '/governance/reports' },
=======
  { label: 'Overview',           href: '/admin/governance' },
  { label: 'Audits',             href: '/admin/governance/audits' },
  { label: 'Compliance Issues',  href: '/admin/governance/compliance' },
  { label: 'ESG Policies',       href: '/admin/governance/policies' },
>>>>>>> 73677a365d520564efd840284979b8e386371b8b:app/admin/governance/layout.tsx
];

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="gov" />
      {children}
    </div>
  );
}
