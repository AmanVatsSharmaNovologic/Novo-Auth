"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";

import { Alert } from "@/components/ui/Alert";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/Button";

/**
 * MfaVerifyPage challenges the operator with TOTP or OTP verification to
 * complete their session initialization.
 */
export default function MfaVerifyPage() {
  useEffect(() => {
    logInfo({
      scope: "page:mfa-verify",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:mfa-verify",
        event: "unmount",
      });
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          Confirm your second factor
        </h1>
        <p className="text-sm text-muted">
          Enter the code from your authenticator or request a secure OTP via
          SMS/email if needed.
        </p>
      </header>

      <OtpInput />

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          onClick={() =>
            logInfo({
              scope: "page:mfa-verify",
              event: "use-recovery-code",
            })
          }
          type="button"
          variant="ghost"
        >
          Use recovery code
        </Button>
        <Button
          onClick={() =>
            logInfo({
              scope: "page:mfa-verify",
              event: "escalate-support",
            })
          }
          type="button"
          variant="secondary"
        >
          Contact Security Desk
        </Button>
      </div>

      <Alert tone="info">
        Having trouble? Request another code or escalate to the Security desk so they can reissue your factors.
      </Alert>
    </section>
  );
}


