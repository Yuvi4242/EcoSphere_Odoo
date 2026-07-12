'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Eye, Trash2, BookOpen, Download, Copy, CheckCircle, ArrowRight, Upload, X, ShieldAlert } from 'lucide-react';
import { StatusBadge } from './BadgeHelpers';
import { formatDate } from '@/app/_lib/utils';
import { motion } from 'framer-motion';

interface PolicyCategory {
  id: string;
  name: string;
}

interface PolicyDepartment {
  id: string;
  name: string;
}

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  version: string;
  status: string;
  categoryId: string;
  category?: PolicyCategory | null;
  departmentId: string;
  department?: PolicyDepartment | null;
  effectiveDate: Date | string;
  expiryDate: Date | string;
}

// ==========================================
// POLICY CARD
// ==========================================

export function PolicyCard({ policy }: { policy: PolicyItem }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-surface rounded-2xl border border-border card-shadow p-6 flex flex-col justify-between hover:border-border-strong transition-all"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            {policy.category?.name || 'Uncategorized'}
          </span>
          <StatusBadge status={policy.status} />
        </div>
        <h4 className="text-base font-bold text-text-primary mb-2 line-clamp-1">{policy.title}</h4>
        <p className="text-sm text-text-muted mb-4 line-clamp-3 leading-relaxed">{policy.summary}</p>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="text-[11px] font-mono text-text-muted">
          <span>v{policy.version}</span>
          <span className="mx-2">•</span>
          <span>{policy.department?.name || 'All'}</span>
        </div>
        <Link
          href={`/governance/policies/${policy.id}`}
          className="text-xs font-semibold text-gov flex items-center gap-1 hover:underline"
        >
          View Details <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

// ==========================================
// POLICY TABLE
// ==========================================

export function PolicyTable({
  policies,
  categories,
  departments,
  userRole,
  onPublish,
  onArchive,
  onDuplicate,
  onDelete
}: {
  policies: PolicyItem[];
  categories: PolicyCategory[];
  departments: PolicyDepartment[];
  userRole: string;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Client-side search and filtering
  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesDept = deptFilter ? p.departmentId === deptFilter : true;
    const matchesCat = catFilter ? p.categoryId === catFilter : true;
    return matchesSearch && matchesStatus && matchesDept && matchesCat;
  });

  const canEdit = userRole === 'ADMIN' || userRole === 'MANAGER';

  const downloadMockPdf = (policyTitle: string) => {
    alert(`Downloading policy document: "${policyTitle}.pdf" (simulated download)`);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border card-shadow overflow-hidden">
      {/* Table Filters Bar */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search policies by title or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-border-strong bg-bg/30"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              showFilters ? 'bg-gov text-white border-gov' : 'bg-surface border-border text-text-primary hover:bg-bg/40'
            }`}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          {canEdit && (
            <Link
              href="/governance/policies/new"
              className="px-4 py-2.5 bg-gov hover:bg-[#19273c] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              + Create Policy
            </Link>
          )}
        </div>
      </div>

      {/* Advanced Filters Expandable */}
      {showFilters && (
        <div className="p-5 border-b border-border bg-bg/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Category</label>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-bg/25">
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Policy Name</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Category</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Department</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Status</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Version</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted">Effective Date</th>
              <th className="p-4 text-xs font-mono uppercase tracking-wider text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert size={28} className="text-text-muted opacity-60" />
                    <span>No policies match the current filter selection.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPolicies.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-bg/10 last:border-b-0 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-text-primary">{p.title}</div>
                    <div className="text-xs text-text-muted truncate max-w-xs">{p.summary}</div>
                  </td>
                  <td className="p-4 text-sm text-text-primary">{p.category?.name || 'General'}</td>
                  <td className="p-4 text-sm text-text-primary">{p.department?.name || 'Corporate'}</td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4 text-sm font-mono font-medium text-text-primary">v{p.version}</td>
                  <td className="p-4 text-sm text-text-muted">{formatDate(new Date(p.effectiveDate).toISOString())}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl p-1 shadow-sm">
                      <Link
                        href={`/governance/policies/${p.id}`}
                        title="View policy details"
                        className="p-1.5 hover:bg-bg rounded-lg text-gov transition-colors"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => downloadMockPdf(p.title)}
                        title="Download PDF document"
                        className="p-1.5 hover:bg-bg rounded-lg text-env transition-colors"
                      >
                        <Download size={14} />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => onDuplicate(p.id)}
                            title="Duplicate policy draft"
                            className="p-1.5 hover:bg-bg rounded-lg text-gamif transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          {p.status === 'Draft' && (
                            <button
                              onClick={() => onPublish(p.id)}
                              title="Publish policy"
                              className="p-1.5 hover:bg-env-light rounded-lg text-env transition-colors"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {p.status === 'Published' && (
                            <button
                              onClick={() => onArchive(p.id)}
                              title="Archive policy"
                              className="p-1.5 hover:bg-bg rounded-lg text-text-muted transition-colors"
                            >
                              <X size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(p.id)}
                            title="Delete policy"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
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
  );
}

// ==========================================
// POLICY UPLOAD MODAL
// ==========================================

export function PolicyUploadModal({ isOpen, onClose, onUploadComplete }: { isOpen: boolean; onClose: () => void; onUploadComplete: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onUploadComplete(`/assets/policies/${file.name.toLowerCase().replace(/\s+/g, '-')}`);
      onClose();
    }, 2000); // Simulate network latency
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-bg rounded-lg text-text-muted">
          <X size={16} />
        </button>

        <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
          <Upload size={18} className="text-gov" /> Upload Policy PDF Document
        </h3>
        <p className="text-xs text-text-muted mb-6 leading-normal">
          Upload policy text file (PDF format) to store in the platform database. Documents will be signed cryptographically.
        </p>

        {file ? (
          <div className="border border-dashed border-border rounded-xl p-4 bg-bg/25 mb-6 flex flex-col items-center justify-center">
            <BookOpen size={36} className="text-gov mb-2" />
            <span className="text-sm font-semibold text-text-primary truncate max-w-full">{file.name}</span>
            <span className="text-xs text-text-muted font-mono">{(file.size / 1024).toFixed(1)} KB</span>
            <button onClick={() => setFile(null)} className="text-xs text-red-600 mt-2 font-semibold hover:underline">
              Remove and Choose Another
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center transition-all ${
              dragging ? 'border-gov bg-gov-light/35' : 'border-border bg-bg/5 hover:bg-bg/20'
            }`}
          >
            <Upload size={40} className="text-text-muted opacity-50 mb-3" />
            <p className="text-sm font-semibold text-text-primary mb-1">Drag and drop file here</p>
            <p className="text-xs text-text-muted mb-4">Supported Format: .pdf (Max size: 5MB)</p>
            <label className="px-4 py-2 bg-surface hover:bg-bg border border-border text-text-primary rounded-xl text-xs font-semibold cursor-pointer shadow-sm">
              Browse Files
              <input type="file" accept=".pdf" onChange={handleSelect} className="hidden" />
            </label>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-bg/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={triggerUpload}
            disabled={!file || uploading}
            className="flex-1 py-2.5 bg-gov text-white font-semibold text-sm rounded-xl hover:bg-[#19273c] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              'Confirm Upload'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
