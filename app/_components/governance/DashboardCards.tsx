'use client';

import React from 'react';
import { Shield, Users, Percent, AlertCircle, CalendarRange, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
}

function KpiCard({ label, value, subtext, trend, trendType, icon: Icon, gradient }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between"
    >
      {/* Background glow decorator */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${gradient} blur-xl`} />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">{label}</p>
          <h3 className="text-3xl font-black text-text-primary tracking-tight leading-none">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {subtext && <span className="text-xs text-text-muted">{subtext}</span>}
        {trend && (
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              trendType === 'positive'
                ? 'bg-env-light text-env'
                : trendType === 'negative'
                ? 'bg-red-50 text-red-600'
                : 'bg-border text-text-muted'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardCards({
  stats
}: {
  stats: {
    totalPolicies: number;
    publishedPolicies: number;
    pendingAcks: number;
    complianceScore: number;
    upcomingAudits: number;
    completedAudits: number;
    highRiskFindings: number;
    avgAuditScore: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard
        label="Total Policies"
        value={stats.totalPolicies}
        subtext={`${stats.publishedPolicies} Active / Published`}
        trend="Published"
        trendType="positive"
        icon={Shield}
        gradient="from-[#0ea5e9] to-[#2563eb]" // Blue
      />
      <KpiCard
        label="Compliance Score"
        value={`${stats.complianceScore}%`}
        subtext="Completed Compliance / Total"
        trend="Target: 95%"
        trendType={stats.complianceScore >= 90 ? 'positive' : 'negative'}
        icon={Percent}
        gradient="from-env to-[#10b981]" // Green
      />
      <KpiCard
        label="Pending Acknowledgments"
        value={stats.pendingAcks}
        subtext="Required employee sign-offs"
        trend="Needs Action"
        trendType="negative"
        icon={Users}
        gradient="from-[#f59e0b] to-[#d97706]" // Amber
      />
      <KpiCard
        label="Upcoming Audits"
        value={stats.upcomingAudits}
        subtext={`${stats.completedAudits} Audits Completed`}
        trend="Scheduled"
        trendType="neutral"
        icon={CalendarRange}
        gradient="from-[#6366f1] to-[#4f46e5]" // Indigo
      />
      <KpiCard
        label="High Risk Findings"
        value={stats.highRiskFindings}
        subtext="Unresolved Critical issues"
        trend={stats.highRiskFindings > 0 ? 'Urgent' : 'Secure'}
        trendType={stats.highRiskFindings > 0 ? 'negative' : 'positive'}
        icon={AlertCircle}
        gradient="from-red-500 to-rose-600" // Red
      />
      <KpiCard
        label="Average Audit Score"
        value={`${stats.avgAuditScore}%`}
        subtext="Valuation score avg."
        trend="H1 Performance"
        trendType="positive"
        icon={Award}
        gradient="from-[#a855f7] to-[#7c3aed]" // Purple
      />
    </div>
  );
}
