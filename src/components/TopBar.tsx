"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export function TopBar() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 border-b border-[#1F1F22] bg-[#0A0A0B]/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-6xl mx-auto">
        <div className="ml-10 md:ml-0">
          <h2 className="text-lg font-semibold text-[#E8E8ED] tracking-tight">
            {t("greeting")}
          </h2>
          <p className="text-sm text-[#8B8B96]">{t("motivational")}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLang}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141415] border border-[#1F1F22] text-sm font-medium text-[#E8E8ED] hover:border-[#7C5CFC]/50 transition-colors"
        >
          <span className="text-base">{lang === "th" ? "🇹🇭" : "🇬🇧"}</span>
          <span>{lang === "th" ? "ไทย" : "EN"}</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
