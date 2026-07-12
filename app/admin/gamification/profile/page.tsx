import PageHeader from '@/app/_components/ui/PageHeader';
import ProgressBar from '@/app/_components/ui/ProgressBar';
import { badges, redemptionHistory } from '@/app/_lib/mock-data';
import { CheckCircle2 } from 'lucide-react';

const USER = {
  name: 'Sarah K.',
  initials: 'SK',
  level: 24,
  xp: 9847,
  nextLevelXp: 10000,
  department: 'Engineering',
  role: 'ESG Admin',
};

const earnedBadges = badges.filter(b => b.earned);

export default function ProfilePage() {
  const xpPct = Math.round((USER.xp / USER.nextLevelXp) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Gamification · My Profile"
        title="My ESG Profile"
        subtitle="Your personal sustainability journey, XP progress, and earned recognition"
        accentColor="gamif"
      />

      {/* Profile banner */}
      <div className="bg-gamif-light border border-gamif/20 rounded-2xl p-6 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gamif flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {USER.initials}
        </div>
        <div className="flex-1">
          <p className="text-xs font-mono uppercase tracking-widest text-gamif mb-0.5">Level {USER.level}</p>
          <h2 className="text-2xl font-black text-text-primary mb-1">{USER.name}</h2>
          <p className="text-sm text-text-muted font-mono">{USER.department} · {USER.role}</p>
        </div>
        <div className="min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gamif">Level {USER.level}</span>
            <span className="text-xs font-mono text-gamif">Level {USER.level + 1}</span>
          </div>
          <ProgressBar value={xpPct} color="gamif" height="lg" />
          <p className="text-xs font-mono text-text-muted mt-1.5 text-center">
            {USER.xp.toLocaleString()} / {USER.nextLevelXp.toLocaleString()} XP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned Badges */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Earned Badges ({earnedBadges.length})</p>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center text-center bg-gamif-light/40 rounded-xl p-3 border border-gamif/15">
                <span className="text-2xl mb-1">{badge.icon}</span>
                <p className="text-[10px] font-bold text-text-primary leading-tight">{badge.name}</p>
                <CheckCircle2 size={12} className="text-env mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Redemption History */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Redemption History</p>
          <div className="flex flex-col gap-3">
            {redemptionHistory.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 bg-gamif-light rounded-full flex items-center justify-center text-gamif text-xs font-bold">
                  🎁
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{item.reward}</p>
                  <p className="text-xs font-mono text-text-muted">{item.date}</p>
                </div>
                <span className="text-sm font-mono font-bold text-gamif">−{item.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
