"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  useEffect,
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
} from "react";

import { logInfo } from "@/lib/logging/console";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-on-accent shadow-accent-primary hover:brightness-110 active:scale-[0.99]",
  secondary:
    "border border-strong bg-panel text-foreground shadow-sm hover:bg-panel-muted active:scale-[0.99]",
  ghost:
    "border border-transparent text-muted hover:border-strong hover:bg-panel-muted hover:text-foreground",
  danger:
    "bg-[color:rgba(239,68,68,0.95)] text-on-accent shadow-[0_18px_32px_rgba(239,68,68,0.28)] hover:brightness-110 active:scale-[0.99]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = "primary", 
      size = "md", 
      asChild = false, 
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props 
    },
    ref,
  ) => {
    useEffect(() => {
      logInfo({
        scope: "component:UI:Button",
        event: "mount",
        context: { variant, size },
      });
      return () => {
        logInfo({
          scope: "component:UI:Button",
          event: "unmount",
          context: { variant, size },
        });
      };
    }, [size, variant]);

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref as any}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)] focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        )}
        {isLoading && loadingText ? loadingText : children}
      </Component>
    );
  },
);

Button.displayName = "Button";


