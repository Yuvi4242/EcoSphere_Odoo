import PageHeader from '@/app/_components/ui/PageHeader';
import { badges } from '@/app/_lib/mock-data';
import { CheckCircle2 } from 'lucide-react';

export default function BadgesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gamification · Badges"
        title="Achievement Badges"
        subtitle="Earn badges by completing challenges, logging emissions, and engaging with ESG activities"
        accentColor="gamif"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`relative bg-surface rounded-2xl border card-shadow p-5 flex flex-col items-center text-center transition-all ${
              badge.earned
                ? 'border-gamif/30 hover:border-gamif/50 hover:-translate-y-0.5'
                : 'border-border opacity-55 hover:opacity-75'
            }`}
          >
            {badge.earned && (
              <div className="absolute top-2.5 right-2.5">
                <CheckCircle2 size={14} className="text-env" />
              </div>
            )}
            <div className={`text-4xl mb-3 ${badge.earned ? '' : 'grayscale'}`}>
              {badge.icon}
            </div>
            <p className="text-xs font-bold text-text-primary mb-1 leading-tight">{badge.name}</p>
            {badge.earned ? (
              <>
                <p className="text-[10px] text-text-muted mb-2 leading-tight">{badge.description}</p>
                <span className="text-[10px] font-mono text-env mt-auto">{badge.earnedDate}</span>
              </>
            ) : (
              <p className="text-[10px] text-text-muted leading-tight mt-1">
                🔒 {badge.unlockRule}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
