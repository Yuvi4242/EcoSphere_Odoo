'use client';

import React, { useState } from 'react';
import { useESG, CarbonTransaction } from '../../../context/ESGContext';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Truck, 
  Flame, 
  ShoppingBag, 
  Database,
  X,
  Play,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function CarbonTransactions() {
  const { 
    carbonTransactions, 
    emissionFactors, 
    departments, 
    mockErpRecords, 
    processErpRecord, 
    addManualTransaction,
    settings 
  } = useESG();

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet'>('Manufacturing');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [emissionFactorId, setEmissionFactorId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  // When category changes, reset selected emission factor to the first matching one
  React.useEffect(() => {
    const matchingFactors = emissionFactors.filter(ef => ef.category === category && ef.status === 'Active');
    if (matchingFactors.length > 0) {
      setEmissionFactorId(matchingFactors[0].id);
    } else {
      setEmissionFactorId('');
    }
  }, [category, emissionFactors]);

  // Open modal
  const openManualModal = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Manufacturing');
    setDescription('');
    setValue(0);
    setDepartmentId(departments[0]?.id || '');
    setShowModal(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || value <= 0 || !emissionFactorId || !departmentId) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    addManualTransaction({
      date,
      category,
      description,
      value,
      emissionFactorId,
      departmentId
    });

    setShowModal(false);
  };

  // Processing ERP click handler
  const handleProcessErp = (recordId: string, description: string) => {
    if (!settings.autoEmission) {
      alert(`Cannot auto-calculate emissions: "Auto Emission Calculation" is disabled in settings. Enable it first under Settings & Admin, or log manual transactions.`);
      return;
    }

    const success = processErpRecord(recordId);
    if (!success) {
      alert(`Failed to process ERP record: No matching active Emission Factor found for this operational category.`);
    }
  };

  // Filter logic
  const filteredTransactions = carbonTransactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || tx.departmentId === selectedDept;
    const matchesCat = selectedCat === 'all' || tx.category === selectedCat;
    return matchesSearch && matchesDept && matchesCat;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Manufacturing':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Fleet':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Expense':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Purchase':
        return <ShoppingBag className="w-4 h-4 text-purple-600" />;
      default:
        return <Database className="w-4 h-4 text-primary" />;
    }
  };

  const getDeptName = (id: string) => {
    return departments.find(d => d.id === id)?.name || 'Unknown Department';
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            Carbon Transactions Ledger
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Log manual operational activities or connect ERP queues to run auto emission audits.
          </p>
        </div>
        <button
          onClick={openManualModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Carbon Activity</span>
        </button>
      </div>

      {/* Auto Emission Queue (Simulating ERP integration) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              ERP Operational Queue
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              settings.autoEmission 
                ? 'text-primary bg-primary/10 border border-primary/20' 
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}>
              Auto-Calculation: {settings.autoEmission ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Simulate day-to-day business operations (purchases, logs, fleets) feeding into the carbon accounting engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockErpRecords.map((record) => (
            <div 
              key={record.id} 
              className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition ${
                record.status === 'Processed' 
                  ? 'bg-background border-border opacity-60' 
                  : 'bg-card border-border hover:border-slate-750'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 bg-background border border-border rounded-lg shrink-0`}>
                  {getCategoryIcon(record.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{record.description}</p>
                  <div className="flex gap-2 items-center text-[10px] text-muted-foreground font-mono mt-0.5">
                    <span>{record.date}</span>
                    <span>•</span>
                    <span className="text-primary">{record.value} {record.unit}</span>
                    <span>•</span>
                    <span className="truncate">{getDeptName(record.departmentId)}</span>
                  </div>
                </div>
              </div>

              {record.status === 'Processed' ? (
                <div className="flex items-center gap-1 text-primary text-xs font-semibold shrink-0">
                  <CheckCircle className="w-4 h-4" />
                  <span>Processed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleProcessErp(record.id, record.description)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer ${
                    settings.autoEmission
                      ? 'bg-primary hover:bg-emerald-600 text-slate-950'
                      : 'bg-muted hover:bg-slate-700 text-muted-foreground'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Process</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none transition"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-background border border-border focus:border-primary rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-background border border-border focus:border-primary rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Fleet">Fleet</option>
              <option value="Expense">Expense</option>
              <option value="Purchase">Purchase</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-mono">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Activity Category</th>
                <th className="pb-3 font-medium">Details</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium text-right">Activity Value</th>
                <th className="pb-3 font-medium text-right">CO₂ Emission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-foreground">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No transactions found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-card">
                    <td className="py-4 font-mono text-muted-foreground">{tx.date}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <span className="p-1 bg-background border border-border rounded">
                          {getCategoryIcon(tx.category)}
                        </span>
                        <span>{tx.category}</span>
                      </div>
                    </td>
                    <td className="py-4 max-w-xs truncate">
                      <div>
                        <p className="font-semibold text-foreground">{tx.description}</p>
                        {tx.sourceRecordId && (
                          <span className="text-[9px] px-1 bg-primary/10 text-primary rounded font-mono">Auto</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{getDeptName(tx.departmentId)}</td>
                    <td className="py-4 text-right font-mono">
                      <p className="text-foreground font-bold">{tx.value.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground">{tx.unit}</p>
                    </td>
                    <td className="py-4 text-right">
                      <p className="text-primary font-extrabold font-mono">{Math.round(tx.calculatedEmissions).toLocaleString()} kg</p>
                      <p className="text-[9px] text-muted-foreground font-mono">@ {tx.emissionFactorRate} CO₂ rate</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual log Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in font-sans">
            
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Log Carbon Transaction
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Date</label>
                  <input 
                    type="date"
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Fleet">Fleet</option>
                    <option value="Expense">Expense</option>
                    <option value="Purchase">Purchase</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="e.g. Semi-truck fuel refilling log"
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  required
                />
              </div>

              {/* Department Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Department</label>
                <select 
                  value={departmentId} 
                  onChange={(e) => setDepartmentId(e.target.value)} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Activity Quantity</label>
                  <input 
                    type="number" 
                    value={value || ''} 
                    onChange={(e) => setValue(parseFloat(e.target.value) || 0)} 
                    placeholder="150"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* Emission Factor Applied */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Emission Factor</label>
                  <select 
                    value={emissionFactorId} 
                    onChange={(e) => setEmissionFactorId(e.target.value)} 
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  >
                    {emissionFactors
                      .filter(ef => ef.category === category && ef.status === 'Active')
                      .map(ef => (
                        <option key={ef.id} value={ef.id}>{ef.name} ({ef.unit})</option>
                      ))}
                    {emissionFactors.filter(ef => ef.category === category && ef.status === 'Active').length === 0 && (
                      <option value="">No Active Factor Found</option>
                    )}
                  </select>
                </div>
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
                  disabled={!emissionFactorId}
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer ${
                    emissionFactorId
                      ? 'bg-primary hover:bg-emerald-600 text-slate-950'
                      : 'bg-muted text-slate-650 cursor-not-allowed'
                  }`}
                >
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
