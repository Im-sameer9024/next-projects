"use client";

import React, { useId, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
  className,
}: CustomInputProps<T>) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-1 w-full">
      {/* 🔹 Label */}
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-darkText">
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
                id={id}
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                disabled={disabled || loading}
                className={cn(
                  "w-full text-darkText",
                  leftIcon && "pl-10",
                  (rightIcon || isPassword || loading) && "pr-10",
                  fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500",
                  className,
                )}
              />

              {/* 🔥 Right Side Controls */}
              <div className="absolute right-3 flex items-center gap-1">
                {/* Loading */}
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}

                {/* Password Toggle */}
                {isPassword && !loading && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}

                {/* Right Icon */}
                {!isPassword && !loading && rightIcon}
              </div>
            </div>

            {/* 🔴 Error */}
            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomInput;
