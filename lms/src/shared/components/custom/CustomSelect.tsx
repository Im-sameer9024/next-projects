"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  placeholder?: string;

  options: Option[];

  disabled?: boolean;
  loading?: boolean;

  className?: string;
};

const CustomSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  disabled = false,
  loading = false,
  className,
}: CustomSelectProps<T>) => {
  return (
    <div className="space-y-1 w-full">
      {/* 🔹 Label */}
      {label && (
        <label className="text-sm font-semibold text-darkText">{label}</label>
      )}

      {/* 🔹 Select */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Select
              onValueChange={field.onChange}
              value={field.value} // ✅ controlled (important)
              disabled={disabled || loading}
            >
              <SelectTrigger
                className={cn(
                  "w-full text-darkText",
                  fieldState.error && "border-red-500",
                  className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                {options.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

export default CustomSelect;
