import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/_lib/prisma';
import PageHeader from '@/app/_components/ui/PageHeader';
import DashboardCards from '@/app/_components/governance/DashboardCards';
import AnalyticsChart from '@/app/_components/governance/AnalyticsChart';
import ActivityTimeline from '@/app/_components/governance/ActivityTimeline';
import { getComplianceStats, getAuditStats, getRiskStats, getActivityLogs, seedGovernanceData } from '@/app/_actions/governance';
import { formatDate } from '@/app/_lib/utils';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ShieldAlert, RefreshCw, FileText, ClipboardList, Plus } from 'lucide-react';

async function handleSeedAction() {
  'use server';
  await seedGovernanceData();
  revalidatePath('/governance');
}

interface ComplianceDeadline {
  id: string;
  title: string;
  priority: string;
  dueDate: Date;
  department: {
    name: string;
  };
}

export default async function GovernancePage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role || 'EMPLOYEE';
  const userId = (session?.user as { id?: string })?.id;

  // Fetch counts and stats
  const totalPolicies = await prisma.policy.count();
  const publishedPolicies = await prisma.policy.count({ where: { status: 'Published' } });
  
  // Pending policy acknowledgements count
  let pendingAcks = 0;
  if (userId) {
    pendingAcks = await prisma.policyAcknowledgement.count({
      where: { userId, status: 'Pending' }
    });
  } else {
    pendingAcks = await prisma.policyAcknowledgement.count({
      where: { status: 'Pending' }
    });
  }

  const compliance = await getComplianceStats();
  const audits = await getAuditStats();
  const risks = await getRiskStats();
  
  // Fetch recent logs
  const logResponse = await getActivityLogs({ limit: 5 });
  const recentLogs = logResponse?.logs || [];

  // Fetch recent compliance deadlines
  const upcomingDeadlines = await prisma.complianceRequirement.findMany({
    where: {
      status: { not: 'Completed' },
      dueDate: { gte: new Date() }
    },
    include: { department: true },
    orderBy: { dueDate: 'asc' },
    take: 3
  });

  // Fetch notifications
  let userNotifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
  }> = [];
  if (userId) {
    userNotifications = await prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  }

  // Dashboard Stats Mapping
  const stats = {
    totalPolicies,
    publishedPolicies,
    pendingAcks,
    complianceScore: compliance.score,
    upcomingAudits: audits.scheduled,
    completedAudits: audits.completed,
    highRiskFindings: audits.highRiskFindings,
    avgAuditScore: audits.avgScore
  };

  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Governance & Risk"
          title="ESG Governance Hub"
          subtitle="Corporate policy enforcement, compliance tracking, risk matrix, and internal audits"
          accentColor="gov"
        />

        {/* Sandbox Seed Controls */}
        <div className="flex gap-2.5 self-start sm:self-center">
          {isAdmin && (
            <form action={handleSeedAction}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-bg/40 text-text-primary rounded-xl border border-border text-xs font-mono font-bold transition-all shadow-sm group"
              >
                <RefreshCw size={13} className="text-gov group-hover:rotate-180 transition-transform duration-500" />
                Seed Demo Data
              </button>
            </form>
          )}
        </div>
      </div>

      {/* KPI Stats Block */}
      <DashboardCards stats={stats} />

      {/* Recharts Analytics Section */}
      <AnalyticsChart
        deptCompliance={compliance.deptComparisons}
        riskDistribution={[
          { name: 'Critical', value: risks.critical },
          { name: 'High', value: risks.high },
          { name: 'Medium', value: risks.medium },
          { name: 'Low', value: risks.low }
        ]}
      />

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent logs & Deadlines (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions widget */}
          <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Quick Executive Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/governance/policies/new"
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-bg/5 hover:bg-bg/15 hover:border-border-strong text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-gov-light text-gov flex items-center justify-center transition-colors group-hover:bg-gov group-hover:text-white">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-bold text-text-primary">New Policy</span>
              </Link>
              <Link
                href="/governance/audits/new"
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-bg/5 hover:bg-bg/15 hover:border-border-strong text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-gov-light text-gov flex items-center justify-center transition-colors group-hover:bg-gov group-hover:text-white">
                  <ClipboardList size={16} />
                </div>
                <span className="text-xs font-bold text-text-primary">Create Audit</span>
              </Link>
              <Link
                href="/governance/compliance"
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-bg/5 hover:bg-bg/15 hover:border-border-strong text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-gov-light text-gov flex items-center justify-center transition-colors group-hover:bg-gov group-hover:text-white">
                  <ShieldAlert size={16} />
                </div>
                <span className="text-xs font-bold text-text-primary">Compliance</span>
              </Link>
              <Link
                href="/governance/reports"
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border bg-bg/5 hover:bg-bg/15 hover:border-border-strong text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-gov-light text-gov flex items-center justify-center transition-colors group-hover:bg-gov group-hover:text-white">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-text-primary">Generate Report</span>
              </Link>
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline logs={recentLogs} />
        </div>

        {/* Right Column: Deadlines, Notifications (1/3 width) */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines */}
          <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Upcoming Compliance Deadlines</p>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-text-muted py-2">No active compliance tasks pending.</p>
            ) : (
              <div className="space-y-3.5">
                {upcomingDeadlines.map((item: ComplianceDeadline) => (
                  <div key={item.id} className="flex items-start justify-between gap-2.5 py-1.5 border-b border-border last:border-0">
                    <div className="min-w-0">
                      <Link href={`/governance/compliance/${item.id}`} className="text-xs font-semibold text-text-primary truncate block hover:underline">
                        {item.title}
                      </Link>
                      <span className="text-[10px] font-mono text-text-muted block">
                        Dept: {item.department.name} · Priority: {item.priority}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-500 flex-shrink-0">
                      {formatDate(item.dueDate.toISOString())}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alert Center Notifications */}
          <div className="bg-surface rounded-2xl border border-border card-shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Unread Alerts Center</p>
              <Link href="/governance/notifications" className="text-[10px] font-bold text-gov hover:underline flex items-center gap-0.5">
                All Alerts
              </Link>
            </div>
            {userNotifications.length === 0 ? (
              <div className="py-4 text-center text-xs text-text-muted">
                No new governance alerts.
              </div>
            ) : (
              <div className="space-y-3">
                {userNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-bg/20 border border-border rounded-xl text-left">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold text-text-primary truncate max-w-[120px]">{notif.title}</span>
                      <span className="text-[9px] font-mono text-text-muted">{formatDate(notif.createdAt.toISOString())}</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
