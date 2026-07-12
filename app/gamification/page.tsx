'use client';

import React from 'react';
import { useESG } from '../../context/ESGContext';
import { 
  Trophy, 
  Award, 
  ShoppingBag, 
  Sparkles,
  Zap, 
  ChevronRight,
  Gift,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function Gamification() {
  const { 
    currentUser, 
    badges, 
    rewards, 
    redeemReward, 
    departmentScores,
    sustainabilityGoals 
  } = useESG();

  // Handle Reward Redemption
  const handleRedeem = (id: string, name: string, cost: number) => {
    if (currentUser.points < cost) {
      alert(`Insufficient balance! You need ${cost} points to redeem "${name}", but you only have ${currentUser.points} points.`);
      return;
    }
    
    if (confirm(`Are you sure you want to redeem "${name}" for ${cost} XP Points?`)) {
      const success = redeemReward(id);
      if (success) {
        alert(`Redemption successful! ${cost} Points deducted. You have successfully claimed: ${name}.`);
      } else {
        alert('Failed to redeem item. Check stock levels or user balance.');
      }
    }
  };

  // Rank departments by total score
  const rankedDepartments = [...departmentScores].sort((a, b) => b.totalScore - a.totalScore);

  // Mock challenges data to display lifecycle
  const mockChallenges = [
    { id: 'ch1', title: 'Zero Waste Admin Floors', category: 'Waste', xp: 50, status: 'Active', difficulty: 'Medium', deadline: '2026-07-31' },
    { id: 'ch2', title: 'Electric Fleet Transition Review', category: 'Fleet', xp: 80, status: 'Under Review', difficulty: 'Hard', deadline: '2026-07-15' },
    { id: 'ch3', title: 'HVAC Shutoff Off-Hours Audit', category: 'Energy', xp: 30, status: 'Completed', difficulty: 'Easy', deadline: '2026-07-05' },
    { id: 'ch4', title: 'Solar Roof Feasibility Draft', category: 'Energy', xp: 100, status: 'Draft', difficulty: 'Hard', deadline: '2026-08-15' }
  ];

  const getChallengeStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'Under Review':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'Active':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-muted-foreground bg-card border-border';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Gamification & Eco-Incentives
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Participate in sustainability challenges, earn levels/XP, unlock badges, and redeem eco-rewards.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900/40 border border-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xl">
            SJ
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              {currentUser.name} <Sparkles className="w-4 h-4 text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">{currentUser.role} • Level {currentUser.level} Officer</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 font-mono text-center md:text-right">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Total XP Accumulation</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{currentUser.xp} <span className="text-xs text-primary">XP</span></p>
          </div>
          <div className="w-px h-10 bg-muted self-center hidden md:block"></div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Redeemable Points</p>
            <p className="text-2xl font-extrabold text-yellow-400 mt-1">{currentUser.points} <span className="text-xs">PTS</span></p>
          </div>
        </div>
      </div>

      {/* Grid: Badges & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Badges List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <Award className="w-5 h-5 text-primary" />
              Sustainability Badges
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Auto-awarded when your operational contributions satisfy target unlock rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const isUnlocked = currentUser.badges.includes(badge.id) || badge.unlocked;
              return (
                <div 
                  key={badge.id} 
                  className={`p-4 border rounded-xl flex flex-col justify-between space-y-4 transition ${
                    isUnlocked 
                      ? 'bg-card border-primary/20 shadow-lg shadow-emerald-500/5' 
                      : 'bg-background border-border opacity-40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg border ${isUnlocked ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-card border-border text-muted-foreground'}`}>
                      <Award className="w-5 h-5" />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary font-extrabold rounded uppercase font-mono">Unlocked</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 bg-card text-muted-foreground font-extrabold rounded uppercase font-mono">Locked</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-foreground tracking-wide">{badge.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{badge.description}</p>
                  </div>

                  <span className="text-[9px] text-muted-foreground font-mono block border-t border-border pt-2">
                    Rule: {badge.unlockRule}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department rankings Leaderboard */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-primary" />
              ESG Leaderboard
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time department ESG index rankings.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {rankedDepartments.map((dept, index) => (
              <div 
                key={dept.departmentId} 
                className="flex items-center justify-between p-3 bg-background border border-border rounded-xl"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    index === 1 ? 'bg-slate-300/10 text-foreground border border-slate-300/20' :
                    'bg-card text-muted-foreground border border-border'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-foreground font-semibold truncate text-[11px]">{dept.departmentName}</span>
                </div>
                <span className="font-extrabold text-foreground text-sm shrink-0">{dept.totalScore}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Redeem Catalog Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
            <Gift className="w-5 h-5 text-primary" />
            Redeemable Incentives Catalog
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Use your accumulated points balance to claim corporate sustainability rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <div 
              key={reward.id}
              className={`p-5 border rounded-2xl flex flex-col justify-between space-y-4 hover:border-border transition ${
                reward.status === 'Out of Stock' ? 'opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-background border border-border rounded-xl text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] block text-muted-foreground font-mono">POINTS</span>
                  <span className="text-sm font-extrabold text-yellow-400 font-mono">{reward.pointsRequired} PTS</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground tracking-wide">{reward.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{reward.description}</p>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className={`text-[10px] font-mono ${reward.stock > 0 ? 'text-muted-foreground' : 'text-red-400'}`}>
                  Stock: {reward.stock} units
                </span>
                
                {reward.stock > 0 ? (
                  <button
                    onClick={() => handleRedeem(reward.id, reward.name, reward.pointsRequired)}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-[10px] font-bold rounded-lg transition cursor-pointer"
                  >
                    Redeem
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-red-500 uppercase">Out of Stock</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-primary" />
            Sustainability Challenges Lifecycle
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Submit operational evidence to progress through challenge lifecycles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mockChallenges.map((ch) => (
            <div key={ch.id} className="p-4 border border-border rounded-xl space-y-3 bg-background">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] px-2 py-0.5 font-bold rounded border ${getChallengeStatusStyle(ch.status)}`}>
                  {ch.status}
                </span>
                <span className="text-[10px] text-yellow-400 font-bold font-mono">+{ch.xp} XP</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{ch.title}</h4>
                <p className="text-[9px] text-muted-foreground mt-1 uppercase font-mono">Difficulty: {ch.difficulty} | Cat: {ch.category}</p>
              </div>
              <div className="text-[9px] text-muted-foreground font-mono border-t border-border pt-2">
                Deadline: {ch.deadline}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
