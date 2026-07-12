import TabNav from '@/app/_components/ui/TabNav';

const tabs = [
  { label: 'Challenges', href: '/gamification' },
  { label: 'Badges',     href: '/gamification/badges' },
  { label: 'Rewards',    href: '/gamification/rewards' },
  { label: 'Leaderboard',href: '/gamification/leaderboard' },
  { label: 'My Profile', href: '/gamification/profile' },
];

export default function GamificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <TabNav tabs={tabs} accentColor="gamif" />
      {children}
    </div>
  );
}
