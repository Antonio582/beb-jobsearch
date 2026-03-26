"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = true, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, boxShadow: "0 0 30px rgba(124, 92, 252, 0.05)" } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`glass rounded-xl p-5 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
