import PageHeader from '@/app/_components/ui/PageHeader';
import RewardsClient from './RewardsClient';
import { getRewards, getUserProfile } from '@/app/_actions/gamification';

export default async function RewardsPage() {
  const [rewards, userProfile] = await Promise.all([
    getRewards(),
    getUserProfile()
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Rewards"
        title="Rewards Catalog"
        subtitle="Spend your XP points to claim sustainability-themed rewards and perks"
        accentColor="gamif"
      />
      <RewardsClient 
        rewards={rewards} 
        userPoints={userProfile?.pointsBalance || 0} 
        userLifetime={userProfile?.xpTotal || 0} 
      />
    </div>
  );
}
