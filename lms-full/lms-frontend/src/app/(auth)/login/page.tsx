"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Separator } from "@/shared/components/ui/separator";
import { getApiUrl } from "@/services/apiUrl";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function LogInPage() {
  const handleGoogleLogin = () => {
    window.location.href = getApiUrl("/auth/google");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {/*--------------- Heading section ----------- */}
        <section className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
          <p className="text-xs text-muted-foreground">
            Sign in to continue to LMS Platform
          </p>
        </section>

        <CustomButton
          leftIcon={<FcGoogle size={20} />}
          fullWidth
          onClick={handleGoogleLogin}
          className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-black border border-gray-200"
        >
          Continue with Google
        </CustomButton>

        {/* ----------------- Divider---------------------- */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        {/*----------------- Login form --------------- */}

        <LoginForm />

        {/* 🔹 Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LogInPage;
