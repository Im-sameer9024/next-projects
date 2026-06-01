"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useAuthStore } from "@/shared/store/auth.store";
import { RolesObject, teacherRoutes, userRoutes } from "@/shared/utils/data";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname();

  const { user, isLoading } = useAuthStore();

  const role = user?.role;

  const routes = role === RolesObject.teacher ? teacherRoutes : userRoutes;

  return (
    <>
      <motion.div
        layout
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative hidden h-screen flex-col items-center border-r border-gray-200 bg-white md:flex"
      >
        {/*----------------------- Toggle Button------------------ */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute top-3 -right-3 rounded-full border bg-white p-0.5 text-slate-500 shadow transition hover:cursor-pointer hover:bg-slate-100"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/*-------------------- logo ----------------- */}

        <Link
          href={role === RolesObject.teacher ? "/teacher/courses" : "/user/dashboard"}
          className="flex w-full items-center justify-center gap-2 py-5"
        >
          <Logo />

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-semibold whitespace-nowrap text-slate-700"
            >
              LMS Platform
            </motion.span>
          )}
        </Link>

        {/* links  */}
        <div className="flex w-full flex-col gap-3 p-4">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : (
            routes.map((link) => {
              return (
                <SidebarLink
                  key={link?.id}
                  data={link}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
