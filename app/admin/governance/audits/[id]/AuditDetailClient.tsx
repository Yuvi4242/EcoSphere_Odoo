'use client';

import React, { useState } from 'react';
import { useToast } from '@/app/_components/ui/Toast';
import { addAuditFinding, resolveAuditFinding, updateAudit } from '@/app/_actions/governance';
import { StatusBadge, PriorityBadge } from '@/app/_components/governance/BadgeHelpers';
import { formatDate } from '@/app/_lib/utils';
import {
  Calendar,
  Plus,
  ArrowLeft,
  Award,
  ListTodo,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

interface Finding {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  assignedTo: string;
  assignee?: { id: string; name: string | null; email: string | null } | null;
  resolvedAt?: string | Date | null;
}

interface Audit {
  id: string;
  title: string;
  departmentId: string;
  department?: { id: string; name: string } | null;
  auditorId: string;
  auditor?: { id: string; name: string | null; email: string | null } | null;
  auditDate: any; // Checked dynamically or converted on save
  status: string;
  riskLevel: string;
  overallScore?: number | null;
  recommendation?: string | null;
  summary?: string | null;
  findings?: Finding[];
}

interface User {
  id: string;
  name: string | null;
}

export default function AuditDetailClient({
  audit,
  users,
  currentUserRole,
  currentUserId
}: {
  audit: Audit;
  users: User[];
  currentUserRole: string;
  currentUserId: string;
}) {
  const { showToast } = useToast();
  const auditData = audit;
  const findings = audit.findings || [];
  
  // Form values for new finding
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState('Medium');
  const [newAssignee, setNewAssignee] = useState('');
  const [submittingFinding, setSubmittingFinding] = useState(false);

  // Form values for audit score update
  const [overallScore, setOverallScore] = useState(audit.overallScore || '');
  const [recommendation, setRecommendation] = useState(audit.recommendation || '');
  const [updatingAuditFlag, setUpdatingAuditFlag] = useState(false);

  // Checklist tasks (Simulated checklist for the auditor)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Verify site gas emission meter certificates', checked: true },
    { id: 2, text: 'Perform visual inspection of Boiler 3 sealing valves', checked: audit.status === 'Completed' },
    { id: 3, text: 'Confirm employee compliance training logs are filled', checked: true },
    { id: 4, text: 'Cross-reference grid power statements with ERP system logs', checked: audit.status === 'Completed' },
    { id: 5, text: 'Verify physical sorting bins across all manufacturing levels', checked: false }
  ]);

  const canManage = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER' || audit.auditorId === currentUserId;

  const handleToggleChecklist = (id: number) => {
    if (!canManage) return;
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAssignee) return;

    setSubmittingFinding(true);
    try {
      await addAuditFinding(auditData.id, {
        title: newTitle,
        description: newDescription,
        severity: newSeverity,
        assignedTo: newAssignee
      });
      showToast('Audit finding logged successfully!');
      
      // Reload details
      window.location.reload();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add audit finding.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmittingFinding(false);
    }
  };

  const handleResolveFinding = async (findingId: string) => {
    // Check if user is authorized (Admin, Manager, or Assigned user)
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) return;

    if (!canManage && finding.assignedTo !== currentUserId) {
      showToast('You are not authorized to resolve this finding. It is assigned to another user.', 'error');
      return;
    }

    try {
      await resolveAuditFinding(findingId);
      showToast('Finding resolved successfully!');
      window.location.reload();
    } catch (err) {
      showToast('Failed to resolve finding.', 'error');
    }
  };

  const handleCompleteAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overallScore) {
      showToast('Please enter an overall valuation score for this audit.', 'error');
      return;
    }

    setUpdatingAuditFlag(true);
    try {
      await updateAudit(auditData.id, {
        title: auditData.title,
        departmentId: auditData.departmentId,
        auditorId: auditData.auditorId,
        auditDate: auditData.auditDate,
        status: 'Completed',
        riskLevel: auditData.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
        overallScore: Number(overallScore),
        recommendation,
        summary: auditData.summary
      });
      showToast('Audit marked completed successfully!');
      window.location.reload();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete audit.';
      showToast(errorMsg, 'error');
    } finally {
      setUpdatingAuditFlag(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/governance/audits"
          className="p-2 bg-surface hover:bg-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Internal Audit Session Detail
          </span>
          <h2 className="text-2xl font-black text-text-primary leading-tight">{auditData.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Panel details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metadata parameters */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-bold text-text-primary">Audit Executive Overview</h3>
              <div className="flex items-center gap-2">
                <StatusBadge status={auditData.status} />
              </div>
            </div>

            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {auditData.summary || 'Overview of target departments processes, checking safety checklist compliance, and emissions budgets.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Risk Level</span>
                <div className="mt-1">
                  <PriorityBadge priority={auditData.riskLevel} />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Session Date</span>
                <p className="text-sm font-bold text-text-primary mt-0.5 flex items-center gap-1">
                  <Calendar size={13} className="text-text-muted" />
                  {formatDate(auditData.auditDate.toISOString())}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Department</span>
                <p className="text-sm font-bold text-text-primary mt-0.5">{auditData.department?.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Valuation Score</span>
                <p className="text-sm font-bold text-text-primary mt-0.5 flex items-center gap-1.5">
                  <Award size={14} className="text-env" />
                  {auditData.overallScore !== null ? `${auditData.overallScore}%` : 'Pending valuation'}
                </p>
              </div>
            </div>
          </div>

          {/* Audit checklist */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-1.5">
              <ListTodo size={16} className="text-gov" /> Audit Evaluation Checklist
            </h3>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 border rounded-xl select-none transition-all ${
                    item.checked ? 'bg-env-light/10 border-env/20' : 'bg-surface border-border'
                  } ${canManage ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleToggleChecklist(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="w-4 h-4 text-gov border-border rounded focus:ring-gov mt-0.5"
                  />
                  <span className={`text-xs font-semibold ${item.checked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Audit findings */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-red-500 animate-pulse" /> Critical Findings Log
            </h3>
            {findings.length === 0 ? (
              <p className="text-xs text-text-muted py-4">No audit findings logged. Excellent compliance health.</p>
            ) : (
              <div className="space-y-4">
                {findings.map((f) => (
                  <div key={f.id} className="p-4 border border-border bg-bg/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-text-primary">{f.title}</h4>
                        <PriorityBadge priority={f.severity} />
                        <StatusBadge status={f.status} />
                      </div>
                      <p className="text-xs text-text-muted mt-1 leading-normal">{f.description}</p>
                      <span className="text-[10px] font-mono text-text-muted mt-2 block">
                        Assigned to: {f.assignee?.name || 'User ID ' + f.assignedTo} {f.resolvedAt && `· Resolved: ${new Date(f.resolvedAt).toLocaleDateString()}`}
                      </span>
                    </div>

                    {f.status === 'Open' && (
                      <button
                        onClick={() => handleResolveFinding(f.id)}
                        className="px-3.5 py-2 bg-env hover:bg-[#147a45] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                      >
                        Resolve Issue
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auditor side panels */}
        <div className="space-y-6">
          {/* Auditor Profile */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4 font-bold">Assigned Auditor</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-light text-gov font-bold flex items-center justify-center">
                {auditData.auditor?.name?.slice(0, 2).toUpperCase() || 'AU'}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{auditData.auditor?.name || 'Unassigned'}</p>
                <p className="text-xs text-text-muted">{auditData.auditor?.email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Audit Valuation Form (If auditor and not completed yet) */}
          {canManage && auditData.status !== 'Completed' && (
            <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3">Conclude and Score Audit</h3>
              <form onSubmit={handleCompleteAudit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Valuation Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    placeholder="e.g. 92"
                    value={overallScore}
                    onChange={(e) => setOverallScore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Recommendations</label>
                  <textarea
                    rows={3}
                    placeholder="Auditing instructions or mandatory changes..."
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updatingAuditFlag || !overallScore}
                  className="w-full py-2 bg-env hover:bg-[#147a45] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  Conclude Session
                </button>
              </form>
            </div>
          )}

          {/* Log Audit Finding */}
          {canManage && (
            <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3">Log Audit Finding</h3>
              <form onSubmit={handleAddFinding} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Finding Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boiler log variance"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Log detail reports..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-text-muted mb-1">Severity</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value)}
                      className="w-full p-2 border border-border bg-surface rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-text-muted mb-1">Assignee</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      required
                      className="w-full p-2 border border-border bg-surface rounded-xl text-xs focus:outline-none"
                    >
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submittingFinding || !newTitle || !newAssignee}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus size={12} /> Log Finding
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
