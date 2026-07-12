'use client';

import PageHeader from '@/app/_components/ui/PageHeader';
import { useToast } from '@/app/_components/ui/Toast';
import { rewards } from '@/app/_lib/mock-data';

const USER_POINTS = 4200;

export default function RewardsPage() {
  const { showToast } = useToast();

  const handleRedeem = (reward: typeof rewards[number]) => {
    if (reward.stock === 0) { showToast('This reward is out of stock.', 'error'); return; }
    if (USER_POINTS < reward.points) { showToast('Insufficient points to redeem this reward.', 'error'); return; }
    showToast(`Redeemed: ${reward.name}! Points deducted.`, 'success');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Rewards"
        title="Rewards Catalog"
        subtitle="Spend your XP points to claim sustainability-themed rewards and perks"
        accentColor="gamif"
      />

      {/* Points balance banner */}
      <div className="bg-gamif-light border border-gamif/20 rounded-2xl p-5 mb-8 flex items-center gap-5">
        <span className="text-4xl">💜</span>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gamif mb-0.5">Your Points Balance</p>
          <p className="text-3xl font-black text-text-primary">{USER_POINTS.toLocaleString()} <span className="text-base font-normal text-text-muted">pts</span></p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-mono text-text-muted">Lifetime earned</p>
          <p className="text-sm font-bold text-text-primary">9,847 pts</p>
        </div>
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map(reward => {
          const canRedeem = reward.stock > 0 && USER_POINTS >= reward.points;
          const outOfStock = reward.stock === 0;
          const insufficientPoints = !outOfStock && USER_POINTS < reward.points;

          return (
            <div key={reward.id} className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-text-muted bg-bg px-2 py-1 rounded-lg">{reward.category}</span>
                {outOfStock && <span className="text-xs font-mono bg-red-50 text-red-500 px-2 py-1 rounded-lg">Out of stock</span>}
                {!outOfStock && <span className="text-xs font-mono text-text-muted">{reward.stock} left</span>}
              </div>
              <h3 className="font-bold text-text-primary mb-1">{reward.name}</h3>
              <p className="text-sm text-text-muted flex-1 mb-4">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gamif">{reward.points.toLocaleString()} <span className="text-sm font-normal text-text-muted">pts</span></span>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem}
                  title={outOfStock ? 'Out of stock' : insufficientPoints ? `Need ${(reward.points - USER_POINTS).toLocaleString()} more pts` : ''}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    canRedeem
                      ? 'bg-gamif text-white hover:bg-[#6b3de0]'
                      : 'bg-border text-text-muted cursor-not-allowed'
                  }`}
                >
                  {outOfStock ? 'Unavailable' : insufficientPoints ? `Need ${(reward.points - USER_POINTS).toLocaleString()} more` : 'Redeem'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
