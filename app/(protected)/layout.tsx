import type { ReactNode } from "react";

import { logInfo } from "@/lib/logging/console";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * ProtectedLayout enforces authenticated experiences by wrapping routes that
 * require an active session. Middleware and NextAuth checks will complement
 * this layout to guarantee only verified users reach the protected UI.
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  logInfo({
    scope: "layout:protected",
    event: "render",
  });

  return (
    <div className="min-h-screen bg-surface-primary text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-8 py-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-lg font-semibold">Novo Control Center</span>
            <span className="block text-sm text-muted">
              Authenticated Session Active
            </span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-6">{children}</main>

        <footer className="pt-6 text-xs text-muted">
          Need assistance? Reach out via the platform support channel.
        </footer>
      </div>
    </div>
  );
}


