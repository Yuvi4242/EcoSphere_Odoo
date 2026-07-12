'use client';

import React from 'react';
import { useESG } from '../../context/ESGContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  User, 
  Calendar,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export default function GovernanceModule() {
  const { 
    complianceIssues, 
    resolveComplianceIssue, 
    acknowledgePolicy,
    currentUser 
  } = useESG();

  // Policies mock list
  const mockPolicies = [
    { name: 'Zero-Waste Procurement Policy', id: 'pol_1', department: 'Purchasing', version: 'v2.1' },
    { name: 'EPA Air Emissions Guidelines', id: 'pol_2', department: 'Operations', version: 'v1.4' },
    { name: 'Employee Eco-Action Code of Conduct', id: 'pol_3', department: 'HR', version: 'v3.0' }
  ];

  const activeIssues = complianceIssues.filter(c => c.status === 'Open');
  const resolvedIssues = complianceIssues.filter(c => c.status === 'Resolved');

  const handleResolve = (id: string, name: string) => {
    if (confirm(`Mark compliance issue "${name}" as resolved?`)) {
      resolveComplianceIssue(id);
    }
  };

  const handleAcknowledge = (name: string) => {
    acknowledgePolicy(name);
    alert(`Thank you! Policy "${name}" has been acknowledged. 10 XP/Points awarded to your ESG profile.`);
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical':
      case 'High':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          Governance & Compliance
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          EPA audits, corporate sustainability policies, compliance tracker, and operational governance.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Open violations */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">ACTIVE VIOLATIONS</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {activeIssues.length} <span className="text-xs text-muted-foreground">open issue{activeIssues.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>
            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground">
            {activeIssues.length > 0 ? (
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Requires immediate remediation
              </span>
            ) : (
              <span className="text-primary font-semibold">All systems compliant</span>
            )}
          </div>
        </div>

        {/* Resolved violations */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">RESOLVED AUDITS</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {resolvedIssues.length} <span className="text-xs text-muted-foreground">resolved</span>
              </h3>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground">
            <span>Remediation speed average: 4 days</span>
          </div>
        </div>

        {/* Policy Acknowledgments */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">POLICY ACKNOWLEDGMENTS</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                92% <span className="text-xs text-muted-foreground">completion rate</span>
              </h3>
            </div>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground">
            <span>258 employees signed</span>
          </div>
        </div>
      </div>

      {/* Grid: Compliance Tracker & Corporate Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compliance Issues list */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <ClipboardList className="w-5 h-5 text-purple-600" />
              Compliance Issues Log
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">EPA environmental audit logs, violation issues, and operational owners.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono">
                  <th className="pb-3 font-medium">Audit Incident</th>
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Owner</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-foreground">
                {complianceIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No compliance incidents logged.
                    </td>
                  </tr>
                ) : (
                  complianceIssues.map((issue) => {
                    const today = new Date();
                    const isOverdue = new Date(issue.dueDate) < today && issue.status === 'Open';
                    return (
                      <tr key={issue.id} className="hover:bg-card">
                        <td className="py-4">
                          <div>
                            <p className="font-semibold text-foreground">{issue.auditName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-xs truncate">{issue.description}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getSeverityStyle(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-foreground">
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-muted-foreground" /> {issue.owner}</span>
                        </td>
                        <td className="py-4 font-mono">
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-bold' : 'text-muted-foreground'}`}>
                            <Calendar className="w-3 h-3" /> {issue.dueDate} 
                            {isOverdue && <span className="text-[9px] px-1 bg-red-500/10 border border-red-500/20 rounded ml-1 uppercase animate-pulse">Overdue</span>}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {issue.status === 'Resolved' ? (
                            <span className="text-primary font-bold flex items-center justify-end gap-1"><CheckCircle className="w-3.5 h-3.5" /> Resolved</span>
                          ) : (
                            <button
                              onClick={() => handleResolve(issue.id, issue.auditName)}
                              className="px-2.5 py-1 bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold rounded-lg text-[10px] transition cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Policies Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-purple-600" />
              Corporate ESG Policies
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Acknowledge corporate compliance rules.</p>
          </div>

          <div className="space-y-4">
            {mockPolicies.map((pol) => (
              <div 
                key={pol.id} 
                className="p-4 border border-border rounded-xl bg-background space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] px-1.5 py-0.5 bg-card border border-border rounded font-mono text-muted-foreground">{pol.version}</span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase">{pol.department}</span>
                </div>
                <h4 className="text-xs font-bold text-foreground leading-snug">{pol.name}</h4>
                
                <button
                  onClick={() => handleAcknowledge(pol.name)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 bg-card hover:bg-muted border border-border hover:border-slate-700 text-[10px] font-bold text-purple-600 rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Acknowledge Policy</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
