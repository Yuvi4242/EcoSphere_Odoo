import StatCard from '@/app/_components/ui/StatCard';
import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import { getSocialStats, getPendingParticipations, getCsrActivities, createCsrActivity } from '@/app/_actions/social';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import ApprovalQueueClient from './ApprovalQueueClient';
import JoinActivityForm from './csr-activities/JoinActivityForm';

export default async function SocialPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const userId = (session?.user as any)?.id;

  const [stats, activities, pending] = await Promise.all([
    getSocialStats(),
    getCsrActivities(),
    getPendingParticipations(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Social"
        title="Social Overview"
        subtitle="CSR activities, employee wellbeing, training, and community engagement metrics"
        accentColor="social"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="CSR Activities" value={stats.activityCount} dot="social" />
        <StatCard label="Volunteers Engaged" value={stats.volunteersCount} dot="social" />
        <StatCard label="Training Completion" value={`${stats.trainingCompletionRate}%`} dot="social" />
        <StatCard label="Pending Approvals" value={pending.length} dot="social" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active CSR Activities */}
        <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted">CSR Activities</p>
            {isAdmin && (
              <form action={async () => {
                'use server';
                await createCsrActivity({
                  title: 'Community Tree Planting Drive',
                  category: 'Environmental',
                  activityDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
                });
              }}>
                <button type="submit" className="px-4 py-1.5 rounded-full bg-social text-white text-xs font-semibold hover:bg-[#cc7133] transition-colors">
                  + Generate Demo Activity
                </button>
              </form>
            )}
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2">
            {activities.length === 0 ? (
              <p className="text-sm text-text-muted py-4">No activities found.</p>
            ) : (
              activities.map((a: any) => {
                const hasJoined = a.participations.some((p: any) => p.userId === userId);
                return (
                  <div key={a.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-[10px] font-mono text-social mb-0.5">{a.code}</p>
                      <p className="text-sm font-medium text-text-primary">{a.title}</p>
                      <p className="text-xs text-text-muted font-mono">{a.category} · {a.activityDate.toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          a.status === 'COMPLETED' ? 'completed'
                            : a.status === 'UPCOMING' ? 'upcoming'
                              : 'pending'
                        }
                        label={a.status}
                      />
                      {!isAdmin && !hasJoined && a.status === 'UPCOMING' && (
                        <JoinActivityForm activityId={a.id} />
                      )}
                      {!isAdmin && hasJoined && (
                        <span className="text-[10px] font-mono text-env">✓ JOINED</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Approval Queue (Admin only) */}
        {isAdmin && (
          <div className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col max-h-[600px]">
            <div className="mb-4 flex-shrink-0">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Approval Queue</p>
            </div>
            <div className="overflow-y-auto pr-2">
              <ApprovalQueueClient pending={pending} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
