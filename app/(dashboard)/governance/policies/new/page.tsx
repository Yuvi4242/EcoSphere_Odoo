'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { PolicySchema, PolicyInput } from '@/app/_lib/governance-validation';
import { createPolicy, getPolicyCategories } from '@/app/_actions/governance';
import PageHeader from '@/app/_components/ui/PageHeader';
import { PolicyUploadModal } from '@/app/_components/governance/PolicyComponents';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

export default function NewPolicyPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lazy initialization of default date parameters to fulfill React pure-rendering requirements
  const [defaultDates] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { today, nextYear };
  });

  // Load categories and departments from DB
  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getPolicyCategories();
        setCategories(cats);

        // Fetch departments directly from api or server action wrapper
        const res = await fetch('/api/departments');
        if (res.ok) {
          const deptsData = await res.json();
          setDepartments(deptsData);
        } else {
          // Fallback static list if api not set up
          setDepartments([
            { id: 'Finance', name: 'Finance' },
            { id: 'HR', name: 'HR' },
            { id: 'IT', name: 'IT' },
            { id: 'Operations', name: 'Operations' },
            { id: 'Legal', name: 'Legal' }
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
  } = useForm<PolicyInput>({
    resolver: zodResolver(PolicySchema),
    defaultValues: {
      status: 'Draft',
      version: '1.0.0',
      effectiveDate: defaultDates.today,
      expiryDate: defaultDates.nextYear,
      pdfUrl: ''
    }
  });

  const onSubmit = async (data: PolicyInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await createPolicy({ ...data, pdfUrl });
      router.push('/governance/policies');
      router.refresh();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred while creating the policy.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/governance/policies"
          className="p-2 hover:bg-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <PageHeader
          eyebrow="Governance · Policies"
          title="Create New Policy"
          subtitle="Formulate and log a new sustainability or security directive"
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
          
          {/* Policy Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Policy Title</label>
            <input
              type="text"
              placeholder="e.g. Supplier Carbon Stewardship Policy"
              {...register('title')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title.message}</span>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Category</label>
            <select
              {...register('categoryId')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="">Select a Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs text-red-500 mt-1 block">{errors.categoryId.message}</span>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Department</label>
            <select
              {...register('departmentId')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="">Select Department Target</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <span className="text-xs text-red-500 mt-1 block">{errors.departmentId.message}</span>}
          </div>

          {/* Version */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Version (SemVer)</label>
            <input
              type="text"
              placeholder="e.g. 1.0.0"
              {...register('version')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-mono focus:outline-none focus:border-border-strong"
            />
            {errors.version && <span className="text-xs text-red-500 mt-1 block">{errors.version.message}</span>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Status</label>
            <select
              {...register('status')}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            {errors.status && <span className="text-xs text-red-500 mt-1 block">{errors.status.message}</span>}
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Effective Date</label>
            <input
              type="date"
              {...register('effectiveDate')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.effectiveDate && <span className="text-xs text-red-500 mt-1 block">{errors.effectiveDate.message}</span>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Expiry Date</label>
            <input
              type="date"
              {...register('expiryDate')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.expiryDate && <span className="text-xs text-red-500 mt-1 block">{errors.expiryDate.message}</span>}
          </div>

          {/* Summary */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Policy Summary (Brief preview)</label>
            <textarea
              rows={2}
              placeholder="Provide a short summary of the policy rules..."
              {...register('summary')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong resize-none"
            />
            {errors.summary && <span className="text-xs text-red-500 mt-1 block">{errors.summary.message}</span>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Full Policy Document Content</label>
            <textarea
              rows={6}
              placeholder="Write the full description and legal conditions of the policy here..."
              {...register('description')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
            {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>}
          </div>

          {/* PDF Uploader Simulation */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Attached PDF Document</label>
            {pdfUrl ? (
              <div className="p-4 bg-bg/35 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gov" />
                  <span className="text-sm font-semibold text-text-primary truncate">{pdfUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfUrl(null)}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="w-full p-4 border border-dashed border-border rounded-xl bg-bg/5 hover:bg-bg/25 flex items-center justify-center gap-2 text-xs font-semibold text-text-primary shadow-sm transition-all"
              >
                <Upload size={14} className="text-gov" />
                Upload PDF File Attachment
              </button>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/governance/policies"
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
                Saving Policy...
              </>
            ) : (
              'Save Draft Policy'
            )}
          </button>
        </div>
      </form>

      {/* Upload modal */}
      <PolicyUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={(url) => setPdfUrl(url)}
      />
    </div>
  );
}
