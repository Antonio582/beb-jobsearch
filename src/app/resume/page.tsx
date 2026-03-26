"use client";

import { useState, useEffect, useRef } from "react";
import { ResumeData, Education, Experience, Project, Activity } from "@/types";
import { getResume, saveResume } from "@/lib/storage";

function EditableText({ value, onChange, placeholder, className = "", multiline = false }: {
  value: string; onChange: (v: string) => void; placeholder: string; className?: string; multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  if (editing) {
    const props = {
      ref: inputRef as never,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: () => { onChange(draft); setEditing(false); },
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" && !multiline) { onChange(draft); setEditing(false); } if (e.key === "Escape") { setDraft(value); setEditing(false); } },
      className: `w-full px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${className}`,
      placeholder,
    };
    return multiline ? <textarea {...props} rows={3} /> : <input type="text" {...props} />;
  }

  return (
    <span onClick={() => setEditing(true)} className={`cursor-pointer hover:bg-primary-50 px-1 rounded transition-colors ${!value ? "text-gray-400 italic" : ""} ${className}`}>
      {value || placeholder}
    </span>
  );
}

function EditableList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [newItem, setNewItem] = useState("");

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 ml-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } }}
          placeholder={placeholder}
          className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <button onClick={() => { if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } }} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs hover:bg-primary-200">+</button>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setResume(getResume()); }, []);

  if (!resume) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Loading...</p></div>;

  const update = (partial: Partial<ResumeData>) => {
    const updated = { ...resume, ...partial };
    setResume(updated);
    saveResume(updated);
  };

  const updatePersonal = (field: string, value: string) => {
    update({ personalInfo: { ...resume.personalInfo, [field]: value } });
  };

  const addEducation = () => {
    const item: Education = { id: Date.now().toString(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", gpa: "", highlights: [] };
    update({ education: [...resume.education, item] });
  };

  const updateEducation = (id: string, field: string, value: string | string[]) => {
    update({ education: resume.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  };

  const removeEducation = (id: string) => { update({ education: resume.education.filter((e) => e.id !== id) }); };

  const addExperience = () => {
    const item: Experience = { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: [] };
    update({ experience: [...resume.experience, item] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean | string[]) => {
    update({ experience: resume.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  };

  const removeExperience = (id: string) => { update({ experience: resume.experience.filter((e) => e.id !== id) }); };

  const addProject = () => {
    const item: Project = { id: Date.now().toString(), name: "", description: "", technologies: [], date: "", link: "" };
    update({ projects: [...resume.projects, item] });
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    update({ projects: resume.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });
  };

  const removeProject = (id: string) => { update({ projects: resume.projects.filter((p) => p.id !== id) }); };

  const addActivity = () => {
    const item: Activity = { id: Date.now().toString(), organization: "", role: "", date: "", description: "" };
    update({ activities: [...resume.activities, item] });
  };

  const updateActivity = (id: string, field: string, value: string) => {
    update({ activities: resume.activities.map((a) => (a.id === id ? { ...a, [field]: value } : a)) });
  };

  const removeActivity = (id: string) => { update({ activities: resume.activities.filter((a) => a.id !== id) }); };

  const exportPDF = () => {
    const prev = mode;
    setMode("preview");
    setTimeout(() => {
      window.print();
      setMode(prev);
    }, 100);
  };

  if (mode === "preview") {
    return (
      <div>
        <div className="flex gap-3 mb-6 print:hidden">
          <button onClick={() => setMode("edit")} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">← Back to Editor</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">📄 Export PDF</button>
        </div>
        <div ref={printRef} className="bg-white max-w-[800px] mx-auto p-8 md:p-12 shadow-lg print:shadow-none print:p-0">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
            <h1 className="text-2xl font-bold tracking-wide uppercase">{resume.personalInfo.name || "Your Name"}</h1>
            <p className="text-sm text-gray-600 mt-1">{resume.personalInfo.title}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-gray-600">
              {resume.personalInfo.email && <span>✉ {resume.personalInfo.email}</span>}
              {resume.personalInfo.phone && <span>📞 {resume.personalInfo.phone}</span>}
              {resume.personalInfo.location && <span>📍 {resume.personalInfo.location}</span>}
              {resume.personalInfo.linkedin && <span>🔗 {resume.personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {resume.personalInfo.summary && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Summary</h2>
              <p className="text-xs leading-relaxed text-gray-700">{resume.personalInfo.summary}</p>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
                  </div>
                  <p className="text-xs text-gray-600">{[edu.degree, edu.field].filter(Boolean).join(" in ")}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p>
                  {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                  {edu.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1">
                      {edu.highlights.map((h, i) => <li key={i} className="text-xs text-gray-600">{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Experience</h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">{exp.position}</p>
                    <p className="text-xs text-gray-500">{[exp.startDate, exp.current ? "Present" : exp.endDate].filter(Boolean).join(" – ")}</p>
                  </div>
                  <p className="text-xs text-gray-600">{exp.company}{exp.location ? ` | ${exp.location}` : ""}</p>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside mt-1">
                      {exp.description.map((d, i) => <li key={i} className="text-xs text-gray-600">{d}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(resume.skills.technical.length > 0 || resume.skills.software.length > 0 || resume.skills.languages.length > 0 || resume.skills.certifications.length > 0) && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Skills</h2>
              <div className="space-y-1">
                {resume.skills.technical.length > 0 && <p className="text-xs"><span className="font-semibold">Technical:</span> {resume.skills.technical.join(", ")}</p>}
                {resume.skills.software.length > 0 && <p className="text-xs"><span className="font-semibold">Software:</span> {resume.skills.software.join(", ")}</p>}
                {resume.skills.languages.length > 0 && <p className="text-xs"><span className="font-semibold">Languages:</span> {resume.skills.languages.join(", ")}</p>}
                {resume.skills.certifications.length > 0 && <p className="text-xs"><span className="font-semibold">Certifications:</span> {resume.skills.certifications.join(", ")}</p>}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Projects</h2>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="mb-2">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">{proj.name}</p>
                    {proj.date && <p className="text-xs text-gray-500">{proj.date}</p>}
                  </div>
                  <p className="text-xs text-gray-600">{proj.description}</p>
                  {proj.technologies.length > 0 && <p className="text-xs text-gray-500 mt-0.5">Technologies: {proj.technologies.join(", ")}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Activities */}
          {resume.activities.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Activities & Leadership</h2>
              {resume.activities.map((act) => (
                <div key={act.id} className="mb-2">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">{act.organization}</p>
                    {act.date && <p className="text-xs text-gray-500">{act.date}</p>}
                  </div>
                  {act.role && <p className="text-xs text-gray-600">{act.role}</p>}
                  {act.description && <p className="text-xs text-gray-500">{act.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📄 Resume Builder</h1>
          <p className="text-sm text-gray-500">Click any field to edit • Changes save automatically</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("preview")} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">👁 Preview</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">📄 Export PDF</button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">👤 Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
              <div><EditableText value={resume.personalInfo.name} onChange={(v) => updatePersonal("name", v)} placeholder="Your Name" className="text-lg font-semibold" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
              <div><EditableText value={resume.personalInfo.title} onChange={(v) => updatePersonal("title", v)} placeholder="e.g. Industrial Engineer" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <div><EditableText value={resume.personalInfo.email} onChange={(v) => updatePersonal("email", v)} placeholder="your@email.com" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
              <div><EditableText value={resume.personalInfo.phone} onChange={(v) => updatePersonal("phone", v)} placeholder="+66 XX XXX XXXX" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
              <div><EditableText value={resume.personalInfo.location} onChange={(v) => updatePersonal("location", v)} placeholder="City, Country" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">LinkedIn</label>
              <div><EditableText value={resume.personalInfo.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/your-profile" /></div>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-500 uppercase">Professional Summary</label>
            <div><EditableText value={resume.personalInfo.summary} onChange={(v) => updatePersonal("summary", v)} placeholder="A brief summary of your qualifications..." multiline /></div>
          </div>
        </section>

        {/* Education */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">🎓 Education</h2>
            <button onClick={addEducation} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
          </div>
          {resume.education.map((edu) => (
            <div key={edu.id} className="border border-gray-100 rounded-xl p-4 mb-3 relative group">
              <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑</button>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Institution</label><div><EditableText value={edu.institution} onChange={(v) => updateEducation(edu.id, "institution", v)} placeholder="University Name" className="font-medium" /></div></div>
                <div><label className="text-xs text-gray-400">Location</label><div><EditableText value={edu.location} onChange={(v) => updateEducation(edu.id, "location", v)} placeholder="City, Country" /></div></div>
                <div><label className="text-xs text-gray-400">Degree</label><div><EditableText value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="e.g. Bachelor of Engineering" /></div></div>
                <div><label className="text-xs text-gray-400">Field</label><div><EditableText value={edu.field} onChange={(v) => updateEducation(edu.id, "field", v)} placeholder="e.g. Industrial Engineering" /></div></div>
                <div><label className="text-xs text-gray-400">Start Date</label><div><EditableText value={edu.startDate} onChange={(v) => updateEducation(edu.id, "startDate", v)} placeholder="2020" /></div></div>
                <div><label className="text-xs text-gray-400">End Date</label><div><EditableText value={edu.endDate} onChange={(v) => updateEducation(edu.id, "endDate", v)} placeholder="2024" /></div></div>
                <div><label className="text-xs text-gray-400">GPA</label><div><EditableText value={edu.gpa} onChange={(v) => updateEducation(edu.id, "gpa", v)} placeholder="e.g. 3.5" /></div></div>
              </div>
              <div className="mt-3"><label className="text-xs text-gray-400">Highlights / Achievements</label><EditableList items={edu.highlights} onChange={(v) => updateEducation(edu.id, "highlights", v)} placeholder="Add achievement..." /></div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">💼 Experience</h2>
            <button onClick={addExperience} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
          </div>
          {resume.experience.length === 0 && <p className="text-sm text-gray-400">No experience added yet. Click &quot;+ Add&quot; to add your work experience.</p>}
          {resume.experience.map((exp) => (
            <div key={exp.id} className="border border-gray-100 rounded-xl p-4 mb-3 relative group">
              <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑</button>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Company</label><div><EditableText value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} placeholder="Company Name" className="font-medium" /></div></div>
                <div><label className="text-xs text-gray-400">Position</label><div><EditableText value={exp.position} onChange={(v) => updateExperience(exp.id, "position", v)} placeholder="Job Title" /></div></div>
                <div><label className="text-xs text-gray-400">Location</label><div><EditableText value={exp.location} onChange={(v) => updateExperience(exp.id, "location", v)} placeholder="City, Country" /></div></div>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="text-xs text-gray-400">Start</label><div><EditableText value={exp.startDate} onChange={(v) => updateExperience(exp.id, "startDate", v)} placeholder="Month Year" /></div></div>
                  <div className="flex-1"><label className="text-xs text-gray-400">End</label><div><EditableText value={exp.endDate} onChange={(v) => updateExperience(exp.id, "endDate", v)} placeholder="Month Year" /></div></div>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs text-gray-400">Responsibilities / Achievements</label>
                <EditableList items={exp.description} onChange={(v) => updateExperience(exp.id, "description", v)} placeholder="Add bullet point..." />
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🛠 Skills</h2>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Technical Skills</label><EditableList items={resume.skills.technical} onChange={(v) => update({ skills: { ...resume.skills, technical: v } })} placeholder="Add skill..." /></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Software</label><EditableList items={resume.skills.software} onChange={(v) => update({ skills: { ...resume.skills, software: v } })} placeholder="Add software..." /></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Languages</label><EditableList items={resume.skills.languages} onChange={(v) => update({ skills: { ...resume.skills, languages: v } })} placeholder="Add language..." /></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Certifications</label><EditableList items={resume.skills.certifications} onChange={(v) => update({ skills: { ...resume.skills, certifications: v } })} placeholder="Add certification..." /></div>
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">🚀 Projects</h2>
            <button onClick={addProject} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
          </div>
          {resume.projects.length === 0 && <p className="text-sm text-gray-400">No projects added yet. Click &quot;+ Add&quot; to showcase your projects.</p>}
          {resume.projects.map((proj) => (
            <div key={proj.id} className="border border-gray-100 rounded-xl p-4 mb-3 relative group">
              <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑</button>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Project Name</label><div><EditableText value={proj.name} onChange={(v) => updateProject(proj.id, "name", v)} placeholder="Project Name" className="font-medium" /></div></div>
                <div><label className="text-xs text-gray-400">Date</label><div><EditableText value={proj.date} onChange={(v) => updateProject(proj.id, "date", v)} placeholder="e.g. 2024" /></div></div>
              </div>
              <div className="mt-2"><label className="text-xs text-gray-400">Description</label><div><EditableText value={proj.description} onChange={(v) => updateProject(proj.id, "description", v)} placeholder="Describe the project..." multiline /></div></div>
              <div className="mt-2"><label className="text-xs text-gray-400">Technologies</label><EditableList items={proj.technologies} onChange={(v) => updateProject(proj.id, "technologies", v)} placeholder="Add technology..." /></div>
            </div>
          ))}
        </section>

        {/* Activities */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">🏆 Activities & Leadership</h2>
            <button onClick={addActivity} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
          </div>
          {resume.activities.length === 0 && <p className="text-sm text-gray-400">No activities added yet. Click &quot;+ Add&quot; to add extracurriculars.</p>}
          {resume.activities.map((act) => (
            <div key={act.id} className="border border-gray-100 rounded-xl p-4 mb-3 relative group">
              <button onClick={() => removeActivity(act.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑</button>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Organization</label><div><EditableText value={act.organization} onChange={(v) => updateActivity(act.id, "organization", v)} placeholder="Organization Name" className="font-medium" /></div></div>
                <div><label className="text-xs text-gray-400">Role</label><div><EditableText value={act.role} onChange={(v) => updateActivity(act.id, "role", v)} placeholder="Your Role" /></div></div>
                <div><label className="text-xs text-gray-400">Date</label><div><EditableText value={act.date} onChange={(v) => updateActivity(act.id, "date", v)} placeholder="e.g. 2023" /></div></div>
              </div>
              <div className="mt-2"><label className="text-xs text-gray-400">Description</label><div><EditableText value={act.description} onChange={(v) => updateActivity(act.id, "description", v)} placeholder="Describe your involvement..." multiline /></div></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
