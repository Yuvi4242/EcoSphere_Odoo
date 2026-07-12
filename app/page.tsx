'use client';

import React from 'react';
import { useESG } from '../context/ESGContext';
import Link from 'next/link';
import { 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building,
  Target,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function Home() {
  const { 
    overallEsgScore, 
    departmentScores, 
    settings, 
    sustainabilityGoals, 
    complianceIssues,
    currentUser
  } = useESG();

  // Calculate Average E, S, G scores
  const avgEnvironmental = Math.round(
    departmentScores.reduce((sum, d) => sum + d.environmentalScore, 0) / departmentScores.length
  ) || 0;
  const avgSocial = Math.round(
    departmentScores.reduce((sum, d) => sum + d.socialScore, 0) / departmentScores.length
  ) || 0;
  const avgGovernance = Math.round(
    departmentScores.reduce((sum, d) => sum + d.governanceScore, 0) / departmentScores.length
  ) || 0;

  const openComplianceCount = complianceIssues.filter(c => c.status === 'Open').length;
  const activeGoalsCount = sustainabilityGoals.filter(g => g.status === 'Active').length;

  // Chart data formatting
  const chartData = departmentScores.map(d => ({
    name: d.departmentName.split(' ')[0], // First word
    Environmental: d.environmentalScore,
    Social: d.socialScore,
    Governance: d.governanceScore,
    Total: d.totalScore
  }));

  // Helper for scoring colors
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-primary bg-primary/10 border-primary/20';
    if (score >= 70) return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    if (score >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-primary/5 border border-primary/20 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            EcoSphere Command Center <Sparkles className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Hi {currentUser.name}, here is the current ESG performance status of the organization.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/environmental"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            <span>Manage Sustainability</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Overall Score */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase">OVERALL ESG SCORE</p>
          <div className="mt-4 relative flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" className="stroke-border" strokeWidth="6" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r="48" 
                className="stroke-primary" 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - overallEsgScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{overallEsgScore}</span>
              <span className="text-[10px] text-primary font-bold font-mono">WEIGHTED</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground mt-4 block text-center font-mono">
            E: {settings.weights.environmental}% | S: {settings.weights.social}% | G: {settings.weights.governance}%
          </span>
        </div>

        {/* Environmental Score Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase">ENVIRONMENTAL</p>
              <h3 className="text-2xl font-bold text-foreground mt-1.5">{avgEnvironmental} <span className="text-xs text-muted-foreground">/100</span></h3>
            </div>
            <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">{activeGoalsCount} Active Goals</span>
            <Link href="/environmental" className="text-primary font-semibold hover:text-primary flex items-center gap-0.5">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Social Score Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase">SOCIAL (CSR)</p>
              <h3 className="text-2xl font-bold text-foreground mt-1.5">{avgSocial} <span className="text-xs text-muted-foreground">/100</span></h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">85% Participation</span>
            <Link href="/social" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-0.5">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Governance Score Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase">GOVERNANCE</p>
              <h3 className="text-2xl font-bold text-foreground mt-1.5">{avgGovernance} <span className="text-xs text-muted-foreground">/100</span></h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs">
            <span className={`font-semibold flex items-center gap-1 ${openComplianceCount > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {openComplianceCount} Compliance Alert{openComplianceCount !== 1 ? 's' : ''}
            </span>
            <Link href="/governance" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-0.5">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Grid: Charts & Department list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Department Ranking / Comparison list */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Department ESG Performance Breakdown</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Summary of ESG score audits across organizational departments</p>
            </div>
            <div className="p-2 bg-card border border-border rounded-lg text-muted-foreground" title="Total score weighted by settings">
              <Building className="w-4 h-4" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono">
                  <th className="pb-3.5 font-medium">Department</th>
                  <th className="pb-3.5 font-medium text-center">Environmental</th>
                  <th className="pb-3.5 font-medium text-center">Social</th>
                  <th className="pb-3.5 font-medium text-center">Governance</th>
                  <th className="pb-3.5 font-medium text-right">Total ESG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {departmentScores.map((deptScore, index) => (
                  <tr key={index} className="group hover:bg-card">
                    <td className="py-3.5 font-medium">
                      <div>
                        <p className="text-foreground text-sm">{deptScore.departmentName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          Emissions: {deptScore.emissions.toLocaleString()} kg CO₂e
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getScoreColor(deptScore.environmentalScore)}`}>
                        {deptScore.environmentalScore}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getScoreColor(deptScore.socialScore)}`}>
                        {deptScore.socialScore}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getScoreColor(deptScore.governanceScore)}`}>
                        {deptScore.governanceScore}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-foreground text-sm">
                      {deptScore.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Comparison Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Visual Breakdown</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Comparison of department ESG pillars</p>
          </div>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1c1c1c', fontSize: 11 }}
                  itemStyle={{ fontSize: 10 }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="Environmental" fill="#34d399" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Social" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Governance" fill="#a855f7" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
