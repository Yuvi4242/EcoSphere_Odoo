'use client';

import { useToast } from '@/app/_components/ui/Toast';
import { reviewParticipation } from '@/app/_actions/social';
import { useTransition } from 'react';

export default function ApprovalQueueClient({ pending }: { pending: any[] }) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleReview = async (participationId: string, approved: boolean) => {
    startTransition(async () => {
      try {
        await reviewParticipation(participationId, approved);
        showToast(approved ? 'Participation approved!' : 'Participation rejected.', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to review participation.', 'error');
      }
    });
  };

  if (pending.length === 0) {
    return <p className="text-sm text-text-muted py-4">No pending participations.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {pending.map((p: any) => (
        <div key={p.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
          <div>
            <p className="text-sm font-medium text-text-primary">{p.user?.name || p.user?.email}</p>
            <p className="text-xs text-text-muted font-mono">{p.activity.title}</p>
            {p.proofUrl && (
              <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-social hover:underline mt-1 block">
                [View Proof]
              </a>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleReview(p.id, true)}
              disabled={isPending || !p.proofUrl}
              title={!p.proofUrl ? 'Proof required to approve' : ''}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-env text-white hover:bg-[#147a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              Approve
            </button>
            <button
              onClick={() => handleReview(p.id, false)}
              disabled={isPending}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-border text-text-muted hover:bg-border-strong transition-colors flex-shrink-0"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
