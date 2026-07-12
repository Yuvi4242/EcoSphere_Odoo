import PageHeader from '@/app/_components/ui/PageHeader';
import LeaderboardClient from './LeaderboardClient';
import { getLeaderboard } from '@/app/_actions/gamification';

export default async function LeaderboardPage() {
  const users = await getLeaderboard();

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Leaderboard"
        title="XP Leaderboard"
        subtitle="Top performers by ESG engagement, challenges completed, and emissions logged"
        accentColor="gamif"
      />
      <LeaderboardClient users={users} />
    </div>
  );
}
