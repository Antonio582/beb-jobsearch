export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Skills {
  technical: string[];
  software: string[];
  languages: string[];
  certifications: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  date: string;
  link: string;
}

export interface Activity {
  id: string;
  organization: string;
  role: string;
  date: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  activities: Activity[];
}

export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "accepted" | "rejected";

export interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  coverLetter: string;
  resumeVersion: string;
  interviewNotes: string;
  url: string;
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  savedDate: string;
  category: string;
}
