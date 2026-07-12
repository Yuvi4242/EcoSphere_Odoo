"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, RefreshCw, FileText, CheckSquare, AlertCircle, FileCheck, Calendar, User, UserCheck } from "lucide-react";
import api from "@/services/api";
import { formatDate } from "@/utils/formatters";
import { useAuthUser } from "@/hooks/use-auth";

interface Policy {
  _id: string;
  title: string;
  description: string;
  version: string;
  publishedAt: string;
  acceptedBy: string[]; // user IDs
}

interface Audit {
  _id: string;
  title: string;
  auditor: string;
  date: string;
  findings?: string;
  scope: "Environmental" | "Social" | "Governance";
}

interface ComplianceIssue {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "Resolved" | "Overdue";
  dueDate: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserAccount {
  _id: string;
  name: string;
  email: string;
}

export default function GovernanceDashboard() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"policies" | "audits" | "compliance">("policies");

  // Data states
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states (Create Policy)
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyDesc, setPolicyDesc] = useState("");
  const [policyVer, setPolicyVer] = useState("");

  // Form states (Create Audit)
  const [auditTitle, setAuditTitle] = useState("");
  const [auditAuditor, setAuditAuditor] = useState("");
  const [auditFindings, setAuditFindings] = useState("");
  const [auditScope, setAuditScope] = useState<"Environmental" | "Social" | "Governance">("Governance");

  // Form states (Create Compliance Issue)
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [issueDue, setIssueDue] = useState("");
  const [issueOwner, setIssueOwner] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const policiesRes = await api.get("/governance/policies");
      setPolicies(policiesRes.data.policies || []);

      const auditsRes = await api.get("/governance/audits");
      setAudits(auditsRes.data.audits || []);

      const issuesRes = await api.get("/governance/compliance-issues");
      setIssues(issuesRes.data.issues || []);

      if (user && (user.role === "ADMIN" || user.role === "MANAGER")) {
        const usersRes = await api.get("/users");
        setUsersList(usersRes.data.users || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error pulling governance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAcknowledgePolicy = async (policyId: string) => {
    setError(null);
    setSuccess(null);
    try {
      await api.post("/governance/acknowledgements", { policyId });
      setSuccess("Policy successfully acknowledged and signed! +15 XP awarded.");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to sign policy.");
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!policyTitle || !policyDesc || !policyVer) {
      setError("Please input title, description, and version.");
      return;
    }
    try {
      await api.post("/governance/policies", {
        title: policyTitle,
        description: policyDesc,
        version: policyVer,
      });
      setSuccess("New policy version successfully published!");
      setPolicyTitle("");
      setPolicyDesc("");
      setPolicyVer("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to publish policy.");
    }
  };

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!auditTitle || !auditAuditor) {
      setError("Please input audit title and auditor.");
      return;
    }
    try {
      await api.post("/governance/audits", {
        title: auditTitle,
        auditor: auditAuditor,
        findings: auditFindings,
        scope: auditScope,
      });
      setSuccess("Audit record successfully registered.");
      setAuditTitle("");
      setAuditAuditor("");
      setAuditFindings("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register audit.");
    }
  };

  const handleCreateComplianceIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!issueTitle || !issueDesc || !issueDue || !issueOwner) {
      setError("Please fill all compliance issue fields.");
      return;
    }
    try {
      await api.post("/governance/compliance-issues", {
        title: issueTitle,
        description: issueDesc,
        dueDate: issueDue,
        ownerId: issueOwner,
      });
      setSuccess("Compliance issue registered and owner notified.");
      setIssueTitle("");
      setIssueDesc("");
      setIssueDue("");
      setIssueOwner("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log compliance issue.");
    }
  };

  const handleResolveIssue = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      await api.patch("/governance/compliance-issues", { id, status: "Resolved" });
      setSuccess("Compliance issue successfully marked as Resolved.");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error updating issue status.");
    }
  };

  const handleOverdueCheck = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await api.get("/cron"); // call the cron evaluating endpoint
      setSuccess(res.data.message || "Overdue issues evaluated successfully.");
      fetchData();
    } catch (err: any) {
      setError("Overdue trigger execution failed.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <ShieldCheck className="h-7 w-7 text-violet-500 mr-2" />
            Corporate Governance & Compliance
          </h2>
          <p className="text-slate-500 text-sm mt-1">Verify policy acknowledgements, track compliance failures, and review audit history.</p>
        </div>
        {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
          <button
            onClick={handleOverdueCheck}
            className="inline-flex items-center justify-center py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Trigger Overdue Evaluator
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          {[
            { id: "policies", label: "Corporate Policies", icon: FileText },
            { id: "audits", label: "Audit Logs", icon: ShieldCheck },
            { id: "compliance", label: "Compliance Tracker", icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Message alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-255 text-rose-700 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-255 text-emerald-700 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Policy List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-bold text-slate-800">Company Codes & Policies</h3>
            <div className="space-y-4">
              {policies.map((p) => {
                const acknowledged = user && p.acceptedBy.includes(user.id);
                return (
                  <div key={p._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-slate-800 text-sm">{p.title}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                          v{p.version}
                        </span>
                      </div>
                      <p className="text-slate-550 text-xs leading-relaxed max-w-xl">{p.description}</p>
                    </div>

                    <div className="flex items-center">
                      {acknowledged ? (
                        <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <UserCheck className="h-4 w-4 mr-1.5" />
                          Signed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcknowledgePolicy(p._id)}
                          className="py-2 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Sign & Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Policy Form (Manager/Admin Only) */}
          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                <Plus className="h-4 w-4 mr-1 text-violet-400" />
                Publish Governance Policy
              </h4>
              <form onSubmit={handleCreatePolicy} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={policyTitle}
                    onChange={(e) => setPolicyTitle(e.target.value)}
                    placeholder="e.g. Anti-Bribery Policy"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Version code</label>
                  <input
                    type="text"
                    value={policyVer}
                    onChange={(e) => setPolicyVer(e.target.value)}
                    placeholder="e.g. 1.2"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Scope Details</label>
                  <textarea
                    value={policyDesc}
                    onChange={(e) => setPolicyDesc(e.target.value)}
                    placeholder="Enter compliance terms..."
                    rows={4}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all">
                  Publish Policy
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "audits" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audit Logs Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">Compliance Audit History</h3>
              <button onClick={fetchData} className="p-2 rounded hover:bg-slate-100 transition-colors">
                <RefreshCw className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Scope</th>
                    <th className="py-3 px-3">Audit Title</th>
                    <th className="py-3 px-3">Auditor</th>
                    <th className="py-3 px-3 text-right">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                        No compliance audits registered.
                      </td>
                    </tr>
                  ) : (
                    audits.map((a) => (
                      <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 text-slate-500 font-medium">{formatDate(a.date)}</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-600">
                            {a.scope}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{a.title}</td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{a.auditor}</td>
                        <td className="py-3 px-3 text-right text-slate-500 max-w-xs truncate">{a.findings || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Audit Form (Manager/Admin Only) */}
          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                <Plus className="h-4 w-4 mr-1 text-violet-400" />
                Register Audit Log
              </h4>
              <form onSubmit={handleCreateAudit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={auditTitle}
                    onChange={(e) => setAuditTitle(e.target.value)}
                    placeholder="e.g. Q2 Scope 3 Aviation Audit"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Auditor Firm/Name</label>
                  <input
                    type="text"
                    value={auditAuditor}
                    onChange={(e) => setAuditAuditor(e.target.value)}
                    placeholder="e.g. Ernst & Young"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Scope Category</label>
                  <select
                    value={auditScope}
                    onChange={(e) => setAuditScope(e.target.value as any)}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Social">Social</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Summary Findings</label>
                  <textarea
                    value={auditFindings}
                    onChange={(e) => setAuditFindings(e.target.value)}
                    placeholder="Provide details..."
                    rows={3}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all">
                  Register Audit
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "compliance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-6">Compliance Issues Tracker</h3>
            <div className="space-y-4">
              {issues.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-semibold">
                  No active compliance issues logged. All operations compliant.
                </div>
              ) : (
                issues.map((iss) => (
                  <div key={iss._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-slate-800 text-sm">{iss.title}</h4>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          iss.status === "Resolved" ? "bg-emerald-50 text-emerald-600" :
                          iss.status === "Overdue" ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-amber-50 text-amber-600"
                        }`}>
                          {iss.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-xl">{iss.description}</p>
                      <div className="flex items-center space-x-4 text-[10px] text-slate-400 pt-2 font-medium">
                        <span className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          Owner: {iss.owner?.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Due Date: {formatDate(iss.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {iss.status !== "Resolved" && user && (user.id === iss.owner?._id || user.role === "ADMIN") && (
                        <button
                          onClick={() => handleResolveIssue(iss._id)}
                          className="inline-flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assign issue Form (Manager/Admin Only) */}
          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                <Plus className="h-4 w-4 mr-1 text-violet-400" />
                Assign Compliance Task
              </h4>
              <form onSubmit={handleCreateComplianceIssue} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Issue Title</label>
                  <input
                    type="text"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="e.g. Submeter billing mismatch"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Owner Assignment</label>
                  <select
                    value={issueOwner}
                    onChange={(e) => setIssueOwner(e.target.value)}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    required
                  >
                    <option value="">-- Choose Employee --</option>
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={issueDue}
                    onChange={(e) => setIssueDue(e.target.value)}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Details</label>
                  <textarea
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    placeholder="Enter compliance issue details..."
                    rows={3}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all">
                  Assign Compliance Issue
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
