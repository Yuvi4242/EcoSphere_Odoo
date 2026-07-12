'use client';

import React, { useState } from 'react';
import { useToast } from '@/app/_components/ui/Toast';
import { createComplianceTask, completeComplianceTask } from '@/app/_actions/governance';
import { StatusBadge, PriorityBadge } from '@/app/_components/governance/BadgeHelpers';
import { formatDate } from '@/app/_lib/utils';
import { Calendar, Plus, CheckSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ComplianceTask {
  id: string;
  complianceId: string;
  completedAt: Date | null;
  assignedTo: string;
  remarks: string | null;
  assignee?: { name: string | null; email: string | null } | null;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  owner?: { id: string; name: string | null; email: string | null } | null;
  departmentId: string;
  department?: { id: string; name: string } | null;
  priority: string;
  frequency: string;
  status: string;
  dueDate: Date;
  tasks?: ComplianceTask[];
}

interface User {
  id: string;
  name: string | null;
}

export default function ComplianceDetailClient({
  req,
  users,
  currentUserRole,
  currentUserId
}: {
  req: ComplianceRequirement;
  users: User[];
  currentUserRole: string;
  currentUserId: string;
}) {
  const { showToast } = useToast();
  const requirement = req;
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskRemarks, setNewTaskRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const canManage = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER';
  const isOverdue = new Date(requirement.dueDate) < new Date() && requirement.status !== 'Completed';

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskAssignee) return;

    setSubmitting(true);
    try {
      await createComplianceTask(requirement.id, {
        assignedTo: newTaskAssignee,
        remarks: newTaskRemarks
      });
      showToast('Compliance task assigned successfully!');
      setNewTaskAssignee('');
      setNewTaskRemarks('');
      
      // Reload details
      window.location.reload();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to assign task.';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    // Check authorization: only admin/manager or assigned user can complete the task
    const task = requirement.tasks?.find((t) => t.id === taskId);
    if (!task) return;

    if (!canManage && task.assignedTo !== currentUserId) {
      showToast('You are not authorized to complete this task. It is assigned to another user.', 'error');
      return;
    }

    setCompletingTaskId(taskId);
    try {
      await completeComplianceTask(taskId, 'Completed task sign-off.');
      showToast('Task marked as completed!');
      
      // Reload page to reflect updated status
      window.location.reload();
    } catch (err) {
      showToast('Failed to complete task.', 'error');
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/governance/compliance"
          className="p-2 bg-surface hover:bg-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Compliance Requirement Detail
          </span>
          <h2 className="text-2xl font-black text-text-primary leading-tight">{requirement.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata attributes */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-3">Requirement Description</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">{requirement.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Status</span>
                <div className="mt-1">
                  <StatusBadge status={isOverdue ? 'Overdue' : requirement.status} />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Priority</span>
                <div className="mt-1">
                  <PriorityBadge priority={requirement.priority} />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Frequency</span>
                <p className="text-sm font-bold text-text-primary mt-0.5">{requirement.frequency}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Due Date</span>
                <p className="text-sm font-bold text-text-primary mt-0.5 flex items-center gap-1">
                  <Calendar size={13} className="text-text-muted" />
                  {formatDate(requirement.dueDate.toISOString())}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-tasks checklist */}
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-1.5">
              <CheckSquare size={16} className="text-gov" /> Mandatory Action Checklist
            </h3>

            {requirement.tasks?.length === 0 ? (
              <p className="text-xs text-text-muted italic py-4">No checklist tasks defined yet.</p>
            ) : (
              <div className="space-y-3">
                {requirement.tasks?.map((task) => {
                  const isCompleted = task.completedAt !== null;
                  const isTaskOwner = task.assignedTo === currentUserId;

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 ${
                        isCompleted ? 'bg-env-light/10 border-env/20' : 'bg-surface border-border'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            Task Assigned to {task.assignee?.name || 'User'}
                          </span>
                        </div>
                        {task.remarks && (
                          <p className="text-xs text-text-muted mt-1 leading-normal">
                            Remarks: {task.remarks}
                          </p>
                        )}
                        {isCompleted && task.completedAt && (
                          <span className="text-[9px] font-mono text-env font-bold mt-1 block">
                            Completed: {new Date(task.completedAt).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div>
                        {isCompleted ? (
                          <span className="p-1 text-env bg-env-light rounded-lg flex items-center gap-1 text-[10px] font-mono font-bold uppercase select-none">
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={completingTaskId === task.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                              isTaskOwner || canManage
                                ? 'bg-gov hover:bg-[#19273c] text-white'
                                : 'bg-border text-text-muted cursor-not-allowed'
                            }`}
                          >
                            {completingTaskId === task.id ? 'Loading...' : 'Complete Task'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Task Assigning Form sidebar */}
        <div className="space-y-6">
          <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4 font-bold">Requirement Owner</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-light text-gov font-bold flex items-center justify-center">
                {requirement.owner?.name?.slice(0, 2).toUpperCase() || 'UN'}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{requirement.owner?.name || 'Unassigned'}</p>
                <p className="text-xs text-text-muted">{requirement.owner?.email || '—'}</p>
              </div>
            </div>
            <p className="text-[11px] text-text-muted mt-3 italic border-t border-border pt-3">
              Department: {requirement.department?.name || 'Corporate'}
            </p>
          </div>

          {canManage && (
            <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3">Assign Checklist Task</h3>
              <p className="text-xs text-text-muted mb-4">Assign validation checklists to specific team members.</p>
              <form onSubmit={handleCreateTask} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    required
                    className="w-full p-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong"
                  >
                    <option value="">Select Assignee</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5">Remarks / Details</label>
                  <textarea
                    rows={2}
                    placeholder="Provide compliance check remarks..."
                    value={newTaskRemarks}
                    onChange={(e) => setNewTaskRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:border-border-strong resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newTaskAssignee}
                  className="w-full py-2 bg-gov hover:bg-[#19273c] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus size={12} /> Assign Task
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
