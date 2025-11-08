"use client";

import { useEffect, type ReactNode } from "react";

import { logInfo } from "@/lib/logging/console";
import { cn } from "@/lib/utils/cn";

type AuthContainerProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

/**
 * AuthContainer provides a reusable shell for public auth screens to ensure
 * consistent spacing and theming.
 */
export function AuthContainer({
  children,
  className,
  title,
  subtitle,
}: AuthContainerProps) {
  useEffect(() => {
    logInfo({
      scope: "component:AuthContainer",
      event: "mount",
      context: { title },
    });
    return () => {
      logInfo({
        scope: "component:AuthContainer",
        event: "unmount",
        context: { title },
      });
    };
  }, [title]);

  return (
    <section
      className={cn(
        "relative w-full max-w-xl space-y-8 overflow-hidden rounded-3xl border border-strong bg-panel p-12 shadow-accent-primary backdrop-blur-2xl focus-scale hover-lift",
        className,
      )}
    >
      {/* Grid pattern overlay for construction theme */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-0 transition-opacity duration-300 [html[data-theme='construction']_&]:opacity-100" />
      
      {/* Scanning line animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 [html[data-theme='construction']_&]:opacity-100">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-primary)] to-transparent animate-scan" />
      </div>

      <div className="relative z-10">
        {title ? (
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted">{subtitle}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}


