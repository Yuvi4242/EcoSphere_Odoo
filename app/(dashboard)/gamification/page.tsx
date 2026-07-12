"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Award, Gift, Sparkles, RefreshCw, AlertCircle, FileCheck, Shield, Upload, FileText, ArrowUpRight, CheckCircle, Plus } from "lucide-react";
import api from "@/services/api";
import { formatDate } from "@/utils/formatters";
import { useAuthUser } from "@/hooks/use-auth";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeReward?: string;
  type: "carbon" | "social" | "governance";
  deadline: string;
  completedBy: string[];
}

interface Badge {
  _id: string;
  name: string;
  description: string;
  triggerType: string;
  triggerValue: number;
}

interface Reward {
  _id: string;
  name: string;
  description: string;
  costXP: number;
  stock: number;
}

interface LeaderboardUser {
  _id: string;
  name: string;
  email: string;
  department: string;
  xp: number;
  level: number;
  badges: string[];
}

interface Participation {
  _id: string;
  challengeId: {
    _id: string;
  };
  status: string;
}

export default function GamificationDashboard() {
  const { user, setUserSession } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"challenges" | "leaderboard" | "rewards" | "badges">("challenges");

  // State data collections
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myParticipations, setMyParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states (Create Challenge for Managers/Admins)
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newXp, setNewXp] = useState<number | "">("");
  const [newBadge, setNewBadge] = useState("");
  const [newType, setNewType] = useState<"carbon" | "social" | "governance">("carbon");
  const [newDeadline, setNewDeadline] = useState("");

  // Submit Challenge states
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const chRes = await api.get("/gamification/challenges");
      setChallenges(chRes.data.challenges || []);

      const badgesRes = await api.get("/gamification/badges");
      setBadges(badgesRes.data.badges || []);

      const rewRes = await api.get("/gamification/rewards");
      setRewards(rewRes.data.rewards || []);

      const leadRes = await api.get("/gamification/leaderboard");
      setLeaderboard(leadRes.data.leaderboard || []);

      const partRes = await api.get("/gamification/challenge-participation");
      setMyParticipations(partRes.data.participations || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error pulling gamification datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle proof files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProofUrl(res.data.url);
      setSuccess("Evidence file uploaded successfully!");
    } catch (err: any) {
      setError("File upload failed.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedChallengeId) {
      setError("Please select a challenge to submit.");
      return;
    }

    try {
      await api.post("/gamification/challenge-participation", {
        challengeId: selectedChallengeId,
        proofUrl,
      });

      setSuccess("Challenge task logged! Pending review from Manager/Admin.");
      setSelectedChallengeId("");
      setProofUrl("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log challenge task.");
    }
  };

  const handleRedeem = async (rewardId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put("/gamification/rewards", { rewardId });
      setSuccess(`Success! Redeemed '${res.data.reward.name}'.`);
      // Update global context user points immediately
      if (res.data.user) {
        setUserSession(res.data.user);
      }
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Redemption failed.");
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newTitle || !newDesc || newXp === "" || !newDeadline) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      await api.post("/gamification/challenges", {
        title: newTitle,
        description: newDesc,
        xpReward: Number(newXp),
        badgeReward: newBadge || undefined,
        type: newType,
        deadline: newDeadline,
      });

      setSuccess("New ESG challenge created successfully!");
      setNewTitle("");
      setNewDesc("");
      setNewXp("");
      setNewBadge("");
      setNewDeadline("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create challenge.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Trophy className="h-7 w-7 text-amber-500 mr-2" />
          Gamification & Employee Engagement
        </h2>
        <p className="text-slate-500 text-sm mt-1">Join challenges, check leaderboards, earn achievement badges, and redeem organic reward tokens.</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          {[
            { id: "challenges", label: "Challenges", icon: Trophy },
            { id: "leaderboard", label: "Leaderboard", icon: Sparkles },
            { id: "rewards", label: "Redeem Rewards", icon: Gift },
            { id: "badges", label: "Badges Registry", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Alert alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-250 text-rose-750 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-750 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Challenges */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-bold text-slate-800">Active ESG Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((ch) => {
                const enrollment = myParticipations.find((p) => p.challengeId?._id === ch._id);
                const hasCompleted = ch.completedBy.includes(user?.id || "");
                return (
                  <div key={ch._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-500/30 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-50 text-amber-650">
                          {ch.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{formatDate(ch.deadline)}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{ch.title}</h4>
                      <p className="text-slate-550 text-xs mt-2 leading-relaxed">{ch.description}</p>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col space-y-3 text-xs">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Reward:</span>
                        <span className="font-bold text-amber-600">+{ch.xpReward} XP {ch.badgeReward ? `+ Badge: ${ch.badgeReward}` : ""}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-405">Status:</span>
                        {hasCompleted ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <CheckCircle className="h-4.5 w-4.5 mr-1" /> Completed
                          </span>
                        ) : enrollment ? (
                          <span className="text-amber-600 font-bold capitalize">{enrollment.status}</span>
                        ) : (
                          <span className="text-slate-400 font-medium">Not Enrolled</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit completion form OR Admin create challenge */}
          <div className="space-y-6">
            {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                  <Plus className="h-4 w-4 mr-1 text-amber-400" />
                  Create ESG Challenge
                </h4>
                <form onSubmit={handleCreateChallenge} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Zero Travel Week"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">XP Reward</label>
                    <input
                      type="number"
                      value={newXp}
                      onChange={(e) => setNewXp(e.target.value !== "" ? Number(e.target.value) : "")}
                      placeholder="e.g. 100"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Badge Award</label>
                    <input
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="e.g. Carbon Champion (Optional)"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="carbon">Carbon Footprint</option>
                      <option value="social">Social Responsibility</option>
                      <option value="governance">Corporate Governance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Deadline</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Challenge details..."
                      rows={3}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all">
                    Create Challenge
                  </button>
                </form>
              </div>
            )}

            {/* Log Completion Form */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <h4 className="font-bold text-slate-850 text-sm mb-4">Log Challenge Completion</h4>
              <form onSubmit={handleSubmitChallenge} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Challenge</label>
                  <select
                    value={selectedChallengeId}
                    onChange={(e) => setSelectedChallengeId(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-amber-500/20"
                    required
                  >
                    <option value="">-- Choose Challenge --</option>
                    {challenges.map((c) => {
                      const completed = c.completedBy.includes(user?.id || "");
                      if (completed) return null;
                      return <option key={c._id} value={c._id}>{c.title}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Attach Completion Proof File</label>
                  <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500 transition-all relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingFile}
                    />
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-[10px] text-slate-500 block">
                      {uploadingFile ? "Uploading..." : proofUrl ? "File Uploaded!" : "Upload proof document"}
                    </span>
                  </div>
                  {proofUrl && (
                    <span className="text-[10px] text-emerald-650 font-bold block mt-1 truncate">
                      File: {proofUrl}
                    </span>
                  )}
                </div>
                <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                  Request XP Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Company-wide Leaderboard Rankings</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time stats sorted by user level and claimed XP points.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3 text-center">Level</th>
                  <th className="py-3 px-3 text-right">XP Points</th>
                  <th className="py-3 px-3 text-right">Badges Count</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-500">#{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-850">{item.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{item.department || "No Department"}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-black text-amber-600 bg-amber-50/20">Lvl {item.level}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-850">{item.xp} XP</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-500">{item.badges?.length || 0} badges</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "rewards" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-amber-50/30 border border-amber-100 p-6 rounded-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <Gift className="h-5 w-5 text-amber-600 mr-2" />
                Organic Rewards Store
              </h3>
              <p className="text-xs text-slate-500">Redeem eco-friendly rewards items with your claimed XP points.</p>
            </div>
            {user && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">My Current XP</span>
                <span className="text-2xl font-black text-amber-600">{user.xp} XP</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((r) => {
              const disabled = !user || user.xp < r.costXP || r.stock <= 0;
              return (
                <div key={r._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-500/20 transition-all">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{r.name}</h4>
                    <p className="text-slate-550 text-xs mt-2 leading-relaxed">{r.description}</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4">
                      <span className="text-slate-400">Cost:</span>
                      <span className="font-extrabold text-amber-600">{r.costXP} XP</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Stock remaining:</span>
                      <span className={`font-semibold ${r.stock > 0 ? "text-slate-700" : "text-rose-500 font-bold"}`}>
                        {r.stock > 0 ? `${r.stock} units` : "Out of Stock"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRedeem(r._id)}
                      disabled={disabled}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Redeem Reward
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "badges" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Esg Badges Achievement Grid</h3>
            <p className="text-xs text-slate-400 mt-1">Unlock badges automatically by reaching XP and challenge milestones.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((b) => {
              const unlocked = user?.badges.includes(b.name);
              return (
                <div key={b._id} className={`p-6 border rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                  unlocked 
                    ? "border-amber-300 bg-amber-50/10 shadow-xs" 
                    : "border-slate-100 bg-slate-50/50 opacity-55"
                }`}>
                  <Award className={`h-12 w-12 ${unlocked ? "text-amber-500" : "text-slate-400"}`} />
                  <div className="mt-4">
                    <div className="font-bold text-slate-800 text-xs">{b.name}</div>
                    <div className="text-slate-500 text-[10px] mt-1 leading-relaxed">{b.description}</div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                      unlocked ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-500"
                    }`}>
                      {unlocked ? "Unlocked" : `Required: ${b.triggerValue} ${b.triggerType === "XP" ? "XP" : b.triggerType === "ChallengesCompleted" ? "Challenges" : "CSRs"}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
