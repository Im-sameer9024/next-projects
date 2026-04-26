"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeftRight } from "lucide-react";
import { guestRoutes, Roles, teacherRoutes } from "@/shared/data/data";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname();

  const { data: session } = useSession();

  const role = session?.user?.role;

  const routes = role === Roles.teacher ? teacherRoutes : guestRoutes;

  return (
    <>
      <motion.div
        layout
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white  border-r border-gray-200 h-screen relative  flex-col items-center hidden md:flex"
      >
        {/*----------------------- Toggle Button------------------ */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-3 bg-white hover:cursor-pointer text-slate-500 border rounded-full p-0.5 shadow hover:bg-slate-100 transition"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/*-------------------- logo ----------------- */}

        <Link
          href="/"
          className="flex items-center gap-2   w-full justify-center py-5"
        >
          <Logo />

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-slate-500 whitespace-nowrap"
            >
              LMS Platform
            </motion.span>
          )}
        </Link>

        {/* links  */}
        <div className="flex flex-col gap-3 w-full p-4">
          {routes.map((link) => {
            return (
              <SidebarLink
                key={link?.id}
                data={link}
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
