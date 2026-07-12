'use client';

import React from 'react';
import { useESG } from '../../context/ESGContext';
import Link from 'next/link';
import { 
  Leaf, 
  TrendingUp, 
  Target, 
  Building, 
  FileSpreadsheet, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function EnvironmentalDashboard() {
  const { 
    carbonTransactions, 
    sustainabilityGoals, 
    departmentScores, 
    departments 
  } = useESG();

  // 1. KPI: Total Carbon Footprint (kg CO2e)
  const totalEmissions = carbonTransactions.reduce((sum, tx) => sum + tx.calculatedEmissions, 0);

  // 2. KPI: Active Goals count
  const activeGoals = sustainabilityGoals.filter(g => g.status === 'Active');
  
  // 3. KPI: Average Department Environmental Score
  const avgEnvScore = Math.round(
    departmentScores.reduce((sum, d) => sum + d.environmentalScore, 0) / departmentScores.length
  ) || 0;

  // 4. KPI: Carbon Intensity (kg CO2 per employee)
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const carbonIntensity = totalEmployees > 0 ? Math.round(totalEmissions / totalEmployees) : 0;

  // CHART DATA: Monthly Trend
  // Let's extract month and aggregate. Since mock data is in July, we'll map dates.
  // To make it look nice, we'll map actual dates in a chronologically ordered list.
  const getMonthlyData = () => {
    const dataMap: { [key: string]: number } = {};
    carbonTransactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataMap[month] = (dataMap[month] || 0) + tx.calculatedEmissions;
    });
    // Sort keys chronologically
    return Object.keys(dataMap)
      .sort((a, b) => new Date(a + ' 2026').getTime() - new Date(b + ' 2026').getTime())
      .map(key => ({
        date: key,
        Emissions: Math.round(dataMap[key])
      }));
  };

  const monthlyChartData = getMonthlyData();

  // CHART DATA: Emissions by Department
  const departmentChartData = departmentScores.map(d => ({
    name: d.departmentName.split(' ')[0],
    Emissions: d.emissions
  }));

  // CHART DATA: Category Breakdown
  const getCategoryData = () => {
    const categories: { [key: string]: number } = {};
    carbonTransactions.forEach(tx => {
      categories[tx.category] = (categories[tx.category] || 0) + tx.calculatedEmissions;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      value: parseFloat(categories[cat].toFixed(1))
    }));
  };

  const categoryChartData = getCategoryData();

  // Colors for Category Pie Chart
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#a855f7'];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Module Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            Environmental Module
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Carbon accounting, emissions tracking, emission factors, and target goals management.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/environmental/transactions"
            className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border hover:border-slate-700 text-foreground text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Transactions Log</span>
          </Link>
          <Link
            href="/environmental/goals"
            className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Emissions */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">TOTAL EMISSIONS</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {Math.round(totalEmissions).toLocaleString()} <span className="text-xs text-muted-foreground">kg CO₂e</span>
              </h3>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold">-4.2%</span>
            <span>from previous month</span>
          </div>
        </div>

        {/* Avg Environmental Score */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">AVG ENVIRONMENTAL SCORE</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {avgEnvScore} <span className="text-xs text-muted-foreground">/100</span>
              </h3>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="text-primary font-medium">B+ Rating</span>
            <span>across all 4 departments</span>
          </div>
        </div>

        {/* Active Goals */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">SUSTAINABILITY GOALS</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {activeGoals.length} <span className="text-xs text-muted-foreground">Active</span>
              </h3>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="text-yellow-400 font-semibold">{sustainabilityGoals.filter(g => g.status === 'Achieved').length} Goal{sustainabilityGoals.filter(g => g.status === 'Achieved').length !== 1 ? 's' : ''} Achieved</span>
          </div>
        </div>

        {/* Carbon Intensity */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">CARBON INTENSITY</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {carbonIntensity} <span className="text-xs text-muted-foreground">kg CO₂e/emp</span>
              </h3>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Based on 280 active employees</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Emissions Trend */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Monthly Emissions Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Aggregated carbon footprint in kg CO₂e over time</p>
          </div>
          <div className="h-64 w-full">
            {monthlyChartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No transaction data logged.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1c1c1c', fontSize: 11 }}
                    itemStyle={{ fontSize: 10 }}
                  />
                  <Area type="monotone" dataKey="Emissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Source Categories Breakdown (Pie Chart) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Emissions by Source</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Proportional footprint of operations categories</p>
          </div>
          
          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Absolute labels */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">Breakdown</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">By Module</span>
            </div>
          </div>

          {/* Legends */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {categoryChartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-muted-foreground truncate">{entry.name}:</span>
                <span className="text-foreground font-bold">{Math.round((entry.value / totalEmissions) * 100) || 0}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Goals Overview & Department Emissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sustainability Goals Snippet */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Goals Progress</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Tracking current operational values against goals</p>
            </div>
            <Link href="/environmental/goals" className="text-xs text-primary font-semibold hover:text-primary flex items-center gap-0.5">
              <span>All Goals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">No active goals configured.</div>
            ) : (
              activeGoals.slice(0, 3).map((goal, index) => {
                const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                // If it is an emissions limit goal (e.g. keep under X), higher progress is actually bad,
                // but let's represent it clearly. E.g. emissions are at 80% of the maximum cap.
                const isOverLimit = goal.currentValue > goal.targetValue;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{goal.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-2 font-mono uppercase">({goal.category})</span>
                      </div>
                      <span className={`font-mono font-bold ${isOverLimit ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
                        {goal.currentValue} / {goal.targetValue} kg CO₂e ({progress}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverLimit ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Department Carbon comparison chart */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Carbon Footprint by Department</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Comparative absolute carbon footprint (kg CO₂e)</p>
          </div>
          
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: 10 }}
                />
                <Bar dataKey="Emissions" fill="#10b981" radius={[3, 3, 0, 0]}>
                  {departmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#a855f7' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
