"use client";

import React, { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/shared/store/auth.store";

import AuthLoader from "@/shared/components/loaders/AuthLoader";

import Navbar from "@/shared/components/common/Navbar";

import Sidebar from "@/shared/components/common/Sidebar";

import { getRoleRedirectRoute } from "@/shared/utils/authRedirect";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const pathname = usePathname();

  const { token, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // NOT AUTHENTICATED

    if (!token || !user) {
      router.replace("/login");

      return;
    }

    // USER TRYING TEACHER ROUTE

    if (pathname.startsWith("/teacher") && user.role !== "TEACHER") {
      router.replace(getRoleRedirectRoute(user.role));

      return;
    }

    // TEACHER TRYING USER ROUTE

    if (pathname.startsWith("/user") && user.role !== "USER") {
      router.replace(getRoleRedirectRoute(user.role));

      return;
    }

    // ROOT REDIRECT

    if (pathname === "/") {
      router.replace(getRoleRedirectRoute(user.role));
    }
  }, [token, user, isLoading, pathname, router]);

  if (isLoading) {
    return <AuthLoader />;
  }

  if (!token || !user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <section className="flex-1 overflow-y-auto bg-slate-50 w-full h-full">
          <Navbar />

          <main className="p-4">{children}</main>
        </section>
      </div>
    </div>
  );
};

export default MainLayout;
