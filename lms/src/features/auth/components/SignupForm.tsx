/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInput from "@/shared/components/custom/CustomInput";
import CustomButton from "@/shared/components/custom/CustomButton";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import {
  SignUpSchemaValidation,
  SignUpSchemaValidationTypes,
} from "@/shared/validation/auth.validation";
import { useAppContext } from "@/app/providers/context/useAppContext";
import { SignupUser } from "../apiOperations";
import { toast } from "sonner";
import {
  GetApiErrorMessage,
  GetApiResponseMessage,
} from "@/shared/lib/apiMessages";

const SignupForm = () => {
  const { handleSubmit, control, setValue } =
    useForm<SignUpSchemaValidationTypes>({
      resolver: zodResolver(SignUpSchemaValidation),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        role: "user",
      },
    });

  const role = useWatch({ control, name: "role" });
  const { globalLoading, setGlobalLoading, router } = useAppContext();

  const onSubmit = async (data: SignUpSchemaValidationTypes) => {
    console.log("FORM DATA:", data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    setGlobalLoading(true);
    try {
      const res = await SignupUser(formData as any);
      console.log("---------------------- response of signup ----------------------",res);
    
      if(res.success){
        toast.success(GetApiResponseMessage(res));
        router.push("/");
      }
    
    } catch (error) {
      toast.error(GetApiErrorMessage(error));
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* name */}
      <CustomInput
        name="name"
        control={control}
        label="name"
        placeholder="Enter your name"
        loading={globalLoading}
        disabled={globalLoading}
      />

      {/* Email */}
      <CustomInput
        name="email"
        control={control}
        label="Email"
        placeholder="Enter your email"
        loading={globalLoading}
        disabled={globalLoading}
      />

      {/* Password */}
      <CustomInput
        name="password"
        control={control}
        label="Password"
        type="password"
        placeholder="Enter your password"
        loading={globalLoading}
        disabled={globalLoading}
      />

      {/* 🔥 Role Radio Group */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Role</Label>

        <RadioGroup
          disabled={globalLoading}
          value={role}
          onValueChange={(val) =>
            setValue("role", val as "user" | "teacher", {
              shouldValidate: true,
            })
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user">User</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="teacher" id="teacher" />
            <Label htmlFor="teacher">Teacher</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Submit Button */}
      <CustomButton type="submit" fullWidth loading={globalLoading}>
        Sign Up
      </CustomButton>
    </form>
  );
};

export default SignupForm;
