"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, TranslationKey, t as translate } from "./translations";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("th");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("beb-lang") as Language | null;
    if (stored === "en" || stored === "th") {
      setLang(stored);
    }
    setMounted(true);
  }, []);

  const toggleLang = () => {
    const next = lang === "th" ? "en" : "th";
    setLang(next);
    localStorage.setItem("beb-lang", next);
  };

  const t = (key: TranslationKey) => translate(key, lang);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0A0B]" />;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
