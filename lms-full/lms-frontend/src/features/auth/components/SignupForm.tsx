"use client";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { SignUpSchemaValidationTypes, SignUpValidationSchema } from "../auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/shared/components/custom/CustomInput";
import CustomButton from "@/shared/components/custom/CustomButton";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { SignupUser } from "../apiOperations";
import { toast } from "sonner";
import { GetApiErrorMessage, GetApiResponseMessage } from "@/shared/utils/apiMessages";

const SignupForm = () => {
  const [signupLoading, setSignupLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, setValue } = useForm<SignUpSchemaValidationTypes>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const role = useWatch({ control, name: "role" });

  const onSubmit = async (data: SignUpSchemaValidationTypes) => {
    setSignupLoading(true);
    try {
      const res = await SignupUser(data);

      if (res.success) {
        router.push("/login");
      }
      toast.success(GetApiResponseMessage(res));
    } catch (error) {
      toast.error(GetApiErrorMessage(error));
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* name */}
      <CustomInput
        name="name"
        control={control}
        label="Name"
        placeholder="Enter your name"
        disabled={signupLoading}
      />

      {/* email  */}
      <CustomInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="Enter your email"
        disabled={signupLoading}
      />

      {/* Password */}
      <CustomInput
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="Enter your password"
        disabled={signupLoading}
      />

      {/* 🔥 Role Radio Group */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Role</Label>

        <RadioGroup
          disabled={signupLoading}
          value={role}
          onValueChange={(val) =>
            setValue("role", val as "USER" | "TEACHER", {
              shouldValidate: true,
            })
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="USER" id="USER" />
            <Label htmlFor="USER">User</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="TEACHER" id="TEACHER" />
            <Label htmlFor="TEACHER">Teacher</Label>
          </div>
        </RadioGroup>
      </div>

      <CustomButton type="submit" fullWidth loading={signupLoading} className="mt-4">
        Sign Up
      </CustomButton>
    </form>
  );
};

export default SignupForm;
