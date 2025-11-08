"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { logError, logInfo } from "@/lib/logging/console";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type CredentialFormMode = "login" | "signup";

type CredentialFormValues = {
  fullName?: string;
  email: string;
  password: string;
  acceptTerms?: boolean;
};

type CredentialFormProps = {
  mode: CredentialFormMode;
  onSubmit?: (values: CredentialFormValues) => Promise<void> | void;
  submitLabel?: string;
};

const resolveSchema = (mode: CredentialFormMode) =>
  z
    .object({
      fullName: z.string().min(2, "Use your full name").optional(),
      email: z.string().email("Enter a valid email address"),
      password: z
        .string()
        .min(12, "Use at least 12 characters for your password"),
      acceptTerms: z.boolean().optional(),
    })
    .superRefine((values, ctx) => {
      if (mode === "signup") {
        if (!values.fullName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Full name is required for onboarding.",
            path: ["fullName"],
          });
        }
        if (!values.acceptTerms) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "You must accept Novo platform policies.",
            path: ["acceptTerms"],
          });
        }
      }
    });

export function CredentialForm({
  mode,
  onSubmit,
  submitLabel = mode === "login" ? "Enter Command Center" : "Initialize Access",
}: CredentialFormProps) {
  const schema = resolveSchema(mode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CredentialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      acceptTerms: mode === "signup" ? false : undefined,
    },
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    logInfo({
      scope: "component:CredentialForm",
      event: "submit",
      context: {
        mode,
        email: values.email,
      },
    });

    if (onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        logError({
          scope: "component:CredentialForm",
          event: "submit:error",
          context: { error },
        });
      }
    } else {
      logInfo({
        scope: "component:CredentialForm",
        event: "submit:noop",
        context: { mode },
      });
    }
  });

  const acceptTerms = watch("acceptTerms");

  return (
    <form className="space-y-6 text-left" onSubmit={handleFormSubmit}>
      {/* Security badge */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-[color:var(--accent-success)]/20 bg-[color:var(--accent-success)]/5 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-[color:var(--accent-success)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium text-[color:var(--accent-success)]">256-bit Encryption</span>
        </div>
        <span className="text-muted">•</span>
        <div className="flex items-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-[color:var(--accent-success)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium text-[color:var(--accent-success)]">HTTPS Secure</span>
        </div>
      </div>

      {mode === "signup" ? (
        <Input
          autoComplete="name"
          error={errors.fullName?.message}
          hint="This name synchronizes with your Novo operator profile."
          placeholder="Commander Jane Doe"
          {...register("fullName")}
        />
      ) : null}

      <Input
        autoComplete="email"
        error={errors.email?.message}
        hint="Use your Novologic-issued email for immediate access."
        placeholder="operator@novologic.co"
        type="email"
        {...register("email")}
      />

      <Input
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        error={errors.password?.message}
        hint={
          mode === "signup"
            ? "Minimum 12 characters. Include upper, lower, numeric, and symbol."
            : "Enter the passphrase associated with your Novo identity."
        }
        placeholder="Enter passphrase"
        showPasswordStrength={mode === "signup"}
        type="password"
        {...register("password")}
      />

      {mode === "signup" ? (
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            className="mt-1 h-4 w-4 rounded border border-strong bg-panel-muted focus-visible:border-[color:var(--accent-primary)] focus-visible:shadow-accent-primary"
            type="checkbox"
            {...register("acceptTerms")}
          />
          <span>
            I acknowledge Novo&apos;s security protocols and consent to the shared
            authentication policies across all modules.
          </span>
        </label>
      ) : null}

      <Button 
        disabled={isSubmitting || (mode === "signup" && !acceptTerms)} 
        isLoading={isSubmitting}
        loadingText={mode === "login" ? "Authenticating..." : "Activating..."}
        type="submit"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

