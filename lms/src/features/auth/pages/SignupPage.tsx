"use client";

import React, { useState } from "react";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Separator } from "@/shared/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import SignupForm from "../components/SignupForm";
import Link from "next/link";
import { signIn } from "next-auth/react";
const SignupPage = () => {

  const[googleLoading,setGoogleLoading] = useState<boolean>(false)

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.log("Error occur in google signUp", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {/* 🔹 Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Create Your Account ✨</h2>
          <p className="text-xs text-muted-foreground">
            Signup to continue with LMS Platform
          </p>
        </div>

        {/* 🔹 Google Button */}
        <CustomButton
          onClick={handleGoogleSignup}
          loading={googleLoading}
          disabled={googleLoading}
          leftIcon={<FcGoogle size={20} />}
          fullWidth
          className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-black border border-gray-200"
        >
          Continue with Google
        </CustomButton>

        {/* 🔹 Divider */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        {/* 🔹 Form */}
        <SignupForm />

        {/* 🔹 Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={"/sign-in"}
            className="text-black font-medium hover:underline"
          >
            Sign-In
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignupPage;
