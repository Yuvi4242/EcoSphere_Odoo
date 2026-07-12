'use client';

import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, AlertTriangle, FilePieChart } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

export function ReportModal({
  isOpen,
  onClose,
  departments,
  onGenerate
}: {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onGenerate: (data: { title: string; type: string; format: string; departmentId?: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Compliance');
  const [format, setFormat] = useState('PDF');
  const [deptId, setDeptId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setLoading(true);
    setTimeout(() => {
      onGenerate({ title, type, format, departmentId: deptId || undefined });
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-bg rounded-lg text-text-muted">
          <X size={16} />
        </button>

        <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
          <FilePieChart size={18} className="text-gov" /> Generate Governance Report
        </h3>
        <p className="text-xs text-text-muted mb-6 leading-normal">
          Create structured analytical reports for policy sign-offs, audits, or risks to distribute to stakeholders.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Report Title</label>
            <input
              type="text"
              placeholder="e.g. Q3 Compliance & Audit Health Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-border-strong"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Report Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none"
              >
                <option value="Compliance">Compliance Report</option>
                <option value="Audit">Audit Report</option>
                <option value="Risk">Risk Report</option>
                <option value="Policy">Policy Report</option>
                <option value="Executive">Executive ESG Report</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none"
              >
                <option value="PDF">PDF Document</option>
                <option value="CSV">CSV Spreadsheet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2">Filter Department</label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-bg/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title}
              className="flex-1 py-2.5 bg-gov text-white font-semibold text-sm rounded-xl hover:bg-[#19273c] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// EXPORT DATA MODAL
// ==========================================

export function ExportModal({
  isOpen,
  onClose,
  dataName,
  onExport
}: {
  isOpen: boolean;
  onClose: () => void;
  dataName: string;
  onExport: (format: 'CSV' | 'PDF') => void;
}) {
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (format: 'CSV' | 'PDF') => {
    setExporting(true);
    setTimeout(() => {
      onExport(format);
      setExporting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-bg rounded-lg text-text-muted">
          <X size={16} />
        </button>

        <h3 className="text-lg font-bold text-text-primary mb-2">Export {dataName} Data</h3>
        <p className="text-xs text-text-muted mb-6 leading-normal">
          Select your preferred export layout. CSV is best for custom spreadsheets, PDF is best for presentations.
        </p>

        {exporting ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-gov/30 border-t-gov rounded-full animate-spin" />
            <span className="text-sm font-semibold text-text-primary">Generating export file...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSelect('CSV')}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-border-strong hover:bg-bg/10 transition-all text-left"
            >
              <FileSpreadsheet size={32} className="text-env" />
              <div className="text-center">
                <div className="text-sm font-bold text-text-primary">Export CSV</div>
                <div className="text-[10px] text-text-muted mt-0.5">Spreadsheet Data</div>
              </div>
            </button>

            <button
              onClick={() => handleSelect('PDF')}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-border-strong hover:bg-bg/10 transition-all text-left"
            >
              <FileText size={32} className="text-red-500" />
              <div className="text-center">
                <div className="text-sm font-bold text-text-primary">Export PDF</div>
                <div className="text-[10px] text-text-muted mt-0.5">Styled Document</div>
              </div>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-bg/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ==========================================
// CONFIRMATION DIALOG
// ==========================================

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDanger = true
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 modal-shadow relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${isDanger ? 'bg-red-50 text-red-600' : 'bg-gov-light text-gov'}`}>
            <AlertTriangle size={20} className={isDanger ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">{title}</h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-text-primary font-semibold text-sm hover:bg-bg/30 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 text-white font-semibold text-sm rounded-xl transition-all ${
              isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-gov hover:bg-[#19273c]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
