import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-6 py-16 text-foreground">
      <div className="w-full max-w-2xl space-y-10 text-center">
        <div className="relative mx-auto h-48 w-48">
          <div className="absolute inset-0 rounded-full border border-strong bg-panel shadow-accent-primary" />
          <div className="absolute inset-6 rounded-full border border-[color:rgba(var(--accent-primary-rgb),0.35)] bg-panel-muted" />
          <div className="absolute inset-14 flex items-center justify-center">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-primary" />
          </div>
          <span className="absolute -top-2 left-8 h-2 w-2 rounded-full bg-accent-secondary" />
          <span className="absolute right-4 top-6 h-1.5 w-1.5 rounded-full bg-accent-tertiary" />
          <span className="absolute bottom-4 left-6 h-1.5 w-1.5 rounded-full bg-accent-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Lost in Novo Space</h1>
          <p className="text-sm text-muted">
            The module you&apos;re searching for has drifted off course. Re-enter through a known
            gateway to continue your mission.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <a href="/dashboard">Return to dashboard</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/login">Go to authentication</a>
          </Button>
        </div>
      </div>
    </div>
  );
}


