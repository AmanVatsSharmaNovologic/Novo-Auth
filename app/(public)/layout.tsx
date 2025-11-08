/**
 * PublicLayout provides shared scaffolding for unauthenticated routes
 * such as login, signup, verification, and password reset.
 *
 * The layout renders a branded container while logging runtime events
 * to support downstream debugging efforts.
 */
import type { ReactNode } from "react";

import { logInfo } from "@/lib/logging/console";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  logInfo({
    scope: "layout:public",
    event: "render",
  });

  return (
    <div className="min-h-screen bg-surface-primary text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-lg font-semibold tracking-[0.3em] uppercase">
              Novo Auth
            </span>
            <span className="block text-xs uppercase text-muted">
              Secure Access Gateway
            </span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>

        <footer className="pt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} Novologic. All rights reserved.
        </footer>
      </div>
    </div>
  );
}


