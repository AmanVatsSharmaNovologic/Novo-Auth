"use client";

import type { ReactNode } from "react";

import { logInfo } from "@/lib/logging/console";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  glow?: "sky" | "pink" | "emerald" | "amber" | "none";
};

const glowClasses: Record<Exclude<CardProps["glow"], undefined>, string> = {
  none: "",
  sky: "shadow-[0_0_45px_rgba(var(--accent-primary-rgb),0.28)]",
  pink: "shadow-[0_0_45px_rgba(var(--accent-secondary-rgb),0.24)]",
  emerald: "shadow-[0_0_45px_rgba(52,211,153,0.2)]",
  amber: "shadow-[0_0_45px_rgba(var(--accent-tertiary-rgb),0.24)]",
};

export function Card({ children, className, glow = "none" }: CardProps) {
  logInfo({
    scope: "component:UI:Card",
    event: "render",
    context: { glow },
  });

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-strong bg-panel p-8 text-foreground backdrop-blur-2xl transition-all hover:border-[color:rgba(var(--accent-primary-rgb),0.35)] hover-lift",
        glowClasses[glow],
        className,
      )}
    >
      {/* Subtle grid pattern on hover */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
