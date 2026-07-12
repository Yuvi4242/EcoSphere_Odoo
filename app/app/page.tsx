import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma';
import PageHeader from '@/app/_components/ui/PageHeader';
import StatCard from '@/app/_components/ui/StatCard';
import Badge from '@/app/_components/ui/Badge';
import Link from 'next/link';
import { FileWarning, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function EmployeeDashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Employee';

  // 1. Fetch user profile and department
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { department: true }
  });

  // 2. Count earned badges
  const badgesCount = await prisma.employeeBadge.count({
    where: { userId }
  });

  // 3. Count completed (approved) activities
  const completedActivitiesCount = await prisma.participation.count({
    where: { userId, status: 'APPROVED' }
  });

  // 4. Calculate department gamification rank
  const departments = await prisma.department.findMany({
    include: {
      users: {
        select: { xpTotal: true }
      }
    }
  });

  const deptsWithXp = departments.map(d => {
    const totalXp = d.users.reduce((acc, u) => acc + u.xpTotal, 0);
    return { id: d.id, name: d.name, totalXp };
  }).sort((a, b) => b.totalXp - a.totalXp);

  const myDeptIndex = deptsWithXp.findIndex(d => d.id === user?.departmentId);
  const deptRank = myDeptIndex !== -1 ? `#${myDeptIndex + 1}` : '—';
  const deptName = user?.department?.name || 'Unassigned';

  // 5. Get recent participations for "Continue" section
  const participations = await prisma.participation.findMany({
    where: { userId },
    include: { activity: true },
    orderBy: { submittedAt: 'desc' },
    take: 5
  });

  // XP data
  const xpTotal = user?.xpTotal || 0;
  const level = Math.floor(xpTotal / 400) + 1;

  // Policies (Awaiting acknowledgement check: mock-only)
  // Let's assume there are 2 policies needing acknowledgement by default for demo
  const pendingPoliciesCount = 2; 

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        eyebrow="MY IMPACT"
        title={`Welcome back, ${userName}`}
        subtitle="Your ESG activity at a glance"
        accentColor="gamif"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="My XP & Level" 
          value={`${xpTotal.toLocaleString()} XP`} 
          delta={`LVL ${level}`} 
          deltaPositive 
          dot="gamif" 
        />
        <StatCard 
          label="Badges Earned" 
          value={badgesCount} 
          dot="gamif" 
        />
        <StatCard 
          label="Activities Completed" 
          value={completedActivitiesCount} 
          dot="social" 
        />
        <StatCard 
          label="Department Rank" 
          value={deptRank} 
          delta={deptName} 
          deltaPositive={myDeptIndex === 0} 
          dot="env" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending / Continue Section */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col min-h-[300px]">
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">My Submissions</h3>
          
          <div className="flex-1 flex flex-col gap-3">
            {participations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
                <p className="text-sm text-text-muted mb-3">You haven&apos;t joined any CSR activities yet.</p>
                <Link 
                  href="/app/csr-activities" 
                  className="px-4 py-2 bg-social text-white rounded-full text-xs font-semibold hover:bg-[#cc7133] transition-colors"
                >
                  Explore CSR Activities
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {participations.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{p.activity.title}</p>
                      <p className="text-xs text-text-muted font-mono mt-0.5">
                        Submitted: {new Date(p.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.pointsEarned > 0 && (
                        <span className="text-xs font-mono font-bold text-gamif">+{p.pointsEarned} pts</span>
                      )}
                      <Badge 
                        variant={
                          p.status === 'APPROVED' ? 'completed' 
                          : p.status === 'REJECTED' ? 'pending' // use pending style for warning/rejected, or similar
                          : 'pending'
                        } 
                        label={p.status} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Policies Pending Alert */}
        <div className="flex flex-col gap-6">
          {pendingPoliciesCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600 flex-shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Policies Awaiting Signature</h4>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    You have {pendingPoliciesCount} ESG policies that require your acknowledgement. Please review them.
                  </p>
                </div>
              </div>
              <Link 
                href="/app/policies" 
                className="mt-auto w-full py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-xs text-center hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Review & Acknowledge</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )}

          {/* Gamification Level Up Promotion card */}
          <div className="bg-gamif-light border border-gamif/20 rounded-2xl p-6 flex flex-col shadow-sm">
            <h4 className="font-bold text-text-primary text-sm flex items-center gap-2 mb-2">
              <span>🚀</span> Level Up Your Skills
            </h4>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Complete sustainability challenges and log CSR volunteer proof to earn XP badges and unlock premium rewards.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/app/challenges" 
                className="py-2 border border-gamif/30 rounded-xl text-gamif font-semibold text-xs text-center hover:bg-gamif/10 transition-colors"
              >
                Challenges
              </Link>
              <Link 
                href="/app/rewards" 
                className="py-2 bg-gamif text-white rounded-xl font-semibold text-xs text-center hover:bg-[#6b3de0] transition-colors"
              >
                Rewards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
