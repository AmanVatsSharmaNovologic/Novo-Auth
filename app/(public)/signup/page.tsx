"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { CredentialForm } from "@/components/auth/CredentialForm";

/**
 * SignupPage orchestrates new account creation and sets expectations for
 * email verification plus MFA enrollment.
 */
export default function SignupPage() {
  useEffect(() => {
    logInfo({
      scope: "page:signup",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:signup",
        event: "unmount",
      });
    };
  }, []);

  return (
    <AuthContainer
      subtitle="Provide your operator details to unlock the Novo platform. We’ll verify your email and walk you through multi-factor enrollment."
      title="Activate your Novo credentials"
    >
      <div className="space-y-6">
        <div
          aria-hidden="true"
          className="mx-auto h-24 w-24 rounded-full border border-strong bg-panel-muted shadow-accent-primary"
        />
        <CredentialForm mode="signup" submitLabel="Activate My Access" />
        
        {/* Enhanced login link */}
        <div className="rounded-xl border border-strong/50 bg-surface-secondary/30 p-4 text-center backdrop-blur-sm">
          <p className="text-sm text-muted">
            Already onboarded?{" "}
            <a 
              className="font-medium text-[color:var(--accent-primary)] transition-colors hover:text-[color:var(--accent-secondary)] hover:underline" 
              href="/login"
            >
              Return to login →
            </a>
          </p>
        </div>
      </div>
    </AuthContainer>
  );
}

