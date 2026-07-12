'use client';

import React, { useState } from 'react';
import { ComplianceProgress, ComplianceCard } from '@/app/_components/governance/ComplianceComponents';
import PageHeader from '@/app/_components/ui/PageHeader';
import { Search, Plus, ShieldAlert, X } from 'lucide-react';
import { createComplianceRequirement } from '@/app/_actions/governance';
import { useToast } from '@/app/_components/ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComplianceRequirementSchema, ComplianceRequirementInput } from '@/app/_lib/governance-validation';

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
}

interface RequirementTask {
  id: string;
  complianceId: string;
  completedAt: Date | null;
  assignedTo: string;
  remarks: string | null;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  owner?: { name: string | null; email: string | null } | null;
  departmentId: string;
  department?: Department | null;
  priority: string;
  frequency: string;
  status: string;
  dueDate: Date;
  tasks?: RequirementTask[];
}

interface ComplianceStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  pending: number;
  score: number;
  deptComparisons: Array<{
    department: string;
    completed: number;
    total: number;
    score: number;
  }>;
}

export default function ComplianceClient({
  initialRequirements,
  stats,
  departments,
  users,
  userRole
}: {
  initialRequirements: ComplianceRequirement[];
  stats: ComplianceStats;
  departments: Department[];
  users: User[];
  userRole: string;
}) {
  const { showToast } = useToast();
  const requirements = initialRequirements;
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canCreate = userRole === 'ADMIN' || userRole === 'MANAGER';

  // Filters
  const filtered = requirements.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? r.departmentId === deptFilter : true;
    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    return matchesSearch && matchesDept && matchesPriority;
  });

  // Lazy calculation for default date values to preserve purity rules
  const [defaultDueDate] = useState(() =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ComplianceRequirementInput>({
    resolver: zodResolver(ComplianceRequirementSchema),
    defaultValues: {
      status: 'Pending',
      priority: 'Medium',
      frequency: 'Monthly',
      dueDate: defaultDueDate
    }
  });

  const onSubmit = async (data: ComplianceRequirementInput) => {
    setLoading(true);
    try {
      await createComplianceRequirement(data);
      showToast('Compliance requirement created successfully!');
      setIsCreateOpen(false);
      reset();
      // Reload page to refresh stats
      window.location.reload();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to create compliance requirement';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Governance"
          title="Compliance Tracker"
          subtitle="Monitor state compliance checks, departmental completion ratings, and checklists"
          accentColor="gov"
        />

        {canCreate && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gov hover:bg-[#19273c] text-white rounded-xl text-xs font-semibold shadow-sm self-start sm:self-center transition-colors"
          >
            <Plus size={14} /> Add Requirement
          </button>
        )}
      </div>

      {/* Progress widgets */}
      <ComplianceProgress stats={stats} />

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search compliance requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-bg/20 text-sm focus:outline-none focus:border-border-strong"
          />
        </div>

        <div className="flex items-center gap-3">
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

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border border-border rounded-xl text-xs focus:outline-none bg-surface text-text-primary"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 p-12 text-center bg-surface border border-border rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <ShieldAlert size={36} className="text-text-muted opacity-50" />
              <span className="text-sm font-semibold text-text-muted">No compliance requirements match filters.</span>
            </div>
          </div>
        ) : (
          filtered.map((r) => <ComplianceCard key={r.id} req={r} />)
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsCreateOpen(false)} className="absolute right-4 top-4 p-1.5 hover:bg-bg rounded-lg text-text-muted">
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold text-text-primary mb-2">Create Compliance Requirement</h3>
            <p className="text-xs text-text-muted mb-6 leading-normal">
              Register a regulatory compliance target and schedule deadlines.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Scope 1 Greenhouse Gas Audit Submission"
                  {...register('title')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong"
                />
                {errors.title && <span className="text-xs text-red-500 block mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details concerning validation parameters..."
                  {...register('description')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong"
                />
                {errors.description && <span className="text-xs text-red-500 block mt-1">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Owner Assignee</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full p-2.5 rounded-xl border border-border text-sm focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Frequency</label>
                  <select
                    {...register('frequency')}
                    className="w-full p-2.5 rounded-xl border border-border text-sm focus:outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Due Date</label>
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none"
                />
                {errors.dueDate && <span className="text-xs text-red-500 block mt-1">{errors.dueDate.message}</span>}
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
                      Creating...
                    </>
                  ) : (
                    'Register Requirement'
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
