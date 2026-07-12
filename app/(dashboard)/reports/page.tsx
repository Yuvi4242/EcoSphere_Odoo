"use client";

import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Download, RefreshCw, FileText, AlertCircle, FileCheck, Calendar, Filter } from "lucide-react";
import api from "@/services/api";
import { formatDate } from "@/utils/formatters";

interface Report {
  _id: string;
  title: string;
  type: string;
  filters: {
    startDate?: string;
    endDate?: string;
    department?: string;
  };
  generatedBy: {
    name: string;
  };
  createdAt: string;
}

export default function ReportsDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"ESG" | "Carbon" | "CSR" | "Governance">("Carbon");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  // Generated dataset
  const [reportData, setReportData] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/reports");
      setReports(res.data.reports || []);

      const deptRes = await api.get("/departments");
      const deptsList = deptRes.data.departments || [];
      setDepartments(deptsList.map((d: any) => d.name));
    } catch (err: any) {
      setError("Error pulling report logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setReportData([]);

    if (!title) {
      setError("Please input a report title.");
      return;
    }

    try {
      const filters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        department: department || undefined,
      };

      const res = await api.post("/reports", { title, type, filters });
      setSuccess("Report generated successfully! Scroll down to audit dataset.");
      setReportData(res.data.data || []);
      fetchReports();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error compiling report.");
    }
  };

  // Convert compiled JSON to CSV format and download directly in browser
  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    try {
      // Find all keys for headers
      const headers = Object.keys(reportData[0]).filter((k) => k !== "_id" && k !== "__v");
      const csvRows = [];
      
      // Header row
      csvRows.push(headers.join(","));

      // Value rows
      for (const row of reportData) {
        const values = headers.map((header) => {
          const val = row[header];
          // Handle nested objects (like user details)
          if (typeof val === "object" && val !== null) {
            return `"${val.name || JSON.stringify(val)}"`;
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
      }

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title.replace(/\s+/g, "_")}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess("CSV file downloaded successfully!");
    } catch (err) {
      setError("Export to CSV failed.");
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:bg-white print:p-0">
      <div className="print:hidden">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <FileSpreadsheet className="h-7 w-7 text-emerald-500 mr-2" />
          ESG Custom Reports Builder
        </h2>
        <p className="text-slate-500 text-sm mt-1">Compile and export sustainability metrics based on custom criteria filters.</p>
      </div>

      {/* Message alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-250 text-rose-705 p-4 rounded-xl flex items-start space-x-2 text-sm print:hidden">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-705 p-4 rounded-xl flex items-start space-x-2 text-sm print:hidden">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Grid of Report Builder Form & Generated lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        
        {/* Report Builder Form */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs print:hidden">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
            <Filter className="h-4.5 w-4.5 text-slate-500 mr-2" />
            Report Builder Filters
          </h3>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q1 Operations Carbon Audit"
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Report Type / Module</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Carbon">Carbon Emissions (Scope 1/2/3)</option>
                <option value="CSR">Social Responsibility (CSR Impact)</option>
                <option value="Governance">Governance (Policies / Acknowledgements)</option>
                <option value="ESG">Overall ESG Audit Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Filter Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- All Departments --</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 text-xs focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-850 text-xs focus:ring-2"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
              Compile Dataset Report
            </button>
          </form>
        </div>

        {/* Generated Reports log listing */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs print:hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Generated Reports Archive</h3>
            <button onClick={fetchReports} className="p-2 rounded hover:bg-slate-100 transition-colors">
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {reports.map((r) => (
              <div key={r._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-800">{r.title}</div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Compiled: {formatDate(r.createdAt)} | Scope: {r.type} | Author: {r.generatedBy?.name}
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600">
                  {r.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Report table dataset */}
      {reportData.length > 0 && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs mt-8 print:border-0 print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-slate-100 mb-6 print:hidden">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Generated Dataset: {title}</h3>
              <p className="text-xs text-slate-400 mt-1">Audit dataset or download format files.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center py-2 px-4 border border-slate-200 hover:border-slate-400 text-slate-700 bg-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export CSV
              </button>
              <button
                onClick={handlePrintPDF}
                className="inline-flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Print / Save PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  {Object.keys(reportData[0]).filter((k) => k !== "_id" && k !== "__v" && k !== "userId" && k !== "volunteers" && k !== "acceptedBy").map((key) => (
                    <th key={key} className="py-3 px-3 capitalize">{key}</th>
                  ))}
                  <th className="py-3 px-3">Metadata Info</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    {Object.keys(row).filter((k) => k !== "_id" && k !== "__v" && k !== "userId" && k !== "volunteers" && k !== "acceptedBy").map((key) => (
                      <td key={key} className="py-3 px-3 font-semibold text-slate-800">{String(row[key])}</td>
                    ))}
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {row.userId ? `User: ${row.userId.name} (${row.userId.department})` : row.volunteers ? `Volunteers Count: ${row.volunteers.length}` : row.acceptedBy ? `Signatures: ${row.acceptedBy.length}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
