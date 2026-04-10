/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/shared/components/custom/InputField";
import { LoginFormData, loginSchema } from "../validation/auth.shcema";
import CustomButton from "@/shared/components/custom/CustomButton";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {

    const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        redirect:false,
        email: data.email,
        password: data.password,
      });

      if(res?.ok){
        toast.success("Login successful");
         router.push("/")
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 min-w-md max-w-lg mx-auto"
    >
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

      {/* Error Example */}
      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}

      {/* Submit Button */}
      <CustomButton
        fullWidth={true}
        type="submit"
        active={true}
        loading={false}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </CustomButton>
    </form>
  );
};

export default LoginForm;
