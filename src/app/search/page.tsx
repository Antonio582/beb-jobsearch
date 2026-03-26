"use client";

import { useState, useEffect } from "react";
import { SavedJob } from "@/types";
import { getSavedJobs, saveSavedJobs } from "@/lib/storage";

const categories = [
  { name: "Manufacturing", icon: "🏭", keywords: "Manufacturing Engineer Thailand" },
  { name: "Supply Chain", icon: "📦", keywords: "Supply Chain Analyst Thailand" },
  { name: "Quality", icon: "✅", keywords: "Quality Engineer Thailand" },
  { name: "Process Improvement", icon: "📈", keywords: "Process Improvement Engineer Thailand" },
  { name: "Logistics", icon: "🚛", keywords: "Logistics Engineer Thailand" },
  { name: "Project Management", icon: "📊", keywords: "Project Manager Industrial Thailand" },
  { name: "Production", icon: "⚙️", keywords: "Production Engineer Thailand" },
  { name: "Lean / Six Sigma", icon: "🎯", keywords: "Lean Engineer Six Sigma Thailand" },
];

const jobSites = [
  { name: "JobThai", url: "https://www.jobthai.com/en/jobs?keyword=", icon: "🇹🇭", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "LinkedIn Thailand", url: "https://www.linkedin.com/jobs/search/?keywords=", icon: "💼", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { name: "Indeed Thailand", url: "https://th.indeed.com/jobs?q=", icon: "🔍", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Google Jobs", url: "https://www.google.com/search?ibp=htl;jobs&q=", icon: "🌐", color: "bg-green-50 text-green-700 border-green-200" },
];

export default function SearchPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveForm, setSaveForm] = useState({ title: "", company: "", location: "", url: "", source: "", category: "" });

  useEffect(() => { setSavedJobs(getSavedJobs()); }, []);

  const saveJob = () => {
    if (!saveForm.title) return;
    const job: SavedJob = { ...saveForm, id: Date.now().toString(), savedDate: new Date().toISOString().split("T")[0] };
    const updated = [job, ...savedJobs];
    setSavedJobs(updated);
    saveSavedJobs(updated);
    setSaveForm({ title: "", company: "", location: "", url: "", source: "", category: "" });
    setShowSaveForm(false);
  };

  const removeJob = (id: string) => {
    const updated = savedJobs.filter((j) => j.id !== id);
    setSavedJobs(updated);
    saveSavedJobs(updated);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🔍 Job Search</h1>
        <p className="text-sm text-gray-500">Find Industrial Engineering jobs in Thailand</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Search by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h3 className="font-medium text-sm mb-3">{cat.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {jobSites.map((site) => (
                  <a key={site.name} href={`${site.url}${encodeURIComponent(cat.keywords)}`} target="_blank" rel="noopener noreferrer" className={`text-xs px-2 py-1 rounded-full border ${site.color} hover:opacity-80 transition-opacity`}>
                    {site.icon} {site.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Search All Sites</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {jobSites.map((site) => (
            <a key={site.name} href={`${site.url}${encodeURIComponent("Industrial Engineer Thailand")}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-3 rounded-xl border ${site.color} hover:opacity-80 transition-opacity`}>
              <span className="text-xl">{site.icon}</span>
              <span className="text-sm font-medium">{site.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Saved Jobs */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">💾 Saved Jobs ({savedJobs.length})</h2>
          <button onClick={() => setShowSaveForm(!showSaveForm)} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {showSaveForm ? "Cancel" : "+ Save Job"}
          </button>
        </div>

        {showSaveForm && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Job Title *" value={saveForm.title} onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="text" placeholder="Company" value={saveForm.company} onChange={(e) => setSaveForm({ ...saveForm, company: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="text" placeholder="Location" value={saveForm.location} onChange={(e) => setSaveForm({ ...saveForm, location: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="url" placeholder="Job URL" value={saveForm.url} onChange={(e) => setSaveForm({ ...saveForm, url: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <select value={saveForm.source} onChange={(e) => setSaveForm({ ...saveForm, source: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Source</option>
                {jobSites.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                <option value="Other">Other</option>
              </select>
              <select value={saveForm.category} onChange={(e) => setSaveForm({ ...saveForm, category: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Category</option>
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={saveJob} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save Job</button>
          </div>
        )}

        {savedJobs.length === 0 ? (
          <p className="text-gray-400 text-sm">No saved jobs yet. Find interesting listings and save them here!</p>
        ) : (
          <div className="space-y-2">
            {savedJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium">{job.title}</h3>
                    {job.category && <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{job.category}</span>}
                    {job.source && <span className="text-xs text-gray-400">{job.source}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{[job.company, job.location].filter(Boolean).join(" • ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">Open ↗</a>}
                  <button onClick={() => removeJob(job.id)} className="text-xs text-gray-400 hover:text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
