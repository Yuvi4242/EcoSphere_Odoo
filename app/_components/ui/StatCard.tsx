import { cn } from '@/app/_lib/utils';

type DotColor = 'env' | 'social' | 'gov' | 'gamif' | 'neutral';

const dotColorMap: Record<DotColor, string> = {
  env:     'bg-env',
  social:  'bg-social',
  gov:     'bg-gov',
  gamif:   'bg-gamif',
  neutral: 'bg-text-muted',
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  dot?: DotColor;
  className?: string;
}

export default function StatCard({ label, value, unit, delta, deltaPositive, dot = 'neutral', className }: StatCardProps) {
  return (
    <div className={cn('bg-surface rounded-2xl p-6 card-shadow border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dotColorMap[dot])} />
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-text-primary leading-none">{value}</span>
        {unit && <span className="text-sm text-text-muted mb-1">{unit}</span>}
      </div>
      {delta && (
        <div className={cn('mt-2 text-xs font-medium', deltaPositive ? 'text-env' : 'text-red-500')}>
          {deltaPositive ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}
