"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { logInfo } from "@/lib/logging/console";

/**
 * ProtectedRoute will wrap children with session verification logic once wired.
 * For now it simply logs lifecycle events.
 */
export function ProtectedRoutePlaceholder({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    logInfo({
      scope: "component:ProtectedRoute",
      event: "mount",
    });
    return () => {
      logInfo({
        scope: "component:ProtectedRoute",
        event: "unmount",
      });
    };
  }, []);

  return <>{children}</>;
}


