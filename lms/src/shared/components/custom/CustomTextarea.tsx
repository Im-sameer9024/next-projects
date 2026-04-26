"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Textarea } from "../ui/textarea"; // shadcn textarea
import { cn } from "@/shared/lib/utils";

type CustomTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  loading?: boolean;

  description?: string;
  className?: string;

  rows?: number;
};

const CustomTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  loading = false,
  description,
  className,
  rows = 4,
}: CustomTextareaProps<T>) => {
  return (
    <div className="space-y-1 w-full">
      {/* 🔹 Label */}
      {label && (
        <label className="text-sm font-semibold text-text-slate-500">
          {label}
        </label>
      )}

      {/* 🔹 Textarea */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled || loading}
              className={cn(
                "w-full text-text-slate-500 resize-none h-30",
                fieldState.error && "border-red-500",
                className
              )}
            />

            {/* 🔴 Error */}
            {fieldState.error && (
              <p className="text-xs text-red-500">
                {fieldState.error.message}
              </p>
            )}

            {/* 🔹 Description */}
            {description && (
              <p className="text-xs">{description}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomTextarea;