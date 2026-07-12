'use client';

import { cn } from '@/app/_lib/utils';

type BadgeVariant =
  | 'env' | 'social' | 'gov' | 'gamif'
  | 'auto' | 'manual'
  | 'passed' | 'failed' | 'scheduled'
  | 'open' | 'inprogress' | 'resolved' | 'overdue'
  | 'active' | 'inactive' | 'pending' | 'upcoming' | 'completed'
  | 'critical' | 'high' | 'medium' | 'low'
  | 'acknowledged' | 'under-review'
  | 'admin' | 'manager' | 'viewer'
  | 'mandatory' | 'optional'
  | 'todo' | 'done'
  | 'neutral';

const variantMap: Record<BadgeVariant, string> = {
  env:          'bg-env-light text-env',
  social:       'bg-social-light text-social',
  gov:          'bg-gov-light text-gov',
  gamif:        'bg-gamif-light text-gamif',
  auto:         'bg-env-light text-env',
  manual:       'bg-[#F0F0EC] text-text-muted',
  passed:       'bg-env-light text-env',
  failed:       'bg-red-50 text-red-600',
  scheduled:    'bg-blue-50 text-blue-600',
  open:         'bg-red-50 text-red-600',
  inprogress:   'bg-amber-50 text-amber-600',
  resolved:     'bg-env-light text-env',
  overdue:      'bg-red-100 text-red-700 font-semibold',
  active:       'bg-env-light text-env',
  inactive:     'bg-[#F0F0EC] text-text-muted',
  pending:      'bg-amber-50 text-amber-600',
  upcoming:     'bg-blue-50 text-blue-600',
  completed:    'bg-env-light text-env',
  critical:     'bg-red-100 text-red-700',
  high:         'bg-orange-50 text-orange-600',
  medium:       'bg-amber-50 text-amber-600',
  low:          'bg-blue-50 text-blue-500',
  acknowledged: 'bg-env-light text-env',
  'under-review':'bg-amber-50 text-amber-600',
  admin:        'bg-gamif-light text-gamif',
  manager:      'bg-gov-light text-gov',
  viewer:       'bg-[#F0F0EC] text-text-muted',
  mandatory:    'bg-gov-light text-gov',
  optional:     'bg-[#F0F0EC] text-text-muted',
  todo:         'bg-[#F0F0EC] text-text-muted',
  done:         'bg-env-light text-env',
  neutral:      'bg-[#F0F0EC] text-text-muted',
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

export default function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono tracking-wide uppercase',
        variantMap[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

// Helper to map raw string to variant
export function inferBadgeVariant(value: string): BadgeVariant {
  const normalized = value.toLowerCase().replace(/\s+/g, '') as BadgeVariant;
  return variantMap[normalized] ? normalized : 'neutral';
}
