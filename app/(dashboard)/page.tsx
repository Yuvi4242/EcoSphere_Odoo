"use client";

import React, { useState, useEffect } from "react";
import { Leaf, Users, ShieldCheck, Trophy, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { formatCarbon, formatPercent, formatDate } from "@/utils/formatters";
import api from "@/services/api";

interface ScoreCard {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

interface DeptScore {
  department: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
}

interface Activity {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

/**
 * Dynamic Dashboard Home.
 * Pulls live scores, weight configurations, department leaderboards, and recent activities.
 */
export default function DashboardHome() {
  const [orgScore, setOrgScore] = useState<ScoreCard>({
    environmental: 100,
    social: 100,
    governance: 100,
    overall: 100,
  });
  const [deptScores, setDeptScores] = useState<DeptScore[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const scoresRes = await api.get("/dashboard/scores");
      if (scoresRes.data.orgScore) {
        setOrgScore(scoresRes.data.orgScore);
      }
      if (scoresRes.data.departmentScores) {
        setDeptScores(scoresRes.data.departmentScores);
      }

      const notifRes = await api.get("/notifications");
      setActivities(notifRes.data.notifications || []);
    } catch (e) {
      console.error("Error loading dashboard indicators:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: "Organization Score",
      value: `${orgScore.overall} / 100`,
      change: "Calculated overall ESG index",
      icon: Sparkles,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Environmental rating",
      value: `${orgScore.environmental} pts`,
      change: "Includes carbon Scope logs",
      icon: Leaf,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Social Index rating",
      value: `${orgScore.social} pts`,
      change: "Approved volunteer hours",
      icon: Users,
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      title: "Governance index",
      value: `${orgScore.governance} pts`,
      change: "Signed corporate policies",
      icon: ShieldCheck,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive ESG Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time indicators of your company's sustainability footprint.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-lg text-emerald-700 text-xs font-bold hover:bg-emerald-500/15 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-650 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Indicators</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {kpi.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Visualizations Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ESG Score Breakdown Gauge */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">ESG Index Rating</h3>
            <p className="text-xs text-slate-400 mt-1">Weightage-based compliance distribution.</p>
          </div>

          <div className="my-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Environmental (E)</span>
                <span className="text-emerald-600 font-bold">{orgScore.environmental} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${orgScore.environmental}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Social (S)</span>
                <span className="text-blue-600 font-bold">{orgScore.social} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${orgScore.social}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Governance (G)</span>
                <span className="text-violet-600 font-bold">{orgScore.governance} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${orgScore.governance}%` }} />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-150 pt-4 flex justify-between items-center text-xs text-slate-500">
            <span>Overall Score:</span>
            <span className="text-sm font-bold text-slate-800">{orgScore.overall} (Score index)</span>
          </div>
        </div>

        {/* Department Leaderboard Ranking */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800">Department Sustainability Index</h3>
            <p className="text-xs text-slate-400 mt-1">Inter-departmental performance comparison dashboard.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-1">Rank</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Overall</th>
                  <th className="py-3 px-3 text-center">Environmental (E)</th>
                  <th className="py-3 px-3 text-center">Social (S)</th>
                  <th className="py-3 px-3 text-center">Governance (G)</th>
                </tr>
              </thead>
              <tbody>
                {deptScores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No department scoring data. Run the seeder to establish departments.
                    </td>
                  </tr>
                ) : (
                  deptScores.map((dept, index) => (
                    <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-1 font-bold text-slate-500">#{index + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{dept.department}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-55 text-emerald-600">
                          {dept.overallScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{Math.round(dept.environmentalScore)}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{Math.round(dept.socialScore)}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{Math.round(dept.governanceScore)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-800">Recent Sustainability Activities</h3>
          <p className="text-xs text-slate-400 mt-1">Audit logs showing recent system and employee transactions.</p>
        </div>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center">
              No recent audit transactions logged.
            </div>
          ) : (
            activities.slice(0, 5).map((act) => (
              <div key={act._id} className="flex items-start justify-between text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-slate-850">
                      <span className="font-semibold text-slate-900">{act.title}</span>: {act.message}
                    </p>
                    <span className="text-[10px] text-slate-400">System Transaction Log</span>
                  </div>
                </div>
                <span className="text-slate-400 whitespace-nowrap">{formatDate(act.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
