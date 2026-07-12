import { cn } from '@/app/_lib/utils';
import { ReactNode } from 'react';

type AccentColor = 'env' | 'social' | 'gov' | 'gamif' | 'neutral';

const buttonColorMap: Record<AccentColor, string> = {
  env:     'bg-env text-white hover:bg-[#147a45]',
  social:  'bg-social text-white hover:bg-[#cc7133]',
  gov:     'bg-gov text-white hover:bg-[#1a2a3e]',
  gamif:   'bg-gamif text-white hover:bg-[#6b3de0]',
  neutral: 'bg-action text-white hover:bg-[#2a2a25]',
};

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  accentColor?: AccentColor;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  actionLabel,
  onAction,
  accentColor = 'neutral',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">{eyebrow}</p>
        <h1 className="text-3xl font-black text-text-primary leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-muted max-w-xl">{subtitle}</p>}
      </div>
      {action
        ? action
        : actionLabel && (
            <button
              onClick={onAction}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex-shrink-0 mt-1',
                buttonColorMap[accentColor]
              )}
            >
              {actionLabel}
            </button>
          )}
    </div>
  );
}
