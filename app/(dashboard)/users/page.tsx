"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, RefreshCw, AlertCircle, FileCheck, Shield, Mail, Key } from "lucide-react";
import api from "@/services/api";
import { useAuthUser } from "@/hooks/use-auth";

interface UserAccount {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  department?: string;
  xp: number;
  level: number;
}

export default function UsersDashboard() {
  const { user } = useAuthUser();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [depts, setDepts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States (Register User)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"ADMIN" | "MANAGER" | "EMPLOYEE">("EMPLOYEE");
  const [regDept, setRegDept] = useState("");

  // Edit states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<"ADMIN" | "MANAGER" | "EMPLOYEE">("EMPLOYEE");
  const [editDept, setEditDept] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);

      const deptRes = await api.get("/departments");
      const list = deptRes.data.departments || [];
      setDepts(list.map((d: any) => d.name));
    } catch (err: any) {
      setError(err.response?.data?.error || "Error pulling user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!regName || !regEmail || !regPassword) {
      setError("Please fill all required inputs.");
      return;
    }

    try {
      await api.post("/users", {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDept || undefined,
      });

      setSuccess(`User account created successfully!`);
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register user.");
    }
  };

  const handleEditClick = (account: UserAccount) => {
    setEditingUserId(account._id);
    setEditRole(account.role);
    setEditDept(account.department || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!editingUserId) return;

    try {
      await api.patch("/users", {
        id: editingUserId,
        role: editRole,
        department: editDept || undefined,
      });

      setSuccess("User configurations updated successfully!");
      setEditingUserId(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update user.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Users className="h-7 w-7 text-slate-500 mr-2" />
          Employee & User Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">Audit employee profiles, assign corporate roles, and configure department settings.</p>
      </div>

      {/* Message alerts */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Table Accounts List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Organizational Users</h3>
            <button onClick={fetchData} className="p-2 rounded hover:bg-slate-100 transition-colors">
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Gamification</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((acc) => (
                  <tr key={acc._id} className="border-b border-slate-100 hover:bg-slate-55/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{acc.name}</td>
                    <td className="py-3 px-3 text-slate-500 font-medium">{acc.email}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        acc.role === "ADMIN" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                        acc.role === "MANAGER" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-600"
                      }`}>
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600">{acc.department || "-"}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      Lvl {acc.level} | {acc.xp} XP
                    </td>
                    <td className="py-3 px-3 text-right">
                      {user && user.role === "ADMIN" && (
                        <button
                          onClick={() => handleEditClick(acc)}
                          className="text-slate-400 hover:text-slate-700 font-semibold"
                        >
                          Configure
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Context Card (Edit User OR Register User) */}
        <div className="space-y-6">
          {editingUserId ? (
            /* Edit User Form */
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Edit Employee Settings</h4>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role Assignment</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Department</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="">-- None --</option>
                    {depts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-slate-850 hover:bg-slate-750 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="flex-1 py-2 border border-slate-200 hover:border-slate-350 text-slate-700 bg-white rounded-lg text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Register User Form (Admin Only) */
            user && user.role === "ADMIN" && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-200">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center">
                  <Plus className="h-4 w-4 mr-1 text-emerald-500" />
                  Register Employee
                </h4>
                <form onSubmit={handleRegisterUser} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Temporary Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Role Assignment</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Department</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="block w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="">-- None --</option>
                      {depts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                    Register User
                  </button>
                </form>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
