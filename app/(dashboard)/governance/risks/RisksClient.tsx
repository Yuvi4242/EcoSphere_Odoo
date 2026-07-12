'use client';

import React, { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import { RiskMatrix } from '@/app/_components/governance/RiskComponents';
import { PriorityBadge } from '@/app/_components/governance/BadgeHelpers';
import { Search, Plus, Trash2, Edit, X, ShieldAlert } from 'lucide-react';
import { createRiskAssessment, deleteRiskAssessment, updateRiskAssessment } from '@/app/_actions/governance';
import { useToast } from '@/app/_components/ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiskAssessmentSchema, RiskAssessmentInput } from '@/app/_lib/governance-validation';

interface RiskAssessment {
  id: string;
  departmentId: string;
  department?: { id: string; name: string } | null;
  title: string;
  description: string;
  riskLevel: string;
  mitigationPlan?: string | null;
  ownerId: string;
  owner?: { name: string | null } | null;
  impact: string | null;
  probability: string | null;
  status: string | null;
}

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
}

export default function RisksClient({
  initialRisks,
  departments,
  users,
  userRole
}: {
  initialRisks: RiskAssessment[];
  departments: Department[];
  users: User[];
  userRole: string;
}) {
  const { showToast } = useToast();
  const [risks, setRisks] = useState<RiskAssessment[]>(initialRisks);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const canManage = userRole === 'ADMIN' || userRole === 'MANAGER';

  // Filters
  const filtered = risks.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? r.departmentId === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<RiskAssessmentInput>({
    resolver: zodResolver(RiskAssessmentSchema),
    defaultValues: {
      riskLevel: 'Medium',
      impact: 'Medium',
      probability: 'Medium',
      status: 'Open'
    }
  });

  const onSubmit = async (data: RiskAssessmentInput) => {
    setLoading(true);
    try {
      if (editingRisk) {
        await updateRiskAssessment(editingRisk.id, data);
        showToast('Risk assessment updated successfully!');
      } else {
        await createRiskAssessment(data);
        showToast('Risk assessment added to register!');
      }
      setIsCreateOpen(false);
      setEditingRisk(null);
      reset();
      window.location.reload();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to save risk assessment.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (risk: RiskAssessment) => {
    setEditingRisk(risk);
    setValue('title', risk.title);
    setValue('description', risk.description);
    setValue('departmentId', risk.departmentId);
    setValue('ownerId', risk.ownerId);
    setValue('riskLevel', risk.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical');
    setValue('impact', (risk.impact || 'Medium') as 'Low' | 'Medium' | 'High');
    setValue('probability', (risk.probability || 'Medium') as 'Low' | 'Medium' | 'High');
    setValue('status', risk.status || 'Open');
    setValue('mitigationPlan', risk.mitigationPlan || '');
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this risk assessment from register?')) return;
    try {
      await deleteRiskAssessment(id);
      showToast('Risk assessment deleted.');
      setRisks(prev => prev.filter(r => r.id !== id));
      window.location.reload();
    } catch (e) {
      showToast('Failed to delete risk.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Governance"
          title="Risk Register"
          subtitle="Analyze enterprise ESG risks, visualize likelihood/impact heatmaps, and detail mitigation plans"
          accentColor="gov"
        />

        {canManage && (
          <button
            onClick={() => {
              setEditingRisk(null);
              reset();
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gov hover:bg-[#19273c] text-white rounded-xl text-xs font-semibold shadow-sm self-start sm:self-center transition-colors"
          >
            <Plus size={14} /> Log Risk Assessment
          </button>
        )}
      </div>

      {/* 3x3 Heatmap Grid widget */}
      <RiskMatrix risks={risks} />

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search risk registers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-bg/25 text-sm focus:outline-none focus:border-border-strong"
          />
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-2 border border-border rounded-xl text-xs focus:outline-none bg-surface text-text-primary"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk registry table view */}
      <div className="bg-surface border border-border rounded-2xl card-shadow overflow-hidden">
        <div className="p-4 border-b border-border bg-bg/10 font-bold text-xs font-mono uppercase text-text-muted tracking-wider">
          Enterprise Risk Register Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/25">
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Risk Title</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Department</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Severity</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Likelihood x Impact</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Mitigation Summary</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Owner</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-sm text-text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert size={28} className="text-text-muted opacity-50" />
                      <span>No risk assessments currently logged.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-bg/10 last:border-0 transition-colors text-sm">
                    <td className="p-3.5">
                      <div className="font-bold text-text-primary">{r.title}</div>
                      <div className="text-xs text-text-muted truncate max-w-xs">{r.description}</div>
                    </td>
                    <td className="p-3.5 text-text-primary">{r.department?.name}</td>
                    <td className="p-3.5">
                      <PriorityBadge priority={r.riskLevel} />
                    </td>
                    <td className="p-3.5 font-mono text-xs">
                      {r.probability} Prob / {r.impact} Imp
                    </td>
                    <td className="p-3.5 text-text-muted text-xs truncate max-w-xs">
                      {r.mitigationPlan || '—'}
                    </td>
                    <td className="p-3.5 text-text-muted text-xs">
                      {r.owner?.name}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl p-1 shadow-sm">
                        {canManage && (
                          <>
                            <button
                              onClick={() => handleEditClick(r)}
                              className="p-1.5 hover:bg-bg rounded-lg text-gov transition-colors"
                              title="Edit assessment"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              title="Delete from register"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log/Edit Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-bg rounded-lg text-text-muted"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold text-text-primary mb-2">
              {editingRisk ? 'Update Risk Assessment' : 'Log Risk Assessment'}
            </h3>
            <p className="text-xs text-text-muted mb-6 leading-normal">
              Register risk values, define mitigation workflows, and set ownership targets.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Failure of recycling contractor logistics"
                  {...register('title')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong"
                />
                {errors.title && <span className="text-xs text-red-500 block mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Description</label>
                <textarea
                  rows={2}
                  placeholder="Log detailing the impact potential..."
                  {...register('description')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong"
                />
                {errors.description && <span className="text-xs text-red-500 block mt-1">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Owner</label>
                  <select
                    {...register('ownerId')}
                    className="w-full p-2.5 rounded-xl border border-border text-sm focus:outline-none"
                  >
                    <option value="">Select Owner</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.ownerId && <span className="text-xs text-red-500 block mt-1">{errors.ownerId.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Department</label>
                  <select
                    {...register('departmentId')}
                    className="w-full p-2.5 rounded-xl border border-border text-sm focus:outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && <span className="text-xs text-red-500 block mt-1">{errors.departmentId.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1">Risk Level</label>
                  <select
                    {...register('riskLevel')}
                    className="w-full p-2 border border-border bg-surface rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1">Probability</label>
                  <select
                    {...register('probability')}
                    className="w-full p-2 border border-border bg-surface rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1">Impact</label>
                  <select
                    {...register('impact')}
                    className="w-full p-2 border border-border bg-surface rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Mitigation Plan</label>
                <textarea
                  rows={2}
                  placeholder="Enact backups, set parameters..."
                  {...register('mitigationPlan')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Mitigation Status</label>
                <select
                  {...register('status')}
                  className="w-full p-2.5 rounded-xl border border-border text-sm focus:outline-none"
                >
                  <option value="Open">Open (Not Mitigated)</option>
                  <option value="Mitigated">Mitigated (Secure)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-bg/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-gov text-white font-semibold text-sm rounded-xl hover:bg-[#19273c] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Risk'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
