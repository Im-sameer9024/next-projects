"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/shared/store/auth.store";

import AuthLoader from "@/shared/components/loaders/AuthLoader";

import { getRoleRedirectRoute } from "@/shared/utils/authRedirect";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { token, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && token && user) {
      router.replace(getRoleRedirectRoute(user.role));
    }
  }, [token, user, isLoading, router]);

  if (isLoading) {
    return <AuthLoader />;
  }

  if (token) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
