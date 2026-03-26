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

const emptyForm: Omit<Application, "id"> = {
  company: "", position: "", status: "saved", dateApplied: new Date().toISOString().split("T")[0],
  notes: "", coverLetter: "", resumeVersion: "", interviewNotes: "", url: "",
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { setApps(getApplications()); }, []);

  const filtered = apps
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => !search || a.company.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase()));

  const save = (updated: Application[]) => { setApps(updated); saveApplications(updated); };

  const handleSubmit = () => {
    if (!form.company || !form.position) return;
    if (editingId) {
      save(apps.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)));
      setEditingId(null);
    } else {
      save([{ ...form, id: Date.now().toString() }, ...apps]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (app: Application) => {
    const { id, ...rest } = app;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const deleteApp = (id: string) => { save(apps.filter((a) => a.id !== id)); };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    save(apps.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Applications</h1>
          <p className="text-sm text-gray-500">{apps.length} total applications</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          + New Application
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">{editingId ? "Edit Application" : "New Application"}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input type="text" placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input type="text" placeholder="Position *" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input type="date" value={form.dateApplied} onChange={(e) => setForm({ ...form, dateApplied: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input type="url" placeholder="Job URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2" />
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2" />
            <textarea placeholder="Cover Letter" value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} rows={3} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2" />
            <textarea placeholder="Interview Notes" value={form.interviewNotes} onChange={(e) => setForm({ ...form, interviewNotes: e.target.value })} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">{editingId ? "Save Changes" : "Add Application"}</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by company or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
          {(Object.entries(statusLabels) as [ApplicationStatus, string][]).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === k ? statusColors[k] : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Application Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <p className="text-gray-400">No applications found. {apps.length === 0 ? "Start by adding your first application!" : "Try changing filters."}</p>
          </div>
        )}
        {filtered.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{app.company}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[app.status]}`}>{statusLabels[app.status]}</span>
                </div>
                <p className="text-sm text-gray-600">{app.position}</p>
                <p className="text-xs text-gray-400 mt-1">{app.dateApplied}</p>
              </div>
              <span className="text-gray-400 text-sm">{expandedId === app.id ? "▲" : "▼"}</span>
            </div>
            {expandedId === app.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                {app.notes && <div className="mb-3"><p className="text-xs font-medium text-gray-500 uppercase mb-1">Notes</p><p className="text-sm text-gray-700">{app.notes}</p></div>}
                {app.coverLetter && <div className="mb-3"><p className="text-xs font-medium text-gray-500 uppercase mb-1">Cover Letter</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{app.coverLetter}</p></div>}
                {app.interviewNotes && <div className="mb-3"><p className="text-xs font-medium text-gray-500 uppercase mb-1">Interview Notes</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{app.interviewNotes}</p></div>}
                {app.url && <div className="mb-3"><p className="text-xs font-medium text-gray-500 uppercase mb-1">Job URL</p><a href={app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{app.url}</a></div>}
                <div className="flex flex-wrap gap-2 mt-4">
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)} className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none">
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button onClick={() => startEdit(app)} className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium hover:bg-primary-200">Edit</button>
                  <button onClick={() => deleteApp(app.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
