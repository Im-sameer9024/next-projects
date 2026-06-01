"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function LogInPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
        {/*--------------- Heading section ----------- */}
        <section className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
          <p className="text-muted-foreground text-xs">Sign in to continue to LMS Platform</p>
        </section>

        <CustomButton
          leftIcon={<FcGoogle size={20} />}
          fullWidth
          onClick={handleGoogleLogin}
          className="border border-gray-200 bg-gray-100 text-black hover:cursor-pointer hover:bg-gray-200"
        >
          Continue with Google
        </CustomButton>

        {/* ----------------- Divider---------------------- */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        {/*----------------- Login form --------------- */}

        <LoginForm />

        {/* 🔹 Footer */}
        <p className="text-muted-foreground text-center text-xs">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-black hover:underline">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LogInPage;
