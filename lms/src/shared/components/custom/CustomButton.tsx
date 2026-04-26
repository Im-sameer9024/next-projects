"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils";

type CustomButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: string;
  active?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
};

const CustomButton = ({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  className,
  active = false,
  variant = "default",
  size = "default",
  leftIcon,
  rightIcon,
  iconOnly = false,
  fullWidth = false,
  ...props
}: CustomButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "transition-all  duration-200 flex items-center justify-center gap-2 hover:cursor-pointer",
        fullWidth && "w-full",
        active && "ring-2 ring-primary ring-offset-2",
        iconOnly && "p-2",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && (loadingText || children)}
        </>
      ) : (
        <>
          {!iconOnly && leftIcon}
          {!iconOnly && children}
          {!iconOnly && rightIcon}
          {iconOnly && (leftIcon || rightIcon)}
        </>
      )}
    </Button>
  );
};

export default CustomButton;
