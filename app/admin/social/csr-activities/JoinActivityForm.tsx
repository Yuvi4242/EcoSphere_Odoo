'use client';

import { useToast } from '@/app/_components/ui/Toast';
import { joinCsrActivity } from '@/app/_actions/social';
import { useTransition, useState } from 'react';

export default function JoinActivityForm({ activityId }: { activityId: string }) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [proofUrl, setProofUrl] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await joinCsrActivity(activityId, proofUrl || undefined);
        showToast('Successfully joined activity! Awaiting admin approval.', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to join activity.', 'error');
      }
    });
  };

  return (
    <form onSubmit={handleJoin} className="flex items-center gap-2 mt-2 max-w-sm">
      <input
        type="url"
        placeholder="Photo/Proof URL (optional)"
        className="flex-1 px-3 py-1.5 text-xs bg-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-social"
        value={proofUrl}
        onChange={(e) => setProofUrl(e.target.value)}
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-action text-white hover:bg-[#2a2a25] transition-colors disabled:opacity-50 flex-shrink-0"
      >
        {isPending ? 'Joining...' : 'Join'}
      </button>
    </form>
  );
}
