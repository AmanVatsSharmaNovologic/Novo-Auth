"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";

import { logInfo } from "@/lib/logging/console";

import { Button } from "../ui/Button";
import { cn } from "@/lib/utils/cn";

type OtpInputProps = {
  length?: number;
  onSubmit?: (code: string) => Promise<void> | void;
  allowResend?: boolean;
  onResend?: () => Promise<void> | void;
};

export function OtpInput({
  length = 6,
  onSubmit,
  allowResend = true,
  onResend,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(() =>
    Array.from({ length }, () => ""),
  );
  const [cursor, setCursor] = useState(0);

  const code = useMemo(() => values.join(""), [values]);

  const handleChange = useCallback(
    (index: number, digit: string) => {
      const sanitized = digit.slice(-1).replace(/[^0-9]/g, "");
      setValues((prev) => {
        const next = [...prev];
        next[index] = sanitized;
        return next;
      });
      if (sanitized) {
        setCursor(Math.min(index + 1, length - 1));
      }
    },
    [length],
  );

  const handleKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !values[index]) {
        setCursor(Math.max(index - 1, 0));
      }
    },
    [values],
  );

  const handleSubmit = useCallback(async () => {
    logInfo({
      scope: "component:OtpInput",
      event: "submit",
      context: { code },
    });

    if (code.length === length && onSubmit) {
      await onSubmit(code);
    }
  }, [code, length, onSubmit]);

  const handleResend = useCallback(async () => {
    logInfo({
      scope: "component:OtpInput",
      event: "resend",
    });
    if (onResend) {
      await onResend();
    }
  }, [onResend]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {values.map((value, index) => (
          <input
            key={index}
            autoFocus={index === cursor}
            className={cn(
              "h-14 w-12 rounded-2xl border border-strong bg-panel-muted text-center text-lg font-semibold text-foreground transition-all",
              "focus-visible:border-[color:var(--accent-primary)] focus-visible:shadow-accent-primary",
            )}
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={handleSubmit} variant="primary">
          Verify Code
        </Button>
        {allowResend ? (
          <Button onClick={handleResend} type="button" variant="ghost">
            Resend OTP
          </Button>
        ) : null}
      </div>
    </div>
  );
}

