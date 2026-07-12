'use client';

import React, { useState } from 'react';
import { useESG, Department } from '../../context/ESGContext';
import { 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  Building, 
  Bell, 
  Scale, 
  Plus,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function SettingsAdmin() {
  const { 
    settings, 
    updateSettings, 
    departments, 
    addDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useESG();

  // Tabs state
  const [activeTab, setActiveTab] = useState<'weights' | 'toggles' | 'departments'>('weights');

  // Weights Form States
  const [envWeight, setEnvWeight] = useState(settings.weights.environmental);
  const [socWeight, setSocWeight] = useState(settings.weights.social);
  const [govWeight, setGovWeight] = useState(settings.weights.governance);
  const [weightsError, setWeightsError] = useState('');

  // Department Form States
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [employeeCount, setEmployeeCount] = useState(50);
  const [carbonBudget, setCarbonBudget] = useState(5000);

  // Handle Weights Save
  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = envWeight + socWeight + govWeight;
    if (sum !== 100) {
      setWeightsError(`Weights must add up to exactly 100%. Currently they sum to ${sum}%.`);
      return;
    }
    
    setWeightsError('');
    updateSettings({
      weights: {
        environmental: envWeight,
        social: socWeight,
        governance: govWeight
      }
    });
    alert('ESG Weightings successfully updated! Department scores and overall ESG ratings will update immediately.');
  };

  // Handle Toggle Switch
  const handleToggle = (key: 'autoEmission' | 'evidenceRequired' | 'badgeAutoAward') => {
    updateSettings({
      [key]: !settings[key]
    });
  };

  // Handle Notifications Toggle
  const handleNotifToggle = (key: 'email' | 'inApp' | 'complianceAlerts' | 'badgeAlerts' | 'goalAlerts') => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  // Handle Department Add
  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim() || !deptHead.trim() || employeeCount <= 0 || carbonBudget <= 0) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    addDepartment({
      name: deptName,
      code: deptCode.toUpperCase(),
      head: deptHead,
      employeeCount,
      carbonBudget,
      status: 'Active'
    });

    setShowDeptModal(false);
  };

  const handleDeleteDept = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the department "${name}"? Active carbon transactions and scores for this department will be disconnected.`)) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings & Administration
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Configure ESG calculation metrics, organizational layout structures, and automation rules.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border gap-1.5">
        <button
          onClick={() => setActiveTab('weights')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'weights' 
              ? 'border-emerald-400 text-primary font-extrabold' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            <span>ESG Weightings</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('toggles')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'toggles' 
              ? 'border-emerald-400 text-primary font-extrabold' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            <span>Operational Rules & Toggles</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'departments' 
              ? 'border-emerald-400 text-primary font-extrabold' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            <span>Departments Setup</span>
          </div>
        </button>
      </div>

      {/* Tab Contents: Weights */}
      {activeTab === 'weights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weights adjustment Form */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Configure Pillar Weightings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set how the aggregated ESG score is calculated from individual module performance metrics.
              </p>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Environmental Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-foreground">Environmental Weight</label>
                    <span className="font-bold text-primary">{envWeight}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={envWeight} 
                    onChange={(e) => setEnvWeight(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                {/* Social Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-foreground">Social Weight</label>
                    <span className="font-bold text-blue-600">{socWeight}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={socWeight} 
                    onChange={(e) => setSocWeight(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-blue-400"
                  />
                </div>

                {/* Governance Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-foreground">Governance Weight</label>
                    <span className="font-bold text-purple-600">{govWeight}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={govWeight} 
                    onChange={(e) => setGovWeight(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>

              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center p-4 bg-background border border-border rounded-xl font-mono text-xs">
                <span className="text-muted-foreground">Total Sum:</span>
                <span className={`font-bold ${envWeight + socWeight + govWeight === 100 ? 'text-primary' : 'text-red-400'}`}>
                  {envWeight + socWeight + govWeight}% / 100%
                </span>
              </div>

              {weightsError && (
                <div className="p-3.5 bg-red-500/5 border border-red-500/10 text-xs text-red-400 rounded-xl flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{weightsError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={envWeight + socWeight + govWeight !== 100}
                className={`px-4 py-2 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer ${
                  envWeight + socWeight + govWeight === 100
                    ? 'bg-primary hover:bg-emerald-600 text-slate-950'
                    : 'bg-muted text-slate-650 cursor-not-allowed border border-border'
                }`}
              >
                Save Weightings
              </button>

            </form>
          </div>

          {/* Explanation panel */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-foreground text-sm">Calculations Info</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              EcoSphere computes the Overall ESG Rating as a weighted average. The weights dictate how sensitive the overall company index is to carbon transaction audits (Environmental), community participations (Social), and EPA audit compliance violations (Governance).
            </p>
            <div className="p-3 bg-primary/5 border border-primary/10 text-[10px] text-muted-foreground rounded-xl leading-relaxed">
              <strong>Tip:</strong> If Environmental goals are the highest priority this fiscal quarter, adjust the Environmental weight to a higher value (e.g. 50%).
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Operational Rules */}
      {activeTab === 'toggles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rules and toggles */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Operational Policies & Activations</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle automation and validation checks on/off across EcoSphere modules.</p>
            </div>

            <div className="divide-y divide-slate-850 space-y-4">
              {/* Auto Emission Toggle */}
              <div className="flex justify-between items-center py-4 first:pt-0">
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Auto Emission Calculation</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Automatically calculate carbon CO₂ emissions from linked purchase, manufacturing, fleet or expense tickets upon ERP processing using configured emission factors.
                  </p>
                </div>
                <button onClick={() => handleToggle('autoEmission')} className="cursor-pointer">
                  {settings.autoEmission ? (
                    <ToggleRight className="w-12 h-12 text-primary" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Evidence Requirement Toggle */}
              <div className="flex justify-between items-center py-4">
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Evidence Attachment Requirement</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Do not allow approval of Employee CSR activities or challenge participation without an uploaded proof file (e.g., photo or PDF certificate).
                  </p>
                </div>
                <button onClick={() => handleToggle('evidenceRequired')} className="cursor-pointer">
                  {settings.evidenceRequired ? (
                    <ToggleRight className="w-12 h-12 text-primary" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Badge Auto-Award Toggle */}
              <div className="flex justify-between items-center py-4 last:pb-0">
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Badge Auto-Award</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Auto-grant gamification badges and unlock notifications immediately when employee XP or completed challenge metrics satisfy the unlock requirements.
                  </p>
                </div>
                <button onClick={() => handleToggle('badgeAutoAward')} className="cursor-pointer">
                  {settings.badgeAutoAward ? (
                    <ToggleRight className="w-12 h-12 text-primary" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Notification System config */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Notifications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle alert preferences.</p>
            </div>

            <div className="space-y-4 text-xs font-semibold text-foreground">
              <div className="flex justify-between items-center">
                <span>In-App Notifications</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.inApp} 
                  onChange={() => handleNotifToggle('inApp')}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-emerald-500 focus:ring-offset-background cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Email Alerts</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.email} 
                  onChange={() => handleNotifToggle('email')}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-emerald-500 focus:ring-offset-background cursor-pointer"
                />
              </div>

              <div className="w-full h-px bg-muted my-2"></div>

              <div className="flex justify-between items-center">
                <span>EPA/Compliance Violation Alerts</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.complianceAlerts} 
                  onChange={() => handleNotifToggle('complianceAlerts')}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-emerald-500 focus:ring-offset-background cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Gamification Badges Alerts</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.badgeAlerts} 
                  onChange={() => handleNotifToggle('badgeAlerts')}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-emerald-500 focus:ring-offset-background cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Sustainability Goals Alerts</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications.goalAlerts} 
                  onChange={() => handleNotifToggle('goalAlerts')}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-emerald-500 focus:ring-offset-background cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Departments list */}
      {activeTab === 'departments' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Organizational Departments Setup</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Manage hierarchical departments, employees count, and carbon budget caps.</p>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono">
                  <th className="pb-3.5 font-medium">Department Name</th>
                  <th className="pb-3.5 font-medium">Code</th>
                  <th className="pb-3.5 font-medium">Department Head</th>
                  <th className="pb-3.5 font-medium text-center">Employees</th>
                  <th className="pb-3.5 font-medium text-right">Carbon Budget Limit</th>
                  <th className="pb-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-foreground">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-card">
                    <td className="py-4 font-semibold text-foreground">{dept.name}</td>
                    <td className="py-4 font-mono text-muted-foreground">{dept.code}</td>
                    <td className="py-4 text-muted-foreground">{dept.head}</td>
                    <td className="py-4 text-center">{dept.employeeCount}</td>
                    <td className="py-4 text-right font-mono font-bold text-primary">{dept.carbonBudget.toLocaleString()} kg CO₂</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteDept(dept.id, dept.name)}
                        className="p-1.5 text-muted-foreground hover:text-red-400 bg-card hover:bg-card border border-border rounded-lg text-xs transition cursor-pointer"
                        title="Delete Department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Department */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-background backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in font-sans">
            
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Create New Department
              </h2>
              <button onClick={() => setShowDeptModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddDeptSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Dept Code */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">Dept Code</label>
                  <input 
                    type="text" 
                    value={deptCode} 
                    onChange={(e) => setDeptCode(e.target.value)} 
                    placeholder="HR"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition uppercase"
                    maxLength={6}
                    required
                  />
                </div>

                {/* Dept Name */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Department Name</label>
                  <input 
                    type="text" 
                    value={deptName} 
                    onChange={(e) => setDeptName(e.target.value)} 
                    placeholder="e.g. Human Resources"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Head of Dept */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Department Head</label>
                <input 
                  type="text" 
                  value={deptHead} 
                  onChange={(e) => setDeptHead(e.target.value)} 
                  placeholder="e.g. Robert Chen"
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Employee Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Employee Count</label>
                  <input 
                    type="number" 
                    value={employeeCount || ''} 
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)} 
                    placeholder="40"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>

                {/* Carbon Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Carbon Budget (kg CO₂)</label>
                  <input 
                    type="number" 
                    value={carbonBudget || ''} 
                    onChange={(e) => setCarbonBudget(parseFloat(e.target.value) || 0)} 
                    placeholder="6000"
                    className="w-full bg-background border border-border focus:border-primary rounded-xl px-3.5 py-2 text-sm text-foreground focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
