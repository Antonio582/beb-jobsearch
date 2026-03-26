"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import { getApplications, saveApplications } from "@/lib/storage";

const statusColors: Record<ApplicationStatus, string> = {
  saved: "bg-gray-100 text-gray-700",
  applied: "bg-blue-100 text-blue-700",
  interview: "bg-yellow-100 text-yellow-700",
  offer: "bg-green-100 text-green-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function Dashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", position: "", status: "saved" as ApplicationStatus, notes: "" });

  useEffect(() => {
    setApps(getApplications());
  }, []);

  const stats = {
    total: apps.length,
    interviews: apps.filter((a) => a.status === "interview").length,
    offers: apps.filter((a) => a.status === "offer").length,
    pending: apps.filter((a) => a.status === "applied").length,
  };

  const addApp = () => {
    if (!form.company || !form.position) return;
    const newApp: Application = {
      id: Date.now().toString(),
      company: form.company,
      position: form.position,
      status: form.status,
      dateApplied: new Date().toISOString().split("T")[0],
      notes: form.notes,
      coverLetter: "",
      resumeVersion: "",
      interviewNotes: "",
      url: "",
    };
    const updated = [newApp, ...apps];
    setApps(updated);
    saveApplications(updated);
    setForm({ company: "", position: "", status: "saved", notes: "" });
    setShowForm(false);
  };

  const recentApps = apps.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">สวัสดี Beb! 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s your job search overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Applications", value: stats.total, icon: "📊", color: "bg-primary-50 text-primary-700" },
          { label: "Interviews", value: stats.interviews, icon: "🎤", color: "bg-yellow-50 text-yellow-700" },
          { label: "Offers", value: stats.offers, icon: "🎉", color: "bg-green-50 text-green-700" },
          { label: "Pending", value: stats.pending, icon: "⏳", color: "bg-blue-50 text-blue-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.color}`}>{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Application Pipeline</h2>
        <div className="flex flex-wrap gap-2">
          {(["saved", "applied", "interview", "offer", "accepted", "rejected"] as ApplicationStatus[]).map((status) => {
            const count = apps.filter((a) => a.status === status).length;
            return (
              <div key={status} className="flex-1 min-w-[100px] text-center p-3 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold">{count}</p>
                <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${statusColors[status]}`}>{statusLabels[status]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Add + Recent */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Add</h2>
            <button onClick={() => setShowForm(!showForm)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {showForm ? "Cancel" : "+ Add Job"}
            </button>
          </div>
          {showForm && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(statusLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
              />
              <button onClick={addApp} className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Add Application
              </button>
            </div>
          )}
          {!showForm && apps.length === 0 && (
            <p className="text-gray-400 text-sm">No applications yet. Click &quot;+ Add Job&quot; to get started!</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
          {recentApps.length === 0 ? (
            <p className="text-gray-400 text-sm">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{app.company}</p>
                    <p className="text-xs text-gray-500">{app.position}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[app.status]}`}>{statusLabels[app.status]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
