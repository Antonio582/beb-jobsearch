"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { getApplications } from "@/lib/storage";
import { Application, ApplicationStatus } from "@/types";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";

const pipelineStatuses: ApplicationStatus[] = ["saved", "applied", "interview", "offer", "accepted"];

export default function Dashboard() {
  const { t } = useLanguage();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApps(getApplications());
    setLoading(false);
  }, []);

  const stats = [
    {
      label: t("totalApplications"),
      value: apps.length,
      icon: "📋",
      color: "#7C5CFC",
    },
    {
      label: t("activeApplications"),
      value: apps.filter((a) => ["applied", "interview"].includes(a.status)).length,
      icon: "⚡",
      color: "#3B82F6",
    },
    {
      label: t("interviewsScheduled"),
      value: apps.filter((a) => a.status === "interview").length,
      icon: "🎯",
      color: "#F59E0B",
    },
    {
      label: t("offersReceived"),
      value: apps.filter((a) => ["offer", "accepted"].includes(a.status)).length,
      icon: "🏆",
      color: "#22C55E",
    },
  ];

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StaggerItem key={i}>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#8B8B96] mb-1">{stat.label}</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    className="text-3xl font-bold text-[#E8E8ED]"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="mt-3 h-1 rounded-full bg-[#1F1F22] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: apps.length > 0 ? `${Math.min((stat.value / Math.max(apps.length, 1)) * 100, 100)}%` : "0%" }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-2">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-[#8B8B96] uppercase tracking-wider mb-4"
          >
            {t("applicationPipeline")}
          </motion.h3>
          <Card hover={false}>
            <div className="flex flex-wrap gap-3">
              {pipelineStatuses.map((status) => {
                const count = apps.filter((a) => a.status === status).length;
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 min-w-[100px] p-3 rounded-lg bg-[#0A0A0B] border border-[#1F1F22] text-center"
                  >
                    <p className="text-2xl font-bold text-[#E8E8ED] mb-1">{count}</p>
                    <StatusBadge status={status} />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-[#8B8B96] uppercase tracking-wider mb-4"
          >
            {t("quickActions")}
          </motion.h3>
          <StaggerContainer className="space-y-2">
            {[
              { href: "/applications", label: t("addApplication"), icon: "➕" },
              { href: "/resume", label: t("editResume"), icon: "✏️" },
              { href: "/search", label: t("searchJobs"), icon: "🔍" },
            ].map((action) => (
              <StaggerItem key={action.href}>
                <Link href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#141415] border border-[#1F1F22] hover:border-[#7C5CFC]/30 transition-colors"
                  >
                    <span>{action.icon}</span>
                    <span className="text-sm text-[#E8E8ED]">{action.label}</span>
                    <svg className="ml-auto w-4 h-4 text-[#55555E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-[#8B8B96] uppercase tracking-wider"
          >
            {t("recentApplications")}
          </motion.h3>
          {apps.length > 0 && (
            <Link href="/applications" className="text-sm text-[#7C5CFC] hover:text-[#8D70FD] transition-colors">
              {t("viewAll")} →
            </Link>
          )}
        </div>

        {apps.length === 0 ? (
          <Card hover={false}>
            <div className="text-center py-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl mb-3"
              >
                📭
              </motion.p>
              <p className="text-[#8B8B96]">{t("noApplicationsYet")}</p>
              <p className="text-sm text-[#55555E] mt-1">{t("startByAdding")}</p>
            </div>
          </Card>
        ) : (
          <StaggerContainer className="space-y-2">
            {recentApps.map((app) => (
              <StaggerItem key={app.id}>
                <Card className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#E8E8ED] truncate">{app.position}</p>
                    <p className="text-xs text-[#8B8B96]">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-[#55555E] hidden sm:block">{app.dateApplied}</span>
                    <StatusBadge status={app.status} />
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
