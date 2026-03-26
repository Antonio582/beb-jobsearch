"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { getApplications, saveApplications } from "@/lib/storage";
import { Application, ApplicationStatus } from "@/types";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TranslationKey } from "@/lib/translations";

const statuses: ApplicationStatus[] = ["saved", "applied", "interview", "offer", "accepted", "rejected"];

const emptyApp: Application = {
  id: "",
  company: "",
  position: "",
  status: "saved",
  dateApplied: new Date().toISOString().split("T")[0],
  notes: "",
  coverLetter: "",
  resumeVersion: "",
  interviewNotes: "",
  url: "",
};

export default function ApplicationsPage() {
  const { t } = useLanguage();
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Application | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApps(getApplications());
    setLoading(false);
  }, []);

  const persist = useCallback((updated: Application[]) => {
    setApps(updated);
    saveApplications(updated);
  }, []);

  const filtered = apps.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSave = (app: Application) => {
    if (app.id) {
      persist(apps.map((a) => (a.id === app.id ? app : a)));
    } else {
      const newApp = { ...app, id: Date.now().toString() };
      persist([...apps, newApp]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(apps.filter((a) => a.id !== id));
    setExpanded(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#E8E8ED] tracking-tight">
          {t("applications")}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditing({ ...emptyApp }); setShowForm(true); }}
          className="px-4 py-2.5 bg-[#7C5CFC] hover:bg-[#8D70FD] text-white rounded-lg text-sm font-medium transition-colors"
        >
          + {t("addApplication")}
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === "all" ? "bg-[#7C5CFC] text-white" : "bg-[#141415] text-[#8B8B96] border border-[#1F1F22] hover:border-[#7C5CFC]/30"
            }`}
          >
            {t("filterAll")} ({apps.length})
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === s ? "bg-[#7C5CFC] text-white" : "bg-[#141415] text-[#8B8B96] border border-[#1F1F22] hover:border-[#7C5CFC]/30"
              }`}
            >
              {t(s as TranslationKey)} ({apps.filter((a) => a.status === s).length})
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:ml-auto w-full sm:w-64"
        />
      </div>

      {/* List */}
      <StaggerContainer className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((app) => (
            <StaggerItem key={app.id}>
              <motion.div layout>
                <Card
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  className="transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E8E8ED] truncate">{app.position}</p>
                      <p className="text-xs text-[#8B8B96]">{app.company}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span className="text-xs text-[#55555E] hidden sm:block">{app.dateApplied}</span>
                      <StatusBadge status={app.status} />
                      <motion.svg
                        animate={{ rotate: expanded === app.id ? 180 : 0 }}
                        className="w-4 h-4 text-[#55555E]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === app.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mt-4 pt-4 border-t border-[#1F1F22] space-y-3">
                          {app.url && (
                            <p className="text-xs">
                              <span className="text-[#55555E]">{t("url")}: </span>
                              <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">
                                {app.url}
                              </a>
                            </p>
                          )}
                          {app.notes && (
                            <p className="text-xs text-[#8B8B96]">
                              <span className="text-[#55555E]">{t("notes")}: </span>{app.notes}
                            </p>
                          )}
                          {app.interviewNotes && (
                            <p className="text-xs text-[#8B8B96]">
                              <span className="text-[#55555E]">{t("interviewNotes")}: </span>{app.interviewNotes}
                            </p>
                          )}
                          <div className="flex gap-2 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => { setEditing(app); setShowForm(true); }}
                              className="px-3 py-1.5 text-xs bg-[#7C5CFC]/10 text-[#7C5CFC] rounded-lg hover:bg-[#7C5CFC]/20 transition-colors"
                            >
                              {t("edit")}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(app.id)}
                              className="px-3 py-1.5 text-xs bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors"
                            >
                              {t("delete")}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerContainer>

      {filtered.length === 0 && (
        <Card hover={false}>
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#8B8B96]">{t("noApplicationsYet")}</p>
          </div>
        </Card>
      )}

      {/* Modal */}
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
              className="glass rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-semibold text-[#E8E8ED] mb-4">
                {editing.id ? t("edit") : t("addApplication")}
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("company")}</label>
                  <input
                    value={editing.company}
                    onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("position")}</label>
                  <input
                    value={editing.position}
                    onChange={(e) => setEditing({ ...editing, position: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("status")}</label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as ApplicationStatus })}
                    className="w-full"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{t(s as TranslationKey)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("dateApplied")}</label>
                  <input
                    type="date"
                    value={editing.dateApplied}
                    onChange={(e) => setEditing({ ...editing, dateApplied: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("url")}</label>
                  <input
                    value={editing.url}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("notes")}</label>
                  <textarea
                    value={editing.notes}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                    className="w-full h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("interviewNotes")}</label>
                  <textarea
                    value={editing.interviewNotes}
                    onChange={(e) => setEditing({ ...editing, interviewNotes: e.target.value })}
                    className="w-full h-20 resize-none"
                  />
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
