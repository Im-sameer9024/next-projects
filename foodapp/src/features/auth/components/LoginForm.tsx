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

const LoginForm = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const router = useRouter();

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
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });

      console.log(res)

      if (res?.ok) {
        toast.success("Login successful");
        router.push("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full">
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
        error={errors.password}
        loading={loading}
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
        {isSubmitting ? "Logging in..." : "Login"}
      </CustomButton>
    </form>
  );
};

export default LoginForm;
