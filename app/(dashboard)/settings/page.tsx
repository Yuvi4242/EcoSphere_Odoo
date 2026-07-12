"use client";

import React, { useState, useEffect } from "react";
import { Settings, Plus, RefreshCw, AlertCircle, FileCheck, Shield, Sliders, Building, Library } from "lucide-react";
import api from "@/services/api";
import { useAuthUser } from "@/hooks/use-auth";

export default function SettingsDashboard() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"weights" | "categories" | "departments">("weights");

  // State data configs
  const [envWeight, setEnvWeight] = useState(40);
  const [socWeight, setSocWeight] = useState(30);
  const [govWeight, setGovWeight] = useState(30);
  const [autoEmissions, setAutoEmissions] = useState(true);
  const [evidenceReq, setEvidenceReq] = useState(true);
  const [badgeAuto, setBadgeAuto] = useState(true);

  // Departments & Categories
  const [depts, setDepts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  // Form states (Create Department)
  const [deptName, setDeptName] = useState("");
  const [parentDeptId, setParentDeptId] = useState("");

  // Form states (Create Category)
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<"Environmental" | "Social" | "Governance">("Environmental");
  const [catDesc, setCatDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/esg-config");
      const config = res.data.config;
      if (config) {
        setEnvWeight(config.environmentalWeight);
        setSocWeight(config.socialWeight);
        setGovWeight(config.governanceWeight);
        setAutoEmissions(config.autoEmissionCalculation);
        setEvidenceReq(config.evidenceRequirement);
        setBadgeAuto(config.badgeAutoAward);
      }

      const deptsRes = await api.get("/departments");
      setDepts(deptsRes.data.departments || []);

      const catsRes = await api.get("/categories");
      setCats(catsRes.data.categories || []);
    } catch (err: any) {
      setError("Error pulling platform settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const total = Number(envWeight) + Number(socWeight) + Number(govWeight);
    if (total !== 100) {
      setError(`Configuration rejected: weights must sum to exactly 100%. Currently: ${total}%`);
      return;
    }

    try {
      await api.post("/esg-config", {
        environmentalWeight: Number(envWeight),
        socialWeight: Number(socWeight),
        governanceWeight: Number(govWeight),
        autoEmissionCalculation: autoEmissions,
        evidenceRequirement: evidenceReq,
        badgeAutoAward: badgeAuto,
      });

      setSuccess("Weights and toggles updated successfully!");
      fetchConfig();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error updating settings.");
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!deptName) return;
    try {
      await api.post("/departments", {
        name: deptName,
        parentDepartment: parentDeptId || undefined,
      });
      setSuccess("New department created successfully!");
      setDeptName("");
      setParentDeptId("");
      fetchConfig();
    } catch (err: any) {
      setError("Error creating department.");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!catName) return;
    try {
      await api.post("/categories", {
        name: catName,
        type: catType,
        description: catDesc || undefined,
      });
      setSuccess("New Category created successfully!");
      setCatName("");
      setCatDesc("");
      fetchConfig();
    } catch (err: any) {
      setError("Error creating category.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Settings className="h-7 w-7 text-slate-500 mr-2" />
          EcoSphere Platform Settings
        </h2>
        <p className="text-slate-500 text-sm mt-1">Configure ESG overall score weights, toggle compliance options, and manage organization structures.</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("weights")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
              activeTab === "weights"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>ESG Weights & Rules</span>
          </button>
          
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
              activeTab === "categories"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Library className="h-4 w-4" />
            <span>ESG Categories</span>
          </button>

          <button
            onClick={() => setActiveTab("departments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
              activeTab === "departments"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Departments Registry</span>
          </button>
        </nav>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-250 text-rose-705 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-705 p-4 rounded-xl flex items-start space-x-2 text-sm">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === "weights" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main config panel */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-6">Score Weights & Feature Switches</h3>

            <form onSubmit={handleUpdateConfig} className="space-y-6">
              {/* Score Weights Inputs */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Environmental Weight (%)</label>
                  <input
                    type="number"
                    value={envWeight}
                    onChange={(e) => setEnvWeight(Number(e.target.value))}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Social Weight (%)</label>
                  <input
                    type="number"
                    value={socWeight}
                    onChange={(e) => setSocWeight(Number(e.target.value))}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Governance Weight (%)</label>
                  <input
                    type="number"
                    value={govWeight}
                    onChange={(e) => setGovWeight(Number(e.target.value))}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>

              {/* Switches Toggles */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Compliance Rules</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Auto emission calculator</div>
                    <p className="text-[10px] text-slate-500">Automatically multiply carbon entries by emission factor database values.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoEmissions}
                    onChange={(e) => setAutoEmissions(e.target.checked)}
                    className="h-4.5 w-4.5 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Enforce evidence attachments</div>
                    <p className="text-[10px] text-slate-500">Require employees to upload proof documents before volunteer requests can be approved.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={evidenceReq}
                    onChange={(e) => setEvidenceReq(e.target.checked)}
                    className="h-4.5 w-4.5 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Auto Badge allocations</div>
                    <p className="text-[10px] text-slate-500">Automatically check and award badges based on employee XP achievements.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={badgeAuto}
                    onChange={(e) => setBadgeAuto(e.target.checked)}
                    className="h-4.5 w-4.5 text-slate-800"
                  />
                </div>
              </div>

              {user && user.role !== "ADMIN" && user.role !== "MANAGER" ? (
                <div className="text-xs text-rose-500 font-semibold">
                  ⚠️ View only: Only Admins or Managers can save configurations.
                </div>
              ) : (
                <button type="submit" className="py-2.5 px-6 rounded-lg text-sm font-bold text-white bg-slate-850 hover:bg-slate-750 transition-colors shadow-xs">
                  Save Configurations
                </button>
              )}
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-350 space-y-4">
            <h4 className="text-white font-bold text-sm flex items-center">
              <Shield className="h-4.5 w-4.5 text-emerald-500 mr-2" />
              Weights Guidelines
            </h4>
            <p className="text-xs leading-relaxed">
              Scoring weights translate Environmental, Social, and Governance compliance indices into a single organizational rating (e.g. A+).
            </p>
            <p className="text-xs leading-relaxed">
              To update weighting values, ensure that Environmental + Social + Governance weights sum to exactly <strong className="text-white">100%</strong>.
            </p>
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of categories */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-6">Active ESG Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cats.map((c) => (
                <div key={c._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-850">{c.name}</div>
                    <div className="text-slate-400 mt-1">{c.description || "No description"}</div>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-600">
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form (Manager/Admin Only) */}
          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                <Plus className="h-4 w-4 mr-1 text-emerald-500" />
                Add ESG Category
              </h4>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Scope 1 Air Quality"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Type</label>
                  <select
                    value={catType}
                    onChange={(e) => setCatType(e.target.value as any)}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Social">Social</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                  <textarea
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Enter category description..."
                    rows={3}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all">
                  Create Category
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "departments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of departments */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-6">Active Departments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {depts.map((d) => (
                <div key={d._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-850">{d.name}</div>
                    {d.parentDepartment && (
                      <div className="text-slate-450 mt-1 font-medium">Parent Department: {d.parentDepartment.name}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Department Form (Manager/Admin Only) */}
          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                <Plus className="h-4 w-4 mr-1 text-emerald-500" />
                Add Department
              </h4>
              <form onSubmit={handleCreateDept} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="e.g. Sales Department"
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Parent Department</label>
                  <select
                    value={parentDeptId}
                    onChange={(e) => setParentDeptId(e.target.value)}
                    className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="">-- None --</option>
                    {depts.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all">
                  Create Department
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
