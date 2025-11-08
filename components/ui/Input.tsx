"use client";

import { forwardRef, useEffect, useState } from "react";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

import { logInfo } from "@/lib/logging/console";
import { cn } from "@/lib/utils/cn";

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: string | null;
  hint?: string | null;
  showPasswordStrength?: boolean;
};

type PasswordStrength = "weak" | "medium" | "strong" | null;

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return null;
  if (password.length < 8) return "weak";
  
  let score = 0;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
};

const strengthColors = {
  weak: "bg-[color:var(--accent-danger)]",
  medium: "bg-[color:var(--accent-tertiary)]",
  strong: "bg-[color:var(--accent-success)]",
};

const strengthLabels = {
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, showPasswordStrength, ...props }, ref) => {
    const [strength, setStrength] = useState<PasswordStrength>(null);

    useEffect(() => {
      logInfo({
        scope: "component:UI:Input",
        event: "mount",
        context: { name: props.name ?? null },
      });
      return () => {
        logInfo({
          scope: "component:UI:Input",
          event: "unmount",
          context: { name: props.name ?? null },
        });
      };
    }, [props.name]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showPasswordStrength && props.type === "password") {
        setStrength(calculatePasswordStrength(e.target.value));
      }
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2 text-left">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-2xl border border-strong bg-panel-muted px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted focus-visible:border-[color:var(--accent-primary)] focus-visible:shadow-accent-primary",
            error
              ? "border-[color:rgba(239,68,68,0.5)] focus-visible:border-[color:rgba(248,113,113,0.8)] focus-visible:shadow-[0_0_0_2px_rgba(248,113,113,0.35)]"
              : "",
            className,
          )}
          {...props}
          onChange={handleChange}
        />
        
        {/* Password strength meter */}
        {showPasswordStrength && props.type === "password" && strength && (
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              {["weak", "medium", "strong"].map((level, idx) => (
                <div
                  key={level}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    strength === "weak" && idx === 0
                      ? strengthColors.weak
                      : strength === "medium" && idx <= 1
                        ? strengthColors.medium
                        : strength === "strong"
                          ? strengthColors.strong
                          : "bg-strong/30",
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted">
              Password strength: <span className="font-medium">{strengthLabels[strength]}</span>
            </p>
          </div>
        )}

        {hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
        {error ? (
          <p className="text-xs text-[color:rgba(248,113,113,0.9)]">{error}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

