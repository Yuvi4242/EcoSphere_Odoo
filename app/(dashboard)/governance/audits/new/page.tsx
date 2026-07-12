'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AuditSchema, AuditInput } from '@/app/_lib/governance-validation';
import { createAudit } from '@/app/_actions/governance';
import PageHeader from '@/app/_components/ui/PageHeader';
import { useToast } from '@/app/_components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function NewAuditPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lazy state initializer for date calculation to satisfy pure component rules
  const [defaultAuditDate] = useState(() => 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Load departments and users
  useEffect(() => {
    async function loadData() {
      try {
        const dRes = await fetch('/api/departments');
        if (dRes.ok) {
          const depts = await dRes.json();
          setDepartments(depts);
        }

        // Fetch users list
        const uRes = await fetch('/api/users');
        if (uRes.ok) {
          const usersList = await uRes.json();
          setUsers(usersList);
        } else {
          // fallback mock users
          setUsers([
            { id: 'usr-admin', name: 'Demo Admin' },
            { id: 'usr-mgr1', name: 'Manager 1' },
            { id: 'usr-mgr2', name: 'Manager 2' }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuditInput>({
    resolver: zodResolver(AuditSchema),
    defaultValues: {
      status: 'Scheduled',
      riskLevel: 'Medium',
      auditDate: defaultAuditDate
    }
  });

  const onSubmit = async (data: AuditInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await createAudit(data);
      showToast('Audit scheduled successfully!');
      router.push('/governance/audits');
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to schedule audit.';
      setErrorMessage(errorMsg);
      showToast('Failed to schedule audit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/governance/audits"
          className="p-2 hover:bg-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <PageHeader
          eyebrow="Governance · Audits"
          title="Schedule Internal Audit"
          subtitle="Plan compliance and risk check sessions across target departments"
          accentColor="gov"
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border card-shadow rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Audit Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Audit Session Title</label>
            <input
              type="text"
              placeholder="e.g. Scope 1 H2 emissions validation audit"
              {...register('title')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title.message}</span>}
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Target Department</label>
            <select
              {...register('departmentId')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <span className="text-xs text-red-500 mt-1 block">{errors.departmentId.message}</span>}
          </div>

          {/* Auditor Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Assigned Auditor</label>
            <select
              {...register('auditorId')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="">Select Auditor</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.auditorId && <span className="text-xs text-red-500 mt-1 block">{errors.auditorId.message}</span>}
          </div>

          {/* Audit Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Audit Date</label>
            <input
              type="date"
              {...register('auditDate')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.auditDate && <span className="text-xs text-red-500 mt-1 block">{errors.auditDate.message}</span>}
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Session Risk Classification</label>
            <select
              {...register('riskLevel')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
            {errors.riskLevel && <span className="text-xs text-red-500 mt-1 block">{errors.riskLevel.message}</span>}
          </div>

          {/* Summary */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Audit Session Agenda / Scope</label>
            <textarea
              rows={2}
              placeholder="Outline the parameters and agenda of this audit..."
              {...register('summary')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong resize-none"
            />
          </div>

          {/* Recommendation */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Auditor Recommendations (Optional)</label>
            <textarea
              rows={3}
              placeholder="Initial suggestions or checklist rules..."
              {...register('recommendation')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/governance/audits"
            className="px-5 py-2.5 rounded-xl border border-border text-text-primary text-sm font-semibold hover:bg-bg/35"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gov hover:bg-[#19273c] text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Audit Session'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
