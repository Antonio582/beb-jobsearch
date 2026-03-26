"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { getSavedJobs, saveSavedJobs } from "@/lib/storage";
import { SavedJob } from "@/types";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Card } from "@/components/Card";

const categories = [
  { key: "manufacturing", icon: "🏭", color: "#7C5CFC" },
  { key: "supplyChain", icon: "📦", color: "#3B82F6" },
  { key: "qualityEngineering", icon: "✅", color: "#22C55E" },
  { key: "processImprovement", icon: "⚙️", color: "#F59E0B" },
  { key: "generalJobs", icon: "💼", color: "#EF4444" },
] as const;

const jobBoards = [
  { name: "JobsDB Thailand", url: "https://th.jobsdb.com", icon: "🇹🇭" },
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", icon: "💼" },
  { name: "JobThai", url: "https://www.jobthai.com", icon: "🔍" },
  { name: "Indeed Thailand", url: "https://th.indeed.com", icon: "🌐" },
  { name: "Glassdoor", url: "https://www.glassdoor.com", icon: "⭐" },
];

const emptyJob: SavedJob = {
  id: "",
  title: "",
  company: "",
  location: "",
  url: "",
  source: "",
  savedDate: new Date().toISOString().split("T")[0],
  category: "manufacturing",
};

export default function SearchPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SavedJob | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setJobs(getSavedJobs());
    setLoading(false);
  }, []);

  const persist = (updated: SavedJob[]) => {
    setJobs(updated);
    saveSavedJobs(updated);
  };

  const handleSave = (job: SavedJob) => {
    if (job.id) {
      persist(jobs.map((j) => (j.id === job.id ? job : j)));
    } else {
      persist([...jobs, { ...job, id: Date.now().toString() }]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(jobs.filter((j) => j.id !== id));
  };

  const filtered = filterCat === "all" ? jobs : jobs.filter((j) => j.category === filterCat);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold text-[#E8E8ED] tracking-tight mb-6">
        {t("jobSearch")}
      </h1>

      {/* Category Cards */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {categories.map((cat) => (
          <StaggerItem key={cat.key}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterCat(filterCat === cat.key ? "all" : cat.key)}
              className={`w-full p-4 rounded-xl text-center transition-all border ${
                filterCat === cat.key
                  ? "border-[var(--cat-color)] bg-[var(--cat-color)]/10"
                  : "border-[#1F1F22] bg-[#141415] hover:border-[var(--cat-color)]/30"
              }`}
              style={{ "--cat-color": cat.color } as React.CSSProperties}
            >
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <span className="text-xs font-medium text-[#E8E8ED]">
                {t(cat.key)}
              </span>
              <p className="text-xs text-[#55555E] mt-1">
                {jobs.filter((j) => j.category === cat.key).length} {t("saved").toLowerCase()}
              </p>
            </motion.button>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Job Boards */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-semibold text-[#8B8B96] uppercase tracking-wider mb-3"
      >
        {t("jobBoards")}
      </motion.h3>
      <StaggerContainer className="flex flex-wrap gap-2 mb-8">
        {jobBoards.map((board) => (
          <StaggerItem key={board.name}>
            <a
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141415] border border-[#1F1F22] text-sm text-[#8B8B96] hover:text-[#3B82F6] hover:border-[#3B82F6]/30 transition-colors cursor-pointer"
              >
                <span>{board.icon}</span>
                {board.name}
              </motion.span>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Saved Jobs */}
      <div className="flex items-center justify-between mb-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold text-[#8B8B96] uppercase tracking-wider"
        >
          {t("savedJobs")} ({filtered.length})
        </motion.h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditing({ ...emptyJob }); setShowForm(true); }}
          className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#8D70FD] text-white rounded-lg text-sm font-medium transition-colors"
        >
          + {t("addSavedJob")}
        </motion.button>
      </div>

      {filtered.length === 0 ? (
        <Card hover={false}>
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[#8B8B96]">{t("noSavedJobs")}</p>
          </div>
        </Card>
      ) : (
        <StaggerContainer className="space-y-2">
          {filtered.map((job) => (
            <StaggerItem key={job.id}>
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#E8E8ED] truncate">{job.title}</p>
                    <p className="text-xs text-[#8B8B96]">{job.company} · {job.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#55555E]">{job.source}</span>
                      <span className="text-xs text-[#55555E]">·</span>
                      <span className="text-xs text-[#55555E]">{job.savedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-[#1F1F22] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleDelete(job.id)}
                      className="p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#55555E] hover:text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowForm(false); setEditing(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-xl p-6 w-full max-w-lg"
            >
              <h2 className="text-lg font-semibold text-[#E8E8ED] mb-4">{t("addSavedJob")}</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("jobTitle")}</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("company")}</label>
                  <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("location")}</label>
                  <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("url")}</label>
                  <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("source")}</label>
                  <input value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("category")}</label>
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full">
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>{t(c.key)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-4 py-2 text-sm text-[#8B8B96] border border-[#1F1F22] rounded-lg hover:bg-[#1F1F22]/50 transition-colors"
                >
                  {t("cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSave(editing)}
                  className="px-4 py-2 text-sm bg-[#7C5CFC] hover:bg-[#8D70FD] text-white rounded-lg transition-colors"
                >
                  {t("save")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
