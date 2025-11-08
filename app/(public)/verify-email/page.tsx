"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * VerifyEmailPage confirms the magic link flow and provides status messaging.
 */
export default function VerifyEmailPage() {
  useEffect(() => {
    logInfo({
      scope: "page:verify-email",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:verify-email",
        event: "unmount",
      });
    };
  }, []);

  const handleResend = () => {
    logInfo({
      scope: "page:verify-email",
      event: "resend",
    });
  };

  return (
    <AuthContainer
      subtitle="We’ve sent a secure link to your inbox. Completing that step finalizes your Novo access."
      title="We’re validating your signal"
    >
      <div className="space-y-6 text-center">
        <div
          aria-hidden="true"
          className="mx-auto h-24 w-24 rounded-full border border-strong bg-panel-muted shadow-accent-primary"
        />
        <p className="text-sm text-muted">
          Keep this window open. As soon as you confirm the email, we’ll direct you to finish
          multi-factor setup.
        </p>
        <Button onClick={handleResend} type="button" variant="secondary">
          Resend verification email
        </Button>
        <Alert tone="info">
          Didn’t receive the message? Check your spam folder or contact Security to manually approve
          your identity.
        </Alert>
      </div>
    </AuthContainer>
  );
}

