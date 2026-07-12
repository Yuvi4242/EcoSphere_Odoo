import PageHeader from '@/app/_components/ui/PageHeader';
import Badge from '@/app/_components/ui/Badge';
import StatCard from '@/app/_components/ui/StatCard';
import { getCsrActivities, createCsrActivity } from '@/app/_actions/social';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import JoinActivityForm from './JoinActivityForm';

export default async function CsrActivitiesPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const userId = (session?.user as any)?.id;
  const activities = await getCsrActivities();

  return (
    <div>
      <PageHeader
        eyebrow="Social · CSR Activities"
        title="CSR Activities"
        subtitle="Community, environmental, and employee wellbeing initiatives across the organization"
        accentColor="social"
        action={isAdmin ? (
          <form action={async () => {
            'use server';
            await createCsrActivity({
              title: 'Community Beach Cleanup',
              category: 'Environmental',
              activityDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
            });
          }}>
            <button type="submit" className="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex-shrink-0 mt-1 bg-social text-white hover:bg-[#cc7133]">
              + New Activity
            </button>
          </form>
        ) : (
          <form action={async () => {
            'use server';
            await createCsrActivity({
              title: 'Demo Activity',
              category: 'General',
              activityDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            });
          }}>
            <button type="submit" className="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex-shrink-0 mt-1 bg-border text-text-muted hover:bg-border-strong">
              Generate Demo Activity
            </button>
          </form>
        )}
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total YTD" value={activities.length} dot="social" />
        <StatCard label="Budget Spent" value="€12,400" delta="67% of allocation" deltaPositive dot="social" />
        <StatCard label="Volunteers" value={189} delta="+24 this month" deltaPositive dot="social" />
      </div>
      <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              {['ID', 'Activity', 'Category', 'Date', 'Participants', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-text-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-text-muted mb-4">No CSR activities found.</p>
                </td>
              </tr>
            ) : (
              activities.map((a: any) => {
                const hasJoined = a.participations.some((p: any) => p.userId === userId);
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-social align-top">{a.code}</td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-medium text-text-primary mb-1">{a.title}</p>
                      {/* Employee Join Flow */}
                      {!isAdmin && a.status === 'UPCOMING' && !hasJoined && (
                        <JoinActivityForm activityId={a.id} />
                      )}
                      {!isAdmin && hasJoined && (
                        <p className="text-[10px] font-mono text-env mt-2 uppercase">✓ Joined</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-text-muted align-top">{a.category}</td>
                    <td className="px-4 py-4 font-mono text-xs text-text-muted align-top">{a.activityDate.toLocaleDateString()}</td>
                    <td className="px-4 py-4 font-mono align-top">{a.participations.length}</td>
                    <td className="px-4 py-4 align-top">
                      <Badge
                        variant={a.status === 'COMPLETED' ? 'completed' : a.status === 'UPCOMING' ? 'upcoming' : 'pending'}
                        label={a.status}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
