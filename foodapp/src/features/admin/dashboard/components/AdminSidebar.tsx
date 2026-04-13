"use client";

import { AdminSidebarLinks } from "@/shared/data/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Logo from "../../../../../public//logo.png";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false} // 🔥 important (like reference)
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r border-slate-200 h-screen p-3 relative flex flex-col items-center"
    >
      {/* 🔥 Toggle Button (like reference) */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-3 bg-white text-slate-600 border rounded-full p-1 shadow hover:cursor-pointer hover:bg-slate-100 transition"
      >
        <FaArrowRightArrowLeft size={14} />
      </button>

      {/* 🔝 Header */}
      <div className="flex items-center gap-2 mt-2 mb-6">
        <Image src={Logo} width={32} height={32} alt="logo" />

        {!collapsed && (
          <span className="font-bold text-lg whitespace-nowrap">FoodApp</span>
        )}
      </div>

      {/* 🔗 Links */}
      <div className="flex flex-col gap-3 w-full items-center">
        {AdminSidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className={`flex items-center gap-3 transition-all duration-200 group
                  ${
                    collapsed
                      ? "justify-center w-12 h-12 rounded-full"
                      : "w-full px-3 py-2 rounded-lg"
                  }
                  ${
                    isActive
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-red-500 hover:text-white"
                  }
                `}
                >
                  {/* Icon */}
                  <motion.span
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <Icon size={20} />
                  </motion.span>

                  {/* Text */}
                  {!collapsed && (
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </TooltipTrigger>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <TooltipContent side="right">{item.name}</TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
