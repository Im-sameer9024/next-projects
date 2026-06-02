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
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-8">
  <section className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
    {/* Heading */}
    <section className="space-y-1 text-center">
      <h2 className="text-2xl font-semibold">
        Welcome Back 👋
      </h2>

      <p className="text-muted-foreground text-xs">
        Sign in to continue to LMS Platform
      </p>
    </section>

    {/* Google Login */}
    <CustomButton
      leftIcon={<FcGoogle size={20} />}
      fullWidth
      onClick={handleGoogleLogin}
      className="border border-gray-200 bg-gray-100 text-black hover:bg-gray-200"
    >
      Continue with Google
    </CustomButton>

    {/* Divider */}
    <div className="flex items-center gap-2">
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-xs">
        OR
      </span>
      <Separator className="flex-1" />
    </div>

    {/* Login Form */}
    <LoginForm />

    {/* Footer */}
    <p className="text-muted-foreground text-center text-xs">
      Don't have an account?{" "}
      <Link
        href="/signup"
        className="font-medium text-black hover:underline"
      >
        Sign Up
      </Link>
    </p>
  </section>

  {/* Demo Credentials */}
  <section className="mt-6 w-full max-w-md rounded-2xl  ">
    <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-600">
      Demo Credentials
    </h3>

    <div className="grid gap-4 md:grid-cols-2">
      {/* Teacher */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <h4 className="mb-2 font-semibold text-blue-700">
          Teacher Account
        </h4>

        <div className="space-y-1 text-sm">
          <p className="text-nowrap">
            <span className="font-medium ">
              Email:
            </span>
            xsameer008@gmail.com
          </p>

          <p>
            <span className="font-medium">
              Password:
            </span>{" "}
            123456
          </p>
        </div>
      </div>

      {/* Student */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <h4 className="mb-2 font-semibold text-green-700">
          Student Account
        </h4>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">
              Email:
            </span>{" "}
            rskkhan89@gmail.com
          </p>

          <p>
            <span className="font-medium">
              Password:
            </span>{" "}
            123456
          </p>
        </div>
      </div>
    </div>

    
  </section>
</main>
  );
}

export default LogInPage;
