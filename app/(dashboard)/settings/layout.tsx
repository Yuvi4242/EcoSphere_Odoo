import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'ESG Config',    href: '/settings' },
  { label: 'Departments',   href: '/settings/departments' },
  { label: 'Categories',    href: '/settings/categories' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Users & Roles', href: '/settings/users' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">Settings</p>
        <h1 className="text-3xl font-black text-text-primary">Platform Settings</h1>
        <p className="text-sm text-text-muted mt-1">Configure ESG parameters, departments, users, and notification preferences</p>
      </div>
      <TabNav tabs={tabs} accentColor="action" />
      {children}
    </div>
  );
}
