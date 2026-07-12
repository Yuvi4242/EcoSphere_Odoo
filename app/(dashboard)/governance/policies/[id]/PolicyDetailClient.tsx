'use client';

import React, { useState } from 'react';
import { formatDate } from '@/app/_lib/utils';
import { StatusBadge } from '@/app/_components/governance/BadgeHelpers';
import { useToast } from '@/app/_components/ui/Toast';
import { acknowledgePolicy, sendAcknowledgementReminder } from '@/app/_actions/governance';
import {
  FileText,
  Calendar,
  Layers,
  Users,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';

interface Acknowledgement {
  id: string;
  policyId: string;
  userId: string;
  status: string;
  acceptedAt: Date | string | null;
  user: {
    name: string | null;
    email: string | null;
    department?: { name: string } | null;
  };
}

interface PolicyVersion {
  id: string;
  policyId: string;
  version: string;
  changeLog: string;
  createdAt: Date | string;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  summary: string;
  categoryId: string;
  category?: { id: string; name: string };
  departmentId: string;
  department?: { id: string; name: string };
  status: string;
  version: string;
  effectiveDate: Date | string;
  expiryDate: Date | string;
  pdfUrl?: string | null;
  acknowledgements?: Acknowledgement[];
  versions?: PolicyVersion[];
}

export default function PolicyDetailClient({
  policy,
  currentUserRole,
  currentUserId
}: {
  policy: Policy;
  currentUserRole: string;
  currentUserId: string;
}) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'acknowledgements'>('overview');
  const [loading, setLoading] = useState(false);
  const policyData = policy;
  const [hasRead, setHasRead] = useState(false);
  const [remindedUsers, setRemindedUsers] = useState<Record<string, boolean>>({});

  const isEmployee = currentUserRole === 'EMPLOYEE';
  const isAdminOrManager = currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER';

  // Check if current user has already signed off
  const userAck = policyData.acknowledgements?.find((a) => a.userId === currentUserId);
  const isPendingSignoff = userAck?.status === 'Pending';

  const handleAcknowledge = async (status: 'Accepted' | 'Rejected') => {
    if (status === 'Accepted' && !hasRead) {
      showToast('You must read the policy document details before accepting.', 'error');
      return;
    }

    setLoading(true);
    try {
      await acknowledgePolicy(policyData.id, status);
      showToast(status === 'Accepted' ? 'Policy successfully acknowledged!' : 'Policy acknowledgement rejected.');
      
      // Reload policy details
      window.location.reload();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to acknowledge policy.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (userId: string) => {
    try {
      await sendAcknowledgementReminder(policyData.id, userId);
      setRemindedUsers(prev => ({ ...prev, [userId]: true }));
      showToast('Acknowledgment reminder alert sent successfully!');
    } catch (e) {
      showToast('Failed to send reminder.', 'error');
    }
  };

  const downloadMockPdf = () => {
    alert(`Downloading PDF document: "${policyData.title}.pdf" (Simulated PDF download)`);
  };

  // Export sign-offs to CSV
  const exportToCsv = () => {
    const headers = 'Employee Name,Email,Department,Status,Signed Date\n';
    const rows = policyData.acknowledgements
      ?.map((a: any) => {
        return `"${a.user.name}","${a.user.email}","${a.user.department?.name || 'Corporate'}","${a.status}","${
          a.acceptedAt ? new Date(a.acceptedAt).toLocaleDateString() : '—'
        }"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${policyData.title.toLowerCase().replace(/\s+/g, '-')}-acknowledgments.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported policy sign-offs successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header back button */}
      <div className="flex items-center gap-3">
        <Link
          href="/governance/policies"
          className="p-2 bg-surface hover:bg-bg border border-border rounded-xl text-text-muted hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
            {policyData.category?.name || 'General Policy'}
          </span>
          <h2 className="text-2xl font-black text-text-primary leading-tight">{policyData.title}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'border-gov text-gov' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <FileText size={15} /> Overview
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'versions' ? 'border-gov text-gov' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Layers size={15} /> Version Logs ({policyData.versions?.length || 0})
        </button>
        {isAdminOrManager && (
          <button
            onClick={() => setActiveTab('acknowledgements')}
            className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'acknowledgements' ? 'border-gov text-gov' : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Users size={15} /> Acknowledgements ({policyData.acknowledgements?.length || 0})
          </button>
        )}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
              <h3 className="text-base font-bold text-text-primary mb-3">Policy Scope & Description</h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {policyData.description}
              </p>
            </div>

            {/* Employee Acknowledgement Card */}
            {isEmployee && isPendingSignoff && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-amber-800 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-600 animate-pulse" /> Policy Acknowledgement Required
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  As an employee, you are legally required to read, understand, and abide by the guidelines defined in this document. Please check the reading safeguard and choose your sign-off status below.
                </p>
                
                {/* Reading checkbox safeguard */}
                <label className="flex items-center gap-2.5 cursor-pointer bg-white border border-amber-200 rounded-xl p-3 select-none">
                  <input
                    type="checkbox"
                    checked={hasRead}
                    onChange={(e) => setHasRead(e.target.checked)}
                    className="w-4 h-4 text-gov border-border rounded focus:ring-gov"
                  />
                  <span className="text-xs font-semibold text-text-primary">
                    I confirm that I have scrolled through and read the policy document details in full.
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    disabled={loading}
                    onClick={() => handleAcknowledge('Rejected')}
                    className="px-4 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Reject Policy
                  </button>
                  <button
                    disabled={loading || !hasRead}
                    onClick={() => handleAcknowledge('Accepted')}
                    className="px-4 py-2.5 bg-env hover:bg-[#147a45] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                  >
                    Accept Policy Sign-off
                  </button>
                </div>
              </div>
            )}

            {/* Already acknowledged message */}
            {isEmployee && !isPendingSignoff && (
              <div className="bg-env-light border border-env/20 rounded-2xl p-6 flex items-center gap-4">
                {userAck?.status === 'Accepted' ? (
                  <>
                    <CheckCircle size={28} className="text-env" />
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Policy Acknowledged</h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        You signed off on this policy on {userAck.acceptedAt ? formatDate(new Date(userAck.acceptedAt).toISOString()) : 'N/A'}. Your records are up-to-date.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={28} className="text-red-600" />
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Policy Sign-off Rejected</h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        You rejected the acknowledgement request for this policy. Please reach out to HR or Legal for clarification.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar parameters */}
          <div className="space-y-6">
            <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4 font-bold">Policy Attributes</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={policyData.status} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted">Version Code</span>
                  <p className="text-sm font-bold font-mono text-text-primary mt-0.5">v{policyData.version}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted">Target Department</span>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{policyData.department?.name || 'All Staff'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted">Effective Date</span>
                  <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-text-muted" />
                    {formatDate(new Date(policyData.effectiveDate).toISOString())}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted">Expiry Date</span>
                  <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-text-muted" />
                    {formatDate(new Date(policyData.expiryDate).toISOString())}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={downloadMockPdf}
                    className="w-full py-2.5 bg-gov hover:bg-[#19273c] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download size={13} /> Download PDF Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version history tab */}
      {activeTab === 'versions' && (
        <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Historical Release Logs</p>
          <div className="relative pl-6 border-l border-border space-y-6 ml-2">
            {policyData.versions?.map((v) => (
              <div key={v.id} className="relative">
                <div className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full bg-gov border-2 border-surface shadow-sm" />
                <div>
                  <span className="text-[10px] font-mono text-text-muted block">
                    Released: {formatDate(new Date(v.createdAt).toISOString())}
                  </span>
                  <h4 className="text-sm font-bold text-text-primary mt-0.5">Version {v.version}</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {v.changeLog}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acknowledgements Sign-off list tab (Admin/Manager only) */}
      {activeTab === 'acknowledgements' && isAdminOrManager && (
        <div className="bg-surface border border-border card-shadow rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Policy Acknowledgement Sign-off Registry</h3>
              <p className="text-xs text-text-muted mt-0.5">Manage and track which employees have signed off or rejected the policy requirements.</p>
            </div>
            <button
              onClick={exportToCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-bg/40 border border-border rounded-xl text-xs font-semibold text-text-primary shadow-sm self-start sm:self-center"
            >
              <FileSpreadsheet size={13} className="text-env" /> Export Sign-offs (CSV)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg/25">
                  <th className="p-3 text-xs font-mono uppercase tracking-wider text-text-muted">Employee Name</th>
                  <th className="p-3 text-xs font-mono uppercase tracking-wider text-text-muted">Department</th>
                  <th className="p-3 text-xs font-mono uppercase tracking-wider text-text-muted">Sign-off Status</th>
                  <th className="p-3 text-xs font-mono uppercase tracking-wider text-text-muted">Accepted Date</th>
                  <th className="p-3 text-xs font-mono uppercase tracking-wider text-text-muted text-right">Reminder Action</th>
                </tr>
              </thead>
              <tbody>
                {policyData.acknowledgements?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-xs text-text-muted">
                      No acknowledgements logged yet. Ensure the policy is published.
                    </td>
                  </tr>
                ) : (
                  policyData.acknowledgements?.map((a) => (
                    <tr key={a.id} className="border-b border-border hover:bg-bg/10 last:border-0 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-text-primary text-sm">{a.user.name}</div>
                        <div className="text-[11px] text-text-muted">{a.user.email}</div>
                      </td>
                      <td className="p-3 text-xs text-text-primary">
                        {a.user.department?.name || 'Corporate'}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="p-3 text-xs font-mono text-text-muted">
                        {a.acceptedAt ? formatDate(new Date(a.acceptedAt).toISOString()) : '—'}
                      </td>
                      <td className="p-3 text-right">
                        {a.status === 'Pending' && (
                          <button
                            onClick={() => handleSendReminder(a.userId)}
                            disabled={remindedUsers[a.userId]}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                              remindedUsers[a.userId]
                                ? 'bg-border text-text-muted border-border cursor-default'
                                : 'bg-surface hover:bg-bg border-border text-gov shadow-sm'
                            }`}
                          >
                            {remindedUsers[a.userId] ? 'Reminded' : 'Send Alert'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
