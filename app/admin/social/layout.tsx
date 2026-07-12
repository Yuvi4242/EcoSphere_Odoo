import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Overview',          href: '/admin/social' },
  { label: 'CSR Activities',    href: '/admin/social/csr-activities' },
  { label: 'Diversity Metrics', href: '/admin/social/diversity' },
  { label: 'Training',          href: '/admin/social/training' },
];

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="social" />
      {children}
    </div>
  );
}
