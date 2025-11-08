"use client";

import { useMemo } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const THEME_LABELS: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  construction: "Construct",
};

export function ThemeToggle() {
  const { theme, themes, setTheme } = useTheme();
  const options = useMemo(() => themes, [themes]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-strong bg-panel-muted p-1 backdrop-blur-lg">
      {options.map((option) => {
        const isActive = option === theme;
        return (
          <Button
            key={option}
            type="button"
            variant={isActive ? "primary" : "ghost"}
            size="sm"
            className={cn(
              "px-3 text-xs uppercase tracking-[0.25em]",
              !isActive && "text-muted",
            )}
            onClick={() => setTheme(option)}
          >
            {THEME_LABELS[option] ?? option}
          </Button>
        );
      })}
    </div>
  );
}


