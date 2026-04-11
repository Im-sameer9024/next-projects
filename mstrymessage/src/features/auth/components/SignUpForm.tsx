"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */


import React from 'react'
import { SignUpSchemaProps, signupValidationSchema } from '../validation/auth.validation';
import CustomInput from '@/shared/components/custom/CustomInput';
import CustomButton from '@/shared/components/custom/CustomButton';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const SignUpForm = () => {

    const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaProps>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpSchemaProps) => {
    try {
    //   const res = await signIn("credentials", {
    //     redirect: false,
    //     email: data.email,
    //     password: data.password,
    //   });

      console.log(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
   <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4  "
    >

         {/* Username */}
      <CustomInput
        name="username"
        control={control}
        error={errors.username}
        label="Username"
        placeholder="Enter your username"
        type="text"
      />
      {/* Email */}
      <CustomInput
        name="email"
        control={control}
        error={errors.email}
        label="Email"
        placeholder="Enter your email"
        type="email"
      />

      {/* Password */}
      <CustomInput
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
        {isSubmitting ? "Creating..." : "Create Account"}
      </CustomButton>
    </form>
  )
}

export default SignUpForm