'use client';

import React, { useState } from 'react';
import PageHeader from '@/app/_components/ui/PageHeader';
import { ReportModal, ConfirmationDialog } from '@/app/_components/governance/Dialogs';
import { Trash2, Download, Search, Plus, ShieldAlert } from 'lucide-react';
import { generateReport, deleteReport } from '@/app/_actions/governance';
import { useToast } from '@/app/_components/ui/Toast';
import { formatDate } from '@/app/_lib/utils';

interface Department {
  id: string;
  name: string;
}

interface Report {
  id: string;
  title: string;
  type: string;
  format: string;
  status: string;
  createdAt: Date;
  creator?: { name: string | null } | null;
}

export default function ReportsClient({
  initialReports,
  departments,
  userRole
}: {
  initialReports: Report[];
  departments: Department[];
  userRole: string;
}) {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canGenerate = userRole === 'ADMIN' || userRole === 'MANAGER';

  // Filters
  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = async (data: { title: string; type: string; format: string; departmentId?: string }) => {
    try {
      await generateReport(data);
      showToast('Report generated and compiled successfully!');
      window.location.reload();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to compile report.';
      showToast(errorMsg, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteReport(deleteTargetId);
      showToast('Report registry item deleted.');
      setReports(prev => prev.filter(r => r.id !== deleteTargetId));
      window.location.reload();
    } catch {
      showToast('Failed to delete report.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const downloadReportMock = (title: string) => {
    alert(`Downloading ESG report document: "${title}" (Simulated file download)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Governance"
          title="Reports Center"
          subtitle="Generate, archive, and download compliance, audit, and risk reports for audit readiness"
          accentColor="gov"
        />

        {canGenerate && (
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gov hover:bg-[#19273c] text-white rounded-xl text-xs font-semibold shadow-sm self-start sm:self-center transition-colors"
          >
            <Plus size={14} /> Generate Report
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-border card-shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search compiled reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-bg/25 text-sm focus:outline-none focus:border-border-strong"
          />
        </div>
      </div>

      {/* Reports ledger list */}
      <div className="bg-surface border border-border rounded-2xl card-shadow overflow-hidden">
        <div className="p-4 border-b border-border bg-bg/10 font-bold text-xs font-mono uppercase text-text-muted tracking-wider">
          Compiled Governance Reports Logs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/25">
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Report Title</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Type</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Format</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Status</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Compiled Date</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted">Creator</th>
                <th className="p-3.5 text-xs font-mono uppercase tracking-wider text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-sm text-text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert size={28} className="text-text-muted opacity-50" />
                      <span>No compiled reports logged yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-bg/10 last:border-0 transition-colors text-sm">
                    <td className="p-3.5">
                      <div className="font-bold text-text-primary">{r.title}</div>
                    </td>
                    <td className="p-3.5 text-text-primary font-mono text-xs">{r.type}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        r.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-env-light text-env'
                      }`}>
                        {r.format}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-env-light text-env text-[10px] font-mono font-bold uppercase select-none">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-text-muted text-xs">
                      {formatDate(r.createdAt.toISOString())}
                    </td>
                    <td className="p-3.5 text-text-muted text-xs">
                      {r.creator?.name || 'System'}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => downloadReportMock(r.title)}
                          className="p-1.5 hover:bg-bg rounded-lg text-env transition-colors"
                          title="Download report file"
                        >
                          <Download size={13} />
                        </button>
                        {userRole === 'ADMIN' && (
                          <button
                            onClick={() => setDeleteTargetId(r.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Delete report"
                          >
                            <Trash2 size={13} />
                          </button>
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

      {/* Generating Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        departments={departments}
        onGenerate={handleGenerate}
      />

      {/* Delete confirmation modal */}
      <ConfirmationDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Report"
        message="Are you sure you want to delete this report from logs? This action is permanent and deletes local backups."
        confirmLabel="Delete Report"
      />
    </div>
  );
}
