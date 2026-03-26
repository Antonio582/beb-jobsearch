"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { getResume, saveResume } from "@/lib/storage";
import { ResumeData } from "@/types";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Card } from "@/components/Card";

type Section = "personal" | "education" | "experience" | "skills" | "projects" | "activities";

export default function ResumePage() {
  const { t } = useLanguage();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setResume(getResume());
    setLoading(false);
  }, []);

  const save = (data: ResumeData) => {
    setResume(data);
    saveResume(data);
  };

  if (loading || !resume) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 rounded-xl w-64" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  const sections: { key: Section; label: string; icon: string }[] = [
    { key: "personal", label: t("personalInfo"), icon: "👤" },
    { key: "education", label: t("education"), icon: "🎓" },
    { key: "experience", label: t("experience"), icon: "💼" },
    { key: "skills", label: t("skills"), icon: "⚡" },
    { key: "projects", label: t("projects"), icon: "🚀" },
    { key: "activities", label: t("activities"), icon: "🏅" },
  ];

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold text-[#E8E8ED] tracking-tight mb-6">
        {t("resume")}
      </h1>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((s) => (
          <motion.button
            key={s.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === s.key
                ? "bg-[#7C5CFC] text-white"
                : "bg-[#141415] text-[#8B8B96] border border-[#1F1F22] hover:border-[#7C5CFC]/30"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Personal Info */}
          {activeSection === "personal" && (
            <Card hover={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["name", "title", "email", "phone", "location", "linkedin"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs text-[#8B8B96] mb-1 block">{t(field)}</label>
                    <input
                      value={resume.personalInfo[field]}
                      onChange={(e) =>
                        save({ ...resume, personalInfo: { ...resume.personalInfo, [field]: e.target.value } })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-xs text-[#8B8B96] mb-1 block">{t("summary")}</label>
                  <textarea
                    value={resume.personalInfo.summary}
                    onChange={(e) =>
                      save({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })
                    }
                    className="w-full h-24 resize-none"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Education */}
          {activeSection === "education" && (
            <StaggerContainer className="space-y-3">
              {resume.education.map((edu, i) => (
                <StaggerItem key={edu.id}>
                  <Card hover={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("institution")}</label>
                        <input
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[i] = { ...edu, institution: e.target.value };
                            save({ ...resume, education: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("degree")}</label>
                        <input
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[i] = { ...edu, degree: e.target.value };
                            save({ ...resume, education: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("field")}</label>
                        <input
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[i] = { ...edu, field: e.target.value };
                            save({ ...resume, education: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("location")}</label>
                        <input
                          value={edu.location}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[i] = { ...edu, location: e.target.value };
                            save({ ...resume, education: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("gpa")}</label>
                        <input
                          value={edu.gpa}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[i] = { ...edu, gpa: e.target.value };
                            save({ ...resume, education: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        save({ ...resume, education: resume.education.filter((_, idx) => idx !== i) });
                      }}
                      className="mt-3 px-3 py-1.5 text-xs bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors"
                    >
                      {t("delete")}
                    </motion.button>
                  </Card>
                </StaggerItem>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  save({
                    ...resume,
                    education: [...resume.education, { id: Date.now().toString(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", gpa: "", highlights: [] }],
                  });
                }}
                className="w-full p-3 border border-dashed border-[#1F1F22] rounded-xl text-sm text-[#8B8B96] hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-colors"
              >
                + {t("addEducation")}
              </motion.button>
            </StaggerContainer>
          )}

          {/* Experience */}
          {activeSection === "experience" && (
            <StaggerContainer className="space-y-3">
              {resume.experience.map((exp, i) => (
                <StaggerItem key={exp.id}>
                  <Card hover={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("company")}</label>
                        <input
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[i] = { ...exp, company: e.target.value };
                            save({ ...resume, experience: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("position")}</label>
                        <input
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[i] = { ...exp, position: e.target.value };
                            save({ ...resume, experience: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("location")}</label>
                        <input
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[i] = { ...exp, location: e.target.value };
                            save({ ...resume, experience: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs text-[#8B8B96] mb-1 block">Description (one per line)</label>
                      <textarea
                        value={exp.description.join("\n")}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[i] = { ...exp, description: e.target.value.split("\n") };
                          save({ ...resume, experience: updated });
                        }}
                        className="w-full h-20 resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        save({ ...resume, experience: resume.experience.filter((_, idx) => idx !== i) });
                      }}
                      className="mt-3 px-3 py-1.5 text-xs bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors"
                    >
                      {t("delete")}
                    </motion.button>
                  </Card>
                </StaggerItem>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  save({
                    ...resume,
                    experience: [...resume.experience, { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: [] }],
                  });
                }}
                className="w-full p-3 border border-dashed border-[#1F1F22] rounded-xl text-sm text-[#8B8B96] hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-colors"
              >
                + {t("addExperience")}
              </motion.button>
            </StaggerContainer>
          )}

          {/* Skills */}
          {activeSection === "skills" && (
            <StaggerContainer className="space-y-4">
              {(["technical", "software", "languages", "certifications"] as const).map((cat) => (
                <StaggerItem key={cat}>
                  <Card hover={false}>
                    <label className="text-xs text-[#8B8B96] mb-2 block font-medium">{t(cat)}</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resume.skills[cat].map((skill, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] text-xs"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const updated = { ...resume.skills, [cat]: resume.skills[cat].filter((_, idx) => idx !== i) };
                              save({ ...resume, skills: updated });
                            }}
                            className="ml-1 hover:text-[#EF4444] transition-colors"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    <input
                      placeholder="Type and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          const updated = { ...resume.skills, [cat]: [...resume.skills[cat], e.currentTarget.value.trim()] };
                          save({ ...resume, skills: updated });
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full"
                    />
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Projects */}
          {activeSection === "projects" && (
            <StaggerContainer className="space-y-3">
              {resume.projects.map((proj, i) => (
                <StaggerItem key={proj.id}>
                  <Card hover={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("name")}</label>
                        <input
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[i] = { ...proj, name: e.target.value };
                            save({ ...resume, projects: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">{t("url")}</label>
                        <input
                          value={proj.link}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[i] = { ...proj, link: e.target.value };
                            save({ ...resume, projects: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs text-[#8B8B96] mb-1 block">Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[i] = { ...proj, description: e.target.value };
                          save({ ...resume, projects: updated });
                        }}
                        className="w-full h-16 resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        save({ ...resume, projects: resume.projects.filter((_, idx) => idx !== i) });
                      }}
                      className="mt-3 px-3 py-1.5 text-xs bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors"
                    >
                      {t("delete")}
                    </motion.button>
                  </Card>
                </StaggerItem>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  save({
                    ...resume,
                    projects: [...resume.projects, { id: Date.now().toString(), name: "", description: "", technologies: [], date: "", link: "" }],
                  });
                }}
                className="w-full p-3 border border-dashed border-[#1F1F22] rounded-xl text-sm text-[#8B8B96] hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-colors"
              >
                + {t("addProject")}
              </motion.button>
            </StaggerContainer>
          )}

          {/* Activities */}
          {activeSection === "activities" && (
            <StaggerContainer className="space-y-3">
              {resume.activities.map((act, i) => (
                <StaggerItem key={act.id}>
                  <Card hover={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">Organization</label>
                        <input
                          value={act.organization}
                          onChange={(e) => {
                            const updated = [...resume.activities];
                            updated[i] = { ...act, organization: e.target.value };
                            save({ ...resume, activities: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#8B8B96] mb-1 block">Role</label>
                        <input
                          value={act.role}
                          onChange={(e) => {
                            const updated = [...resume.activities];
                            updated[i] = { ...act, role: e.target.value };
                            save({ ...resume, activities: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs text-[#8B8B96] mb-1 block">Description</label>
                      <textarea
                        value={act.description}
                        onChange={(e) => {
                          const updated = [...resume.activities];
                          updated[i] = { ...act, description: e.target.value };
                          save({ ...resume, activities: updated });
                        }}
                        className="w-full h-16 resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        save({ ...resume, activities: resume.activities.filter((_, idx) => idx !== i) });
                      }}
                      className="mt-3 px-3 py-1.5 text-xs bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 transition-colors"
                    >
                      {t("delete")}
                    </motion.button>
                  </Card>
                </StaggerItem>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  save({
                    ...resume,
                    activities: [...resume.activities, { id: Date.now().toString(), organization: "", role: "", date: "", description: "" }],
                  });
                }}
                className="w-full p-3 border border-dashed border-[#1F1F22] rounded-xl text-sm text-[#8B8B96] hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-colors"
              >
                + {t("addActivity")}
              </motion.button>
            </StaggerContainer>
          )}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
