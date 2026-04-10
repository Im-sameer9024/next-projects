/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/shared/components/custom/InputField";
import CustomButton from "@/shared/components/custom/CustomButton";
import { toast } from "sonner";
import { SignupFormData, signupSchema } from "../validation/auth.shcema";
import { SignUpUser } from "../apiOperations";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "USER",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await SignUpUser(data);
      console.log("signup resposne", res);

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      }
    } catch (error: any) {
      toast.error("Something went wrong", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md mx-auto"
    >
      {/* 🔘 Role Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
            role === "USER" ? "bg-white shadow text-black" : "text-gray-500"
          }`}
        >
          User
        </button>
        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
            role === "ADMIN" ? "bg-white shadow text-black" : "text-gray-500"
          }`}
        >
          Admin
        </button>
      </div>

      {/* Name */}
      <InputField
        name="name"
        control={control}
        error={errors.name}
        label="Full Name"
        placeholder="Enter your name"
        type="text"
      />

      {/* Email */}
      <InputField
        name="email"
        control={control}
        error={errors.email}
        label="Email"
        placeholder="Enter your email"
        type="email"
      />

      {/* Password */}
      <InputField
        name="password"
        control={control}
        error={errors.password}
        label="Password"
        placeholder="Enter your password"
        type="password"
      />

      {/* Submit */}
      <CustomButton fullWidth type="submit" active={true} loading={false}>
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </CustomButton>
    </form>
  );
};

export default SignupForm;
