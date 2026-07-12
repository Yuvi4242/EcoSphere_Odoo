'use client';

import Badge from '@/app/_components/ui/Badge';

export function StatusBadge({ status }: { status: string }) {
  const norm = status.toLowerCase().replace(/\s+/g, '');
  let variant: any = 'neutral';
  
  if (norm === 'published' || norm === 'passed' || norm === 'completed' || norm === 'active' || norm === 'resolved' || norm === 'mitigated' || norm === 'accepted') {
    variant = 'passed'; // green
  } else if (norm === 'failed' || norm === 'overdue' || norm === 'critical' || norm === 'rejected') {
    variant = 'failed'; // red
  } else if (norm === 'scheduled' || norm === 'upcoming' || norm === 'running' || norm === 'inprogress') {
    variant = 'inprogress'; // orange/amber or blue
    if (norm === 'scheduled' || norm === 'upcoming') variant = 'scheduled';
  } else if (norm === 'pending' || norm === 'draft') {
    variant = 'pending'; // yellow
  } else if (norm === 'archived' || norm === 'cancelled' || norm === 'inactive') {
    variant = 'neutral';
  }

  return <Badge variant={variant} label={status} />;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const norm = priority.toLowerCase();
  let variant: any = 'neutral';

  if (norm === 'critical') {
    variant = 'critical'; // red bold
  } else if (norm === 'high') {
    variant = 'high'; // orange
  } else if (norm === 'medium') {
    variant = 'medium'; // yellow
  } else if (norm === 'low') {
    variant = 'low'; // blue
  }

  return <Badge variant={variant} label={priority} />;
}
