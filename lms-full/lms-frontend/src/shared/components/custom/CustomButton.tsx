"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "../ui/spinner";

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
        "flex items-center justify-center gap-2 transition-all duration-200 hover:cursor-pointer",
        fullWidth && "w-full",
        active && "ring-primary ring-2 ring-offset-2",
        iconOnly && "p-2",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
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
