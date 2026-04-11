/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import CustomButton from "@/shared/components/custom/CustomButton";
import CustomInput from "@/shared/components/custom/CustomInput";
import { useForm } from "react-hook-form";
import {
  SignInSchemaProps,
  signinValidationSchema,
} from "../validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/app/store/authStore";

const SignInForm = () => {
  const { loading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaProps>({
    resolver: zodResolver(signinValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchemaProps) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log(res);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4  ">
      {/* Email */}
      <CustomInput
        name="email"
        control={control}
        error={errors.email}
        loading={loading}

        label="Email"
        placeholder="Enter your email"
        type="email"
      />

      {/* Password */}
      <CustomInput
        name="password"
        control={control}
        error={errors.password}
        loading={loading}
        label="Password"
        placeholder="Enter your password"
        type="password"
      />

      {/* Error Example */}
      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}

      {/* Submit Button */}
      <CustomButton
        fullWidth={true}
        type="submit"
        active={true}
        loading={loading}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </CustomButton>
    </form>
  );
};

export default SignInForm;
