import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Challenges', href: '/admin/gamification' },
  { label: 'Badges',     href: '/admin/gamification/badges' },
  { label: 'Rewards',    href: '/admin/gamification/rewards' },
  { label: 'Leaderboard',href: '/admin/gamification/leaderboard' },
  { label: 'My Profile', href: '/admin/gamification/profile' },
];

export default function GamificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="gamif" />
      {children}
    </div>
  );
}
