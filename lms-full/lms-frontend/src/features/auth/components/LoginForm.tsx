"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  LoginSchemaValidationTypes,
  LoginValidationSchema,
} from "../auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/shared/components/custom/CustomInput";
import CustomButton from "@/shared/components/custom/CustomButton";
import { useAuthStore } from "@/shared/store/auth.store";
import { LoginUser } from "../apiOperations";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const { setLoading, setAuth } = useAuthStore();

  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control } = useForm<LoginSchemaValidationTypes>({
    resolver: zodResolver(LoginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaValidationTypes) => {
    setLoginLoading(true);
    try {
      const res = await LoginUser(data);

      if (res?.success) {
        const { accessToken, user } = res?.data;
        setAuth(accessToken, user);

        if (user.role === "TEACHER") {
          router.push("/teacher");
        } else {
          router.push("/user");
        }
      }

      console.log("res in login component", res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoginLoading(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* email  */}
      <CustomInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="Enter your email"
        disabled={loginLoading}
      />

      {/* Password */}
      <CustomInput
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="Enter your password"
        disabled={loginLoading}
      />
      <CustomButton
        type="submit"
        fullWidth
        loading={loginLoading}
        className=" mt-4"
      >
        Login
      </CustomButton>
    </form>
  );
};

export default LoginForm;
