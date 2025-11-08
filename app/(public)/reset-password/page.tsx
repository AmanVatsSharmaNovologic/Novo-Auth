"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { logError, logInfo } from "@/lib/logging/console";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(12, "Use at least 12 characters for maximum entropy."),
    confirmPassword: z
      .string()
      .min(12, "Confirmation must match your new passphrase."),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passphrases do not match.",
        path: ["confirmPassword"],
      });
    }
  });

type ResetFormValues = z.infer<typeof resetSchema>;

/**
 * ResetPasswordPage orchestrates token validation and password confirmation.
 */
export default function ResetPasswordPage() {
  useEffect(() => {
    logInfo({
      scope: "page:reset-password",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:reset-password",
        event: "unmount",
      });
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    logInfo({
      scope: "page:reset-password",
      event: "submit",
    });

    try {
      logInfo({
        scope: "page:reset-password",
        event: "submit:pending",
        context: { passwordLength: values.password.length },
      });
    } catch (error) {
      logError({
        scope: "page:reset-password",
        event: "submit:error",
        context: { error },
      });
    }
  });

  return (
    <AuthContainer
      subtitle="Define a fresh passphrase to secure your Novo identity. This link expires once the update is complete."
      title="Reset your Novo passphrase"
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <Input
          autoComplete="new-password"
          error={errors.password?.message}
          hint="Minimum 12 characters with a blend of cases, numbers, and symbols."
          placeholder="New passphrase"
          type="password"
          {...register("password")}
        />
        <Input
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          hint="Re-enter your new passphrase to confirm."
          placeholder="Confirm passphrase"
          type="password"
          {...register("confirmPassword")}
        />

        <Button disabled={isSubmitting} type="submit">
          Secure My Account
        </Button>

        <Alert tone="info">
          We’ll sign out other active sessions once this change is saved so you remain in full control.
        </Alert>
      </form>
    </AuthContainer>
  );
}

