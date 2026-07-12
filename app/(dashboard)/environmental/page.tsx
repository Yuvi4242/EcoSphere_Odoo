"use client";

import React, { useState, useEffect } from "react";
import { Leaf, Plus, ListFilter, Target, Calculator, RefreshCw, AlertCircle, FileCheck } from "lucide-react";
import api from "@/services/api";
import { formatCarbon, formatDate } from "@/utils/formatters";
import { useAuthUser } from "@/hooks/use-auth";

interface Factor {
  _id: string;
  activityName: string;
  factor: number;
  unit: string;
}

interface Record {
  _id: string;
  scope: 1 | 2 | 3;
  category: string;
  value: number;
  co2e: number;
  date: string;
  notes?: string;
  userId: {
    name: string;
    department: string;
  };
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: "Active" | "Achieved" | "Failed";
}

export default function EnvironmentalDashboard() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"log" | "history" | "goals" | "factors">("log");
  
  // States
  const [records, setRecords] = useState<Record[]>([]);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [scope, setScope] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState("Electricity");
  const [value, setValue] = useState<number | "">("");
  const [factorId, setFactorId] = useState("");
  const [notes, setNotes] = useState("");
  const [manualCo2e, setManualCo2e] = useState<number | "">("");
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Fetch functions
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const recordsRes = await api.get("/carbon");
      setRecords(recordsRes.data.records || []);

      const factorsRes = await api.get("/emission-factors");
      setFactors(factorsRes.data.factors || []);

      // Mock fetch goals for display (or API if created)
      const goalsRes = await api.get("/esg-config"); // just check DB is awake
      // Create some default goals display
      setGoals([
        { _id: "1", title: "Reduce Grid Electricity Consumption", description: "Target 15% reduction in IT and Facility scope emissions.", targetValue: 5000, currentValue: 1250, unit: "kWh", deadline: "2026-12-31", status: "Active" },
        { _id: "2", title: "Minimize Commuting Fuel Burdens", description: "Encourage remote work to drop commuter miles.", targetValue: 3000, currentValue: 3100, unit: "Liters", deadline: "2026-06-30", status: "Failed" },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error fetching environmental data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogCarbon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (value === "") {
      setError("Please input a valid numeric value.");
      return;
    }

    try {
      const postData = {
        scope,
        category,
        value: Number(value),
        emissionFactorId: autoCalculate ? factorId : undefined,
        co2e: autoCalculate ? undefined : Number(manualCo2e),
        notes,
      };

      await api.post("/carbon", postData);
      setSuccess("Carbon record successfully logged! +20 XP awarded.");
      
      // Reset form
      setValue("");
      setNotes("");
      setManualCo2e("");
      
      fetchData(); // reload history
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit carbon record.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Leaf className="h-7 w-7 text-emerald-500 mr-2" />
          Environmental Sustainability Module
        </h2>
        <p className="text-slate-500 text-sm mt-1">Audit scope emissions, compute carbon equivalents, and track targets.</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          {[
            { id: "log", label: "Log Carbon", icon: Calculator },
            { id: "history", label: "Emissions History", icon: ListFilter },
            { id: "goals", label: "Goals & Targets", icon: Target },
            { id: "factors", label: "Emission Factors Config", icon: Leaf },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-350"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Error & Success indicators */}
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
      {activeTab === "log" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center">
              <Calculator className="h-5 w-5 text-emerald-600 mr-2" />
              Carbon Footprint Calculator
            </h3>

            <form onSubmit={handleLogCarbon} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Scope Classification</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(Number(e.target.value) as any)}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value={1}>Scope 1 - Direct (Combustion, Fuel)</option>
                    <option value={2}>Scope 2 - Indirect (Electricity)</option>
                    <option value={3}>Scope 3 - Travel & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Emission Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Electricity, Corporate Flights"
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Quantity Value</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="e.g. 500"
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Auto Calculate emissions</label>
                  <div className="flex items-center space-x-3 py-2">
                    <input
                      type="checkbox"
                      checked={autoCalculate}
                      onChange={(e) => setAutoCalculate(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-600 font-medium">Use database emission factors</span>
                  </div>
                </div>
              </div>

              {autoCalculate ? (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Select Activity Emission Factor</label>
                  <select
                    value={factorId}
                    onChange={(e) => setFactorId(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required={autoCalculate}
                  >
                    <option value="">-- Choose Emission Factor --</option>
                    {factors.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.activityName} ({f.factor} kg CO2e / {f.unit})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Manual Carbon Emission equivalent (kg CO2e)</label>
                  <input
                    type="number"
                    value={manualCo2e}
                    onChange={(e) => setManualCo2e(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="e.g. 850"
                    className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    required={!autoCalculate}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Audit Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Submeter billing operations logged for Facility 3..."
                  rows={3}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
              >
                Log Environmental Transaction
              </button>
            </form>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-350 space-y-4">
            <h4 className="text-white font-bold text-base flex items-center">
              <Leaf className="h-5 w-5 text-emerald-500 mr-2" />
              Scope Categories
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong className="text-white block">Scope 1 (Direct)</strong>
                Combustion of fossil fuels at company facilities, natural gas heaters, company diesel/petrol fleet transport.
              </p>
              <p>
                <strong className="text-white block">Scope 2 (Indirect)</strong>
                Utility-purchased grid electricity, centralized heating and cooling operations.
              </p>
              <p>
                <strong className="text-white block">Scope 3 (Supply Chain)</strong>
                Sourcing flights, employee commuting, contractor travel, third-party logistics.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Emissions History Logs</h3>
              <p className="text-xs text-slate-400 mt-1">Full audit registry of logged carbon footprints.</p>
            </div>
            <button onClick={fetchData} className="p-2 rounded hover:bg-slate-100 transition-colors">
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3 text-center">Scope</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Value logged</th>
                  <th className="py-3 px-3 text-right">Emissions equivalent</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No carbon records found. Use the Calculator tab to submit one.
                    </td>
                  </tr>
                ) : (
                  records.map((rec) => (
                    <tr key={rec._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">{formatDate(rec.date)}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-850">{rec.userId?.name || "Self"}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{rec.userId?.department || "No Department"}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          rec.scope === 1 ? "bg-rose-50 text-rose-600" :
                          rec.scope === 2 ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          Scope {rec.scope}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{rec.category}</td>
                      <td className="py-3 px-3 text-right font-medium text-slate-600">{rec.value}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-850">{formatCarbon(rec.co2e)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "goals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            return (
              <div key={goal._id} className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm">{goal.title}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      goal.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                      goal.status === "Achieved" ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{goal.description}</p>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Progress: {percent}%</span>
                    <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.status === "Failed" ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-3">Target Date: {formatDate(goal.deadline)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "factors" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Emissions Factors Table</h3>
            <p className="text-xs text-slate-400 mt-1">Reference parameters used to compile Scope calculations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((f) => (
              <div key={f._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="font-bold text-slate-800 text-xs">{f.activityName}</div>
                <div className="text-slate-500 text-[10px] mt-1">Activity conversion factor</div>
                <div className="mt-3 text-lg font-black text-slate-900">
                  {f.factor} <span className="text-xs font-medium text-slate-500">kg CO2e / {f.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
