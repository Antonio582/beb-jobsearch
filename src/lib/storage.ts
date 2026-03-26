import { ResumeData, Application, SavedJob } from "@/types";

const RESUME_KEY = "beb-resume";
const APPS_KEY = "beb-applications";
const JOBS_KEY = "beb-saved-jobs";

const defaultResume: ResumeData = {
  personalInfo: {
    name: "Beb",
    title: "Industrial Engineer",
    email: "",
    phone: "",
    location: "Thailand",
    linkedin: "",
    summary: "Motivated Industrial Engineering graduate from Chiang Mai University with strong analytical and problem-solving skills. Passionate about process improvement, lean manufacturing, and supply chain optimization.",
  },
  education: [
    {
      id: "1",
      institution: "Chiang Mai University (CMU)",
      degree: "Bachelor of Engineering",
      field: "Industrial Engineering",
      location: "Chiang Mai, Thailand",
      startDate: "2020",
      endDate: "2024",
      gpa: "",
      highlights: [],
    },
  ],
  experience: [],
  skills: {
    technical: ["Lean Manufacturing", "Six Sigma", "Quality Control", "Process Optimization", "Time Study", "Work Measurement"],
    software: ["Microsoft Excel", "AutoCAD", "Minitab", "SAP"],
    languages: ["Thai (Native)", "English (Professional)"],
    certifications: [],
  },
  projects: [],
  activities: [],
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getResume(): ResumeData {
  if (!isBrowser()) return defaultResume;
  const stored = localStorage.getItem(RESUME_KEY);
  if (!stored) {
    localStorage.setItem(RESUME_KEY, JSON.stringify(defaultResume));
    return defaultResume;
  }
  return JSON.parse(stored);
}

export function saveResume(data: ResumeData): void {
  if (!isBrowser()) return;
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
}

export function getApplications(): Application[] {
  if (!isBrowser()) return [];
  const stored = localStorage.getItem(APPS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveApplications(apps: Application[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function getSavedJobs(): SavedJob[] {
  if (!isBrowser()) return [];
  const stored = localStorage.getItem(JOBS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveSavedJobs(jobs: SavedJob[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}
