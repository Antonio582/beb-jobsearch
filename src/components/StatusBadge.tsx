"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { ApplicationStatus } from "@/types";
import { TranslationKey } from "@/lib/translations";

const statusConfig: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  saved: { bg: "bg-[#55555E]/20", text: "text-[#8B8B96]", dot: "bg-[#8B8B96]" },
  applied: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", dot: "bg-[#3B82F6]" },
  interview: { bg: "bg-[#7C5CFC]/10", text: "text-[#7C5CFC]", dot: "bg-[#7C5CFC]" },
  offer: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]" },
  accepted: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", dot: "bg-[#22C55E]" },
  rejected: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", dot: "bg-[#EF4444]" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useLanguage();
  const config = statusConfig[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <motion.span
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
      />
      {t(status as TranslationKey)}
    </motion.span>
  );
}
