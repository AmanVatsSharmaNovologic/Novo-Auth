"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";

import { AuthContainer } from "@/components/layout/AuthContainer";
import { CredentialForm } from "@/components/auth/CredentialForm";
import { SocialProviders } from "@/components/auth/SocialProviders";

/**
 * LoginPage bootstraps the credential and social auth entry points.
 * The actual forms will be composed from reusable UI primitives defined
 * in `components/auth` during later phases of the implementation.
 */
export default function LoginPage() {
  useEffect(() => {
    logInfo({
      scope: "page:login",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:login",
        event: "unmount",
      });
    };
  }, []);

  return (
    <AuthContainer
      subtitle="Authenticate to access the Novo mission control environment."
      title="Welcome back, Operator"
    >
      <div className="space-y-6">
        <CredentialForm mode="login" />
        <div className="relative py-4 text-center text-xs uppercase tracking-[0.3em] text-muted">
          <span className="bg-panel px-3">Or federate via</span>
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px w-full bg-gradient-to-r from-transparent via-[color:rgba(148,163,184,0.3)] to-transparent" />
        </div>
        <SocialProviders />

        {/* New to Novo CTA */}
        <div className="mt-8 rounded-2xl border border-[color:var(--accent-primary)]/20 bg-gradient-to-br from-[color:var(--accent-primary)]/5 to-transparent p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary)]/10">
              <svg
                className="h-6 w-6 text-[color:var(--accent-primary)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-foreground">New to Novo?</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]" />
                  Unified access across all Novo modules
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]" />
                  Enterprise-grade multi-factor authentication
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]" />
                  Seamless SSO between platform services
                </li>
              </ul>
              <a
                className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent-primary)] transition-colors hover:text-[color:var(--accent-secondary)]"
                href="/signup"
              >
                Create your account
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
}


