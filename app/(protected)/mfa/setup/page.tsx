"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";

import { TotpSetup } from "@/components/auth/TotpSetup";
import { Alert } from "@/components/ui/Alert";

/**
 * MfaSetupPage guides operators through TOTP enrollment and recovery code acknowledgement.
 */
export default function MfaSetupPage() {
  useEffect(() => {
    logInfo({
      scope: "page:mfa-setup",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:mfa-setup",
        event: "unmount",
      });
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          Harden your ingress
        </h1>
        <p className="text-sm text-muted">
          Scan the code with your authenticator to link your device with the
          Novo identity perimeter.
        </p>
      </header>

      <TotpSetup />

      <Alert tone="warn">
        Lost access to your authenticator? Contact the Security desk immediately to reset multi-factor protection.
      </Alert>
    </section>
  );
}


