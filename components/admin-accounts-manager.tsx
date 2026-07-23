"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Check, 
  AlertCircle, 
  Lock, 
  Mail, 
  UserCheck, 
  Sparkles,
  RefreshCw,
  Key
} from "lucide-react";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  superAdmin: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  createdBy?: string;
}

export function AdminAccountsManager() {
  const [admins, setAdmins] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Co-Administrator",
    password: ""
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error("Failed to load admin accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setNotice({ type: "error", text: "Please fill out all required fields." });
      return;
    }

    setCreating(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createdBy: "Grand Admiral Command"
        })
      });

      const data = await res.json();
      if (data.success) {
        setNotice({ type: "success", text: data.message });
        setForm({ name: "", email: "", role: "Co-Administrator", password: "" });
        await fetchAdmins();
      } else {
        setNotice({ type: "error", text: data.message || "Failed to create admin account." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Server connection error." });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to revoke administrative clearance for '${adminName}'?`)) return;

    setDeletingId(adminId);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });

      const data = await res.json();
      if (data.success) {
        setNotice({ type: "success", text: data.message });
        await fetchAdmins();
      } else {
        setNotice({ type: "error", text: data.message || "Failed to delete admin." });
      }
    } catch (err) {
      setNotice({ type: "error", text: "Error deleting admin." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Multi-Admin Security clearance
            </span>
            <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
              <Shield className="text-amber-500" size={22} /> Admin Accounts & Role Delegations
            </h2>
            <p className="text-xs text-slate-400 font-light max-w-2xl">
              Grant administrative access to multiple commanders. Added administrators can log in with their email and password to manage the portal with full administrative rights.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdmins}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold rounded-lg transition-all cursor-pointer self-start md:self-auto"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh Accounts
          </button>
        </div>
      </div>

      {notice && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          notice.type === "success"
            ? "bg-emerald-950/50 border-emerald-800/80 text-emerald-200"
            : "bg-red-950/50 border-red-800/80 text-red-200"
        }`}>
          {notice.type === "success" ? <Check className="text-emerald-400 shrink-0" size={16} /> : <AlertCircle className="text-red-400 shrink-0" size={16} />}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Create New Admin Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-serif text-amber-400 flex items-center gap-2">
              <UserPlus size={16} /> Add New Administrator
            </h3>
            <p className="text-[11px] text-slate-400 font-light">
              Create an administrative profile with login credentials.
            </p>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="E.g. Vice Admiral Sarah Chukwuyem"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-light focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="coadmin@saeahawks.org or personal email"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-light focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Administrative Title / Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-light focus:outline-none focus:border-amber-500"
              >
                <option value="Grand Admiral">Grand Admiral</option>
                <option value="Vice Admiral">Vice Admiral</option>
                <option value="Co-Administrator">Co-Administrator</option>
                <option value="Fleet Operations Lead">Fleet Operations Lead</option>
                <option value="Scribe Lead & Logistics">Scribe Lead & Logistics</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Admin Account Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set secure password for login"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-light focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <UserCheck size={16} />
              {creating ? "Creating Admin..." : "Grant Admin Clearance & Add Account"}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Administrators Roll */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                <Shield className="text-amber-500" size={16} /> Active Admin Accounts
              </h3>
              <p className="text-[11px] text-slate-400 font-light">
                Accounts with full administrative permissions.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold rounded-full">
              {admins.length} Authorized
            </span>
          </div>

          <div className="space-y-3">
            {admins.map((adm) => (
              <div
                key={adm.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{adm.name}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold rounded border border-amber-500/20">
                      {adm.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-slate-500" /> {adm.email}
                    </span>
                    <span>• Status: <span className="text-emerald-400 font-bold">{adm.status}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                    disabled={deletingId === adm.id || admins.length <= 1}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Revoke Admin Access"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
