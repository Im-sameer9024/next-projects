"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/shared/store/auth.store";
import AuthLoader from "@/shared/components/loaders/AuthLoader";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { token, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && token && user) {
      switch (user.role) {
        case "USER":
          router.replace("/user");
          break;

        case "TEACHER":
          router.replace("/teacher");
          break;

        default:
          break;
      }
    }
  }, [token, user, isLoading, router]);

  if (isLoading) {
    return <AuthLoader/>;
  }

  if (token) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
