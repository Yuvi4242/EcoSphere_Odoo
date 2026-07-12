import { cn } from '@/app/_lib/utils';

type ProgressColor = 'env' | 'social' | 'gov' | 'gamif' | 'neutral';

const colorMap: Record<ProgressColor, string> = {
  env:     'bg-env',
  social:  'bg-social',
  gov:     'bg-gov',
  gamif:   'bg-gamif',
  neutral: 'bg-text-muted',
};

interface ProgressBarProps {
  value: number; // 0-100
  color?: ProgressColor;
  showLabel?: boolean;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ value, color = 'env', showLabel = true, className, height = 'md' }: ProgressBarProps) {
  const h = height === 'sm' ? 'h-1.5' : height === 'lg' ? 'h-3' : 'h-2';
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 rounded-full bg-border overflow-hidden', h)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorMap[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-text-muted w-9 text-right">{clamped}%</span>
      )}
    </div>
  );
}
