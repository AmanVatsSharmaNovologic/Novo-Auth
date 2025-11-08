"use client";

import { useTransition } from "react";

import { logInfo } from "@/lib/logging/console";

import { Button } from "../ui/Button";

const providers = [
  {
    id: "google",
    label: "Continue with Google",
  },
  {
    id: "github",
    label: "Continue with GitHub",
  },
];

export function SocialProviders() {
  const [pending, startTransition] = useTransition();

  const handleProvider = (id: string) => {
    startTransition(() => {
      logInfo({
        scope: "component:SocialProviders",
        event: "select",
        context: { provider: id },
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            disabled={pending}
            onClick={() => handleProvider(provider.id)}
            variant="secondary"
          >
            {provider.label}
          </Button>
        ))}
      </div>
      <p className="text-center text-xs text-muted">
        Sign in with your trusted identity provider to stay synced across every Novo module.
      </p>
    </div>
  );
}

