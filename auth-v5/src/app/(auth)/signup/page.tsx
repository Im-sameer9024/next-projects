"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github, GoogleIcon } from "@hugeicons/core-free-icons";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  // 🔥 Signup handler
  const onSubmit = async (data: SignupFormData) => {
    console.log("Signup Data:", data);

    try {
      // 👉 call your signup API here
      // await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(data) })

      // Optional: auto login after signup
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  // 🔥 GitHub Login
  const handleGithubLogin = async () => {
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <section className="w-full max-w-md mx-auto mt-20 p-8 rounded-2xl shadow-lg border space-y-6 bg-white">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-sm text-gray-500">
          Sign up to get started 🚀
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Enter your name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGoogleLogin}
        >
          <HugeiconsIcon icon={GoogleIcon} size={18} />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGithubLogin}
        >
          <HugeiconsIcon icon={Github} size={18} />
          Continue with GitHub
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Login
        </Link>
      </p>
    </section>
  );
};

export default SignupPage;