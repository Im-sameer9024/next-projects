"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import CustomButton from "@/shared/components/custom/CustomButton";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/app/store/authStore";
import SignupForm from "../components/SignupForm";
import Link from "next/link";

const SignupPage = () => {
  const { loading, setLoading } = useAuthStore();

  const GoogleLogin = async () => {
    setLoading(true);
    try {
      signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log("Error occur in Google auth", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-4 border border-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="text-center ">
        <h1 className="text-2xl font-semibold">Create your account 🚀</h1>
      </header>

      {/* Google Login */}
      <section className="w-full">
        <CustomButton
          onClick={GoogleLogin}
          leftIcon={<FcGoogle size={20} />}
          fullWidth={true}
          loading={loading}
          variant="outline"
          className=" bg-transparent hover:bg-slate-100 transition-all duration-200"
        >
          Continue with Google
        </CustomButton>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Form */}
      <SignupForm loading={loading} setLoading={setLoading} />

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </footer>
    </section>
  );
};

export default SignupPage;
