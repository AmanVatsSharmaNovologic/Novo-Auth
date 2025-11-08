"use client";

import { useEffect } from "react";

import { logInfo } from "@/lib/logging/console";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * DashboardPage acts as the post-auth landing zone where users can launch
 * into other Novo modules. Later iterations will hydrate this view using
 * GraphQL `Me` + `AuthModuleRedirect` data.
 */
export default function DashboardPage() {
  useEffect(() => {
    logInfo({
      scope: "page:dashboard",
      event: "mount",
    });

    return () => {
      logInfo({
        scope: "page:dashboard",
        event: "unmount",
      });
    };
  }, []);

  const modules = [
    {
      slug: "platform",
      name: "Platform Core",
      description:
        "Launch critical operations, view consolidated analytics, and manage org-level controls.",
      glow: "sky" as const,
    },
    {
      slug: "observability",
      name: "Observability",
      description:
        "Navigate into telemetry dashboards to monitor authentication health in near real time.",
      glow: "pink" as const,
    },
  ];

  return (
    <section className="space-y-6">
      <Alert tone="info">
        Choose a module to continue. Your options reflect the access profile issued by Security.
      </Alert>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <Card glow={module.glow} key={module.slug}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {module.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {module.description}
                </p>
              </div>
              <Button
                className="w-full sm:w-auto"
                onClick={() =>
                  logInfo({
                    scope: "page:dashboard",
                    event: "module:select",
                    context: { module: module.slug },
                  })
                }
                variant="primary"
              >
                Engage Module
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}


