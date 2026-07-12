import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Dashboard',            href: '/admin/environmental' },
  { label: 'Emission Factors',     href: '/admin/environmental/emission-factors' },
  { label: 'Carbon Transactions',  href: '/admin/environmental/carbon-transactions' },
  { label: 'Department Tracking',  href: '/admin/environmental/department-tracking' },
];

export default function EnvironmentalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="env" />
      {children}
    </div>
  );
}
