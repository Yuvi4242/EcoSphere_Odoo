"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Upload, CheckCircle, XCircle, AlertCircle, FileCheck, RefreshCw, FileText, ArrowUpRight } from "lucide-react";
import api from "@/services/api";
import { formatDate } from "@/utils/formatters";
import { useAuthUser } from "@/hooks/use-auth";

interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: "blood_donation" | "tree_plantation" | "other";
  impactMetric?: string;
  volunteers: string[];
}

interface Participation {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  activityId: {
    _id: string;
    title: string;
    type: string;
  };
  hoursVolunteered: number;
  status: "Pending" | "Approved" | "Rejected";
  proofUrl?: string;
}

export default function SocialDashboard() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"activities" | "my-logs" | "approval-queue">("activities");

  // Collections state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myParticipations, setMyParticipations] = useState<Participation[]>([]);
  const [queue, setQueue] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States (Log volunteer)
  const [selectedActivity, setSelectedActivity] = useState("");
  const [hours, setHours] = useState<number | "">("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  // Form States (Create CSR activity for managers/admins)
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"blood_donation" | "tree_plantation" | "other">("tree_plantation");
  const [newImpact, setNewImpact] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const activitiesRes = await api.get("/csr");
      setActivities(activitiesRes.data.activities || []);

      const partRes = await api.get("/employee-participation");
      const list = partRes.data.participations || [];
      
      setMyParticipations(list);

      // Populate approval queue (only visible to Managers/Admins)
      if (user && (user.role === "ADMIN" || user.role === "MANAGER")) {
        const pendingQueue = list.filter((p: Participation) => p.status === "Pending");
        setQueue(pendingQueue);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error pulling social activity details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle proof file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProofUrl(res.data.url);
      setSuccess("Evidence file uploaded successfully! Ready for submission.");
    } catch (err: any) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleLogParticipation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedActivity || hours === "") {
      setError("Please select an activity and log volunteered hours.");
      return;
    }

    try {
      await api.post("/employee-participation", {
        activityId: selectedActivity,
        hoursVolunteered: Number(hours),
        proofUrl,
      });

      setSuccess("Volunteer request submitted successfully! Pending approval from compliance.");
      setSelectedActivity("");
      setHours("");
      setProofUrl("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log participation.");
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newTitle || !newDesc) {
      setError("Title and description are required.");
      return;
    }

    try {
      await api.post("/csr", {
        title: newTitle,
        description: newDesc,
        type: newType,
        impactMetric: newImpact || undefined,
      });

      setSuccess("New CSR activity created successfully!");
      setNewTitle("");
      setNewDesc("");
      setNewImpact("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create activity.");
    }
  };

  const handleQueueDecision = async (id: string, decision: "Approved" | "Rejected") => {
    setError(null);
    setSuccess(null);
    try {
      await api.patch("/employee-participation", { id, status: decision });
      setSuccess(`Participation record successfully ${decision.toLowerCase()}!`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error updating participation record status.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Users className="h-7 w-7 text-blue-500 mr-2" />
          Social Responsibility & CSR Module
        </h2>
        <p className="text-slate-500 text-sm mt-1">Track community engagement, register volunteer hours, and audit CSR campaigns.</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("activities")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
              activeTab === "activities"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>CSR Activities</span>
          </button>
          
          <button
            onClick={() => setActiveTab("my-logs")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
              activeTab === "my-logs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>My Participations</span>
          </button>

          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <button
              onClick={() => setActiveTab("approval-queue")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all relative ${
                activeTab === "approval-queue"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approval Queue</span>
              {queue.length > 0 && (
                <span className="absolute -top-1.5 -right-3 h-5 w-5 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                  {queue.length}
                </span>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Message alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-250 text-rose-700 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === "activities" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CSR activities list */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-bold text-slate-800">Available CSR Drives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((act) => (
                <div key={act._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-500/30 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-50 text-blue-650">
                        {act.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(act.date)}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{act.title}</h4>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed">{act.description}</p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Volunteers Registered:</span>
                    <span className="font-bold text-slate-850">{act.volunteers?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log volunteer hours form OR Create Drive form */}
          <div className="space-y-6">
            {/* Create Drive (Only Admin / Managers) */}
            {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-205">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                  <Plus className="h-4 w-4 mr-1 text-blue-400" />
                  Host CSR Campaign
                </h4>
                <form onSubmit={handleCreateActivity} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Annual Blood Donation Camp"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="tree_plantation">Tree Plantation</option>
                      <option value="blood_donation">Blood Donation Camp</option>
                      <option value="other">Other Community Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Impact Goal Target</label>
                    <input
                      type="text"
                      value={newImpact}
                      onChange={(e) => setNewImpact(e.target.value)}
                      placeholder="e.g. 100 seedlings planted"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Enter details..."
                      rows={3}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all">
                    Publish CSR Campaign
                  </button>
                </form>
              </div>
            )}

            {/* Standard Log Volunteer form */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Log Volunteer Hours</h4>
              <form onSubmit={handleLogParticipation} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Campaign Event</label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2"
                    required
                  >
                    <option value="">-- Select Drive --</option>
                    {activities.map((a) => (
                      <option key={a._id} value={a._id}>{a.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Volunteered Hours</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="e.g. 4"
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Upload Proof of Participation (PDF/Image)</label>
                  <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-all relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingFile}
                    />
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-[10px] text-slate-500 block">
                      {uploadingFile ? "Uploading..." : proofUrl ? "File Uploaded!" : "Drag & Drop or Click to upload"}
                    </span>
                  </div>
                  {proofUrl && (
                    <span className="text-[10px] text-emerald-600 block mt-1 font-semibold truncate">
                      File: {proofUrl}
                    </span>
                  )}
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                  Request XP Log
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === "my-logs" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800">My CSR Logs</h3>
            <button onClick={fetchData} className="p-2 rounded hover:bg-slate-100 transition-colors">
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Date Submitted</th>
                  <th className="py-3 px-3">CSR Event Campaign</th>
                  <th className="py-3 px-3 text-center">Hours</th>
                  <th className="py-3 px-3 text-center">Proof File</th>
                  <th className="py-3 px-3 text-right">Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {myParticipations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No CSR records found. Log your volunteer hours above to begin.
                    </td>
                  </tr>
                ) : (
                  myParticipations.map((part) => (
                    <tr key={part._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-medium">{formatDate(part.userId ? part.userId._id ? new Date() : new Date() : new Date())}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{part.activityId?.title || "Deleted Activity"}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">{part.hoursVolunteered} hrs</td>
                      <td className="py-3 px-3 text-center">
                        {part.proofUrl ? (
                          <a href={part.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-[10px] text-blue-500 hover:underline">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> View Proof
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          part.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                          part.status === "Rejected" ? "bg-rose-50 text-rose-605" : "bg-amber-50 text-amber-600"
                        }`}>
                          {part.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "approval-queue" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">CSR Approvals Processing Queue</h3>
            <p className="text-xs text-slate-400 mt-1">Audit proof documents and approve volunteer XP allocations.</p>
          </div>
          <div className="space-y-4">
            {queue.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-semibold">
                Approval queue is empty. No pending volunteer requests.
              </div>
            ) : (
              queue.map((part) => (
                <div key={part._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 text-sm">{part.userId?.name}</div>
                    <div className="text-slate-500 text-xs">
                      Logged <strong className="text-slate-700">{part.hoursVolunteered} hours</strong> for event <strong className="text-slate-750">'{part.activityId?.title}'</strong>.
                    </div>
                    {part.proofUrl ? (
                      <a href={part.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-blue-500 hover:underline pt-1">
                        <FileText className="h-4 w-4 mr-1" />
                        View Evidence Proof File
                      </a>
                    ) : (
                      <span className="text-xs text-rose-500 font-semibold block pt-1">
                        ⚠️ No proof attached (Warning: weights toggle block may reject approval).
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQueueDecision(part._id, "Approved")}
                      className="inline-flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      Approve & Grant XP
                    </button>
                    <button
                      onClick={() => handleQueueDecision(part._id, "Rejected")}
                      className="inline-flex items-center justify-center py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
