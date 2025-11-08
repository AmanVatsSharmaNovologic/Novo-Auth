"use client";

import type { ReactNode } from "react";
import { logInfo } from "@/lib/logging/console";
import { cn } from "@/lib/utils/cn";

type AlertTone = "info" | "success" | "warn" | "danger";

const toneClasses: Record<AlertTone, string> = {
  info: "border-[color:rgba(var(--accent-primary-rgb),0.35)] bg-[color:rgba(var(--accent-primary-rgb),0.12)] text-foreground",
  success: "border-[color:rgba(34,197,94,0.35)] bg-[color:rgba(34,197,94,0.12)] text-foreground",
  warn: "border-[color:rgba(var(--accent-tertiary-rgb),0.35)] bg-[color:rgba(var(--accent-tertiary-rgb),0.12)] text-foreground",
  danger: "border-[color:rgba(239,68,68,0.35)] bg-[color:rgba(239,68,68,0.12)] text-foreground",
};

type AlertProps = {
  children: ReactNode;
  tone?: AlertTone;
  className?: string;
};

export function Alert({ children, tone = "info", className }: AlertProps) {
  logInfo({
    scope: "component:UI:Alert",
    event: "render",
    context: { tone },
  });

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm backdrop-blur-xl",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}



