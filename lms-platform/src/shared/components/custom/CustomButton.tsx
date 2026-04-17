"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type CustomButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;

  // 🔥 Features
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const CustomButton = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  size = "default",
  className = "",

  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: CustomButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 hover:cursor-pointer ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {/* 🔥 Loading Spinner */}
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {/* 🔥 Left Icon */}
      {!loading && leftIcon}

      {/* 🔥 Text */}
      <span>{children}</span>

      {/* 🔥 Right Icon */}
      {!loading && rightIcon}
    </Button>
  );
};

export default CustomButton;
