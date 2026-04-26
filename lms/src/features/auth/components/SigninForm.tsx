"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInput from "@/shared/components/custom/CustomInput";
import CustomButton from "@/shared/components/custom/CustomButton";
import {
  SignInSchemaValidation,
  SignInSchemaValidationTypes,
} from "@/shared/validation/auth.validation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useAppContext } from "@/app/providers/context/useAppContext";
import { Roles } from "@/shared/data/data";

const SigninForm = () => {
  const { router } = useAppContext();

  const { globalLoading, setGlobalLoading } = useAppContext();

  const { handleSubmit, control } = useForm<SignInSchemaValidationTypes>({
    resolver: zodResolver(SignInSchemaValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchemaValidationTypes) => {
    setGlobalLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // ❌ Handle error properly
      if (res.error) {
        toast.error(`Please check fields`);
        return;
      }

      // ✅ wait for updated session
      const updatedSession = await getSession();

      if (updatedSession?.user.role === Roles.teacher) {
        router.push("/teacher/courses");
      } else {
        router.push("/");
      }
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("error in signin", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* Email */}
      <CustomInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      {/* Password */}
      <CustomInput
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      {/* Submit */}
      <CustomButton type="submit" fullWidth loading={globalLoading}>
        Login
      </CustomButton>
    </form>
  );
};

export default SigninForm;
