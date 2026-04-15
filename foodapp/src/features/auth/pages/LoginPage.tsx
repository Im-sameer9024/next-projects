"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import CustomButton from "@/shared/components/custom/CustomButton";
import { signIn } from "next-auth/react";
import LoginForm from "../components/LoginForm";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

const LoginPage = () => {
  const { loading, setLoading } = useAuthStore();

  const GoogleLogin = async () => {
    setLoading(true);
    try {
      signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.log("Error occur in Google auth", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-100">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Welcome Back 👋</h1>
        <p className="text-sm text-gray-500">
          Sign in to continue to{" "}
          <span className="font-medium">Mystry Message</span>
        </p>
      </header>

      {/* Google Login */}
      <CustomButton
        onClick={GoogleLogin}
        leftIcon={<FcGoogle size={20} />}
        fullWidth
        loading={loading}
        variant="outline"
        className=" bg-transparent hover:bg-slate-100 transition-all duration-200"
      >
        Continue with Google
      </CustomButton>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Form */}
      <LoginForm loading={loading} setLoading={setLoading} />

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500">
        <p>
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </footer>
    </section>
  );
};

export default LoginPage;
