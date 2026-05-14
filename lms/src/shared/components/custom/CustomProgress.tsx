// shared/components/custom/CourseProgress.tsx
"use client";

import { cn } from "@/shared/lib/utils";
import React from "react";

interface CustomProgressProps {
  value: number;
  variant?: "default" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export const CustomProgress = ({
  value,
  variant = "default",
  size = "md",
  showPercentage = false,
  className,
}: CustomProgressProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const variantStyles = {
    default: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-amber-500",
  };

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            "transition-all duration-300 ease-in-out rounded-full",
            variantStyles[variant],
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs font-medium text-gray-600">
            {Math.round(clampedValue)}% Complete
          </span>
        </div>
      )}
    </div>
  );
};
