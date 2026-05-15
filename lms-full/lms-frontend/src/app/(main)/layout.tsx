"use client";

import React, { useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/shared/store/auth.store";
import AuthLoader from "@/shared/components/loaders/AuthLoader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const pathname = usePathname();

  const { token, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Not logged in
    if (!token || !user) {
      router.replace("/login");

      return;
    }

    // Role-based protection

    if (pathname.startsWith("/teacher") && user.role !== "TEACHER") {
      router.replace("/user");
    }

    if (pathname.startsWith("/user") && user.role !== "USER") {
      router.replace("/teacher");
    }

   
  }, [token, user, isLoading, pathname, router]);

  if (isLoading) {
    return <AuthLoader/>;
  }

  if (!token || !user) {
    return null;
  }

  return <>{children}</>;
};

export default MainLayout;
