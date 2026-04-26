"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { RoutesProps } from "@/shared/data/data";

const SidebarLink = ({
  data,
  pathname,
  isCollapsed,
}: {
  data: RoutesProps;
  pathname: string;
  isCollapsed: boolean;
}) => {
  const isActive =
    pathname === data?.link || pathname.startsWith(`${data?.link}/`);

  return (
    <Link href={data?.link} >
      <motion.div
        layout // 🔥 smooth layout shift
        whileHover={{ scale: 1.02 }}
        className={`flex items-center font-content  gap-3 p-2 rounded-md text-sm transition-colors
        ${
          isActive
            ? "bg-blue-100 text-blue-500 font-semibold"
            : "text-slate-500 hover:text-blue-500 hover:bg-blue-100"
        }`}
      >
        {/* ICON */}
        <motion.span
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          
        >
          {data?.icon}
        </motion.span>

        {/* TEXT */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              key="text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              {data?.text}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default SidebarLink;
