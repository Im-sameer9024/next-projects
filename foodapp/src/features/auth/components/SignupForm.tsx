"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/shared/components/custom/InputField";
import CustomButton from "@/shared/components/custom/CustomButton";
import { toast } from "sonner";
import { SignupFormData, signupSchema } from "../validation/auth.shcema";
import { SignUpUser } from "../apiOperations";
import { useRouter } from "next/navigation";

const SignupForm = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
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
    setLoading(true)
    try {
      const res = await SignUpUser(data);

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 w-full max-w-md mx-auto"
    >
      {/* Role Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setRole("USER");
            setValue("role", "USER");
          }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            role === "USER"
              ? "bg-white shadow text-black"
              : "text-gray-500 hover:bg-white/70"
          }`}
        >
          User
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setRole("ADMIN");
            setValue("role", "ADMIN");
          }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            role === "ADMIN"
              ? "bg-white shadow text-black"
              : "text-gray-500 hover:bg-white/70"
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
        loading={loading}
        label="Full Name"
        placeholder="Enter your name"
        type="text"
      />

      {/* Email */}
      <InputField
        name="email"
        control={control}
        error={errors.email}
        loading={loading}
        label="Email"
        placeholder="Enter your email"
        type="email"
      />

      {/* Password */}
      <InputField
        name="password"
        control={control}
        loading={loading}
        error={errors.password}
        label="Password"
        placeholder="Enter your password"
        type="password"
      />

      {/* Submit */}
      <CustomButton
        disabled={loading}
        active
        fullWidth
        type="submit"
        loading={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </CustomButton>
    </form>
  );
};

export default SignupForm;
