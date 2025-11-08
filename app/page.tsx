/**
 * Home route acts as an entry point redirecting prospective operators into the
 * authentication flow. Once analytics are wired, this surface can double as a
 * narrative landing experience.
 */
import { logInfo } from "@/lib/logging/console";

import { Button } from "@/components/ui/Button";

export default function Home() {
  logInfo({
    scope: "page:home",
    event: "render",
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary text-foreground">
      <div className="w-full max-w-3xl space-y-10 rounded-3xl border border-strong bg-panel p-12 text-center shadow-accent-primary backdrop-blur-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Novo Unified Access
          </h1>
        <p className="text-sm text-muted">
          One identity for every Novologic module. Seamless transitions, layered
          multi-factor security, and real-time session awareness are being
          engineered right here.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <a href="/login">Proceed to Authentication</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/signup">Request Access</a>
          </Button>
        </div>
        </div>
    </div>
  );
}
