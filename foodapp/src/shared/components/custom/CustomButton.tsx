// src/shared/components/common/CustomButton.tsx

"use client";

import React, { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  active = false,
  variant = "default",
  size = "default",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading || props.disabled}
      className={`font-content hover:cursor-pointer hover:scale-95 transition-all duration-300 
        ${fullWidth ? "w-full" : ""} 
        ${active ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-300 text-black hover:bg-slate-400"} 
        ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && <Loader2 className="animate-spin mr-1" size={16} />}

      {/* Left Icon */}
      {!loading && leftIcon && <span className="flex items-center mr-1">{leftIcon}</span>}

      {/* Button Text */}
      {children}

      {/* Right Icon */}
      {!loading && rightIcon && <span className="flex items-center ml-1">{rightIcon}</span>}
    </Button>
  );
};

export default CustomButton;
