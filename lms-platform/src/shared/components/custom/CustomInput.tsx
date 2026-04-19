"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/shared/lib/utils";

type CustomInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  placeholder?: string;
  type?: string;

  disabled?: boolean;
  loading?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  description?: string;
  className?: string;
};

const CustomInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  description,
  className,
}: CustomInputProps<T>) => {
  return (
    <div className="space-y-1 w-full">
      {/* 🔹 Label */}
      {label && (
        <label className="text-sm font-semibold text-darkText">
          {label}
        </label>
      )}

      {/* 🔹 Input */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className="relative flex items-center">
              {/* Left Icon */}
              {leftIcon && (
                <span className="absolute left-3 text-muted-foreground">
                  {leftIcon}
                </span>
              )}

              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled || loading}
                className={cn(
                  "w-full  text-darkText",
                  leftIcon && "pl-10",
                  rightIcon && "pr-10",
                  fieldState.error && "border-red-500",
                  className,
                )}
              />

              {/* Right Icon */}
              {rightIcon && (
                <span className="absolute right-3 text-muted-foreground">
                  {rightIcon}
                </span>
              )}
            </div>

            {/* 🔴 Error */}
            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}

            {/* 🔹 Description */}
            {description && (
              <p className="text-xs ">{description}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomInput;
