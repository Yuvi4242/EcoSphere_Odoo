'use client';

import React, { useState } from 'react';
import { useESG, SustainabilityGoal } from '../../../context/ESGContext';
import { 
  Target, 
  Plus, 
  Leaf, 
  Calendar, 
  Building, 
  X,
  TrendingDown,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function SustainabilityGoals() {
  const { 
    sustainabilityGoals, 
    departments, 
    addSustainabilityGoal 
  } = useESG();

  // Modal State
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet' | 'All'>('All');
  const [targetReductionPercent, setTargetReductionPercent] = useState(15);
  const [baselineValue, setBaselineValue] = useState(4000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 90 days out
  const [departmentId, setDepartmentId] = useState('all');

  const openAddModal = () => {
    setName('');
    setCategory('All');
    setTargetReductionPercent(15);
    setBaselineValue(4000);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setDepartmentId('all');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetReductionPercent <= 0 || baselineValue <= 0 || !startDate || !endDate) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    // Target Value is baseline reduced by reduction percent
    const targetValue = Math.round(baselineValue * (1 - targetReductionPercent / 100));

    addSustainabilityGoal({
      name,
      category,
      targetReductionPercent,
      targetValue,
      baselineValue,
      startDate,
      endDate,
      departmentId
    });

    setShowModal(false);
  };

  const getDeptName = (id: string) => {
    if (id === 'all') return 'All Departments';
    return departments.find(d => d.id === id)?.name || 'Unknown Department';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Achieved':
        return <span className="text-[10px] px-2 py-0.5 font-bold rounded-full border text-primary bg-primary/10 border-primary/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Achieved</span>;
      case 'Failed':
        return <span className="text-[10px] px-2 py-0.5 font-bold rounded-full border text-red-400 bg-red-500/10 border-red-500/20 flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
      case 'Active':
        return <span className="text-[10px] px-2 py-0.5 font-bold rounded-full border text-blue-600 bg-blue-500/10 border-blue-500/20 flex items-center gap-1 animate-pulse"><Calendar className="w-3 h-3" /> Active</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 font-bold rounded-full border text-muted-foreground bg-card border-border">Draft</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Sustainability Goals & Targets
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Configure emissions caps, target reductions, and track goal completions in real time.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Set Target Goal</span>
        </button>
      </div>

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sustainabilityGoals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          const isOverLimit = goal.currentValue > goal.targetValue;
          const daysLeft = Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 3600 * 24));
          
          return (
            <div 
              key={goal.id} 
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-border transition"
            >
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-foreground text-sm tracking-wide">{goal.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-1">
                    <span className="flex items-center gap-0.5"><Building className="w-3 h-3" /> {getDeptName(goal.departmentId)}</span>
                    <span>•</span>
                    <span className="uppercase">{goal.category}</span>
                  </div>
                </div>
                {getStatusBadge(goal.status)}
              </div>

              {/* Reduction visual */}
              <div className="flex justify-between items-center bg-background border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">BASELINE</p>
                    <p className="text-xs font-bold text-foreground">{goal.baselineValue.toLocaleString()} kg</p>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-muted"></div>

                <div>
                  <p className="text-[10px] text-primary font-bold">REDUCTION TARGET</p>
                  <p className="text-sm font-extrabold text-primary">-{goal.targetReductionPercent}%</p>
                </div>

                <div className="w-px h-6 bg-muted"></div>

                <div>
                  <p className="text-[10px] text-muted-foreground">MAX BUDGET CAP</p>
                  <p className="text-xs font-bold text-foreground">{goal.targetValue.toLocaleString()} kg</p>
                </div>
              </div>

              {/* Progress Bar & Value */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Current Cumulative:</span>
                  <span className={`font-bold ${isOverLimit ? 'text-red-400' : 'text-primary'}`}>
                    {goal.currentValue.toLocaleString()} kg ({progress}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverLimit ? 'bg-red-500' : progress > 85 ? 'bg-amber-500' : 'bg-primary'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal Footer Dates */}
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono border-t border-border pt-4">
                <span>Start: {goal.startDate}</span>
                {goal.status === 'Active' ? (
                  <span className={daysLeft > 0 ? 'text-muted-foreground' : 'text-red-400 font-semibold'}>
                    {daysLeft > 0 ? `${daysLeft} days remaining` : 'Ending today'}
                  </span>
                ) : (
                  <span>Ended: {goal.endDate}</span>
                )}
                <span>End: {goal.endDate}</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Add Goal */}
      {showModal && (
        <div className="fixed inset-0 bg-background backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in font-sans">
            
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Configure Sustainability Goal
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Goal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Goal Title</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Q3 Logistics Fleet Efficiency"
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Target Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  >
                    <option value="All">All Operations</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Fleet">Fleet</option>
                    <option value="Expense">Expense</option>
                    <option value="Purchase">Purchase</option>
                  </select>
                </div>

                {/* Department Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Department</label>
                  <select 
                    value={departmentId} 
                    onChange={(e) => setDepartmentId(e.target.value)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Baseline value */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Baseline Carbon (kg CO₂)</label>
                  <input 
                    type="number" 
                    value={baselineValue || ''} 
                    onChange={(e) => setBaselineValue(parseFloat(e.target.value) || 0)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* Target reduction percentage */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Target Reduction (%)</label>
                  <input 
                    type="number" 
                    value={targetReductionPercent || ''} 
                    onChange={(e) => setTargetReductionPercent(parseFloat(e.target.value) || 0)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                  <input 
                    type="date"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                  <input 
                    type="date"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Target Calculation message */}
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-xl font-mono text-[10px] text-muted-foreground flex flex-col gap-1">
                <span className="font-bold text-foreground uppercase text-[9px] tracking-wider">Dynamic Calculation summary:</span>
                <span>• Allowed emissions target budget limit: <strong className="text-primary">{Math.round(baselineValue * (1 - targetReductionPercent / 100))} kg CO₂e</strong></span>
                <span>• A reduction of {Math.round(baselineValue * (targetReductionPercent / 100))} kg CO₂e relative to baseline.</span>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  Configure Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
