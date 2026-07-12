import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Dashboard',            href: '/environmental' },
  { label: 'Emission Factors',     href: '/environmental/emission-factors' },
  { label: 'Carbon Transactions',  href: '/environmental/carbon-transactions' },
  { label: 'Department Tracking',  href: '/environmental/department-tracking' },
];

export default function EnvironmentalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="env" />
      {children}
    </div>
  );
}
