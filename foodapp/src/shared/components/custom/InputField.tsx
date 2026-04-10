/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // icons
import { Input } from "../ui/input";

interface InputFieldProps {
  name: string;
  control: any; // from useForm()
  label?: string;
  loading?: boolean;
  placeholder?: string;
  type?: string;
  error: any;
  rules?: object;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  label,
  loading,
  placeholder,
  type = "text",
  error,
  rules,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <div className="relative">
            <Input
              {...field}
              disabled={loading}
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              className={` bg-slate-100 ${fieldState.error ? "border-red-500 pr-10" : "pr-10"}`}
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
