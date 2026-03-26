"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

const navItems = [
  { href: "/", icon: "📊", labelKey: "dashboard" as const },
  { href: "/resume", icon: "📄", labelKey: "resume" as const },
  { href: "/applications", icon: "📋", labelKey: "applications" as const },
  { href: "/search", icon: "🔍", labelKey: "jobSearch" as const },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#141415] border border-[#1F1F22]"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="#E8E8ED" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-0 left-0 h-screen w-[240px] bg-[#111112] border-r border-[#1F1F22] z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 pb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#7C5CFC] flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="text-[#E8E8ED] font-semibold tracking-tight text-lg">
              Beb&apos;s Jobs
            </span>
          </motion.div>
        </div>

        {/* Nav */}
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 px-3 py-4 space-y-1"
        >
          {navItems.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <motion.div key={nav.href} variants={item}>
                <Link
                  href={nav.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                      : "text-[#8B8B96] hover:text-[#E8E8ED] hover:bg-[#1F1F22]/50"
                  }`}
                >
                  <span className="text-base">{nav.icon}</span>
                  <span>{t(nav.labelKey)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F1F22]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <div>
              <p className="text-sm text-[#E8E8ED] font-medium">Beb</p>
              <p className="text-xs text-[#55555E]">IE Graduate</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
