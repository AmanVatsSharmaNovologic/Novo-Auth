"use client";

import { useMemo } from "react";

import { logInfo } from "@/lib/logging/console";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type RecoveryCodesProps = {
  codes?: string[];
  onRegenerate?: () => Promise<void> | void;
};

export function RecoveryCodes({ codes, onRegenerate }: RecoveryCodesProps) {
  const fallbackCodes = useMemo(
    () => [
      "01ZX-7KLP",
      "92MV-QWER",
      "63BN-HYTG",
      "74CA-MNBV",
      "85DJ-ASDF",
    ],
    [],
  );

  const codesToRender = codes?.length ? codes : fallbackCodes;

  logInfo({
    scope: "component:RecoveryCodes",
    event: "render",
    context: { provided: Boolean(codes?.length) },
  });

  const handleRegenerate = async () => {
    if (onRegenerate) {
      await onRegenerate();
    } else {
      logInfo({
        scope: "component:RecoveryCodes",
        event: "regenerate:noop",
      });
    }
  };

  return (
    <Card className="space-y-4" glow="emerald">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Recovery Codes
        </h3>
        <p className="text-xs text-muted">
          Each code can only be used once. Store them offline and never share
          them publicly.
        </p>
      </header>
      <ul className="grid gap-2 font-mono text-sm tracking-widest text-muted">
        {codesToRender.map((code) => (
          <li
            key={code}
            className="rounded-xl border border-strong bg-panel-muted px-4 py-2 text-center text-foreground"
          >
            {code}
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        <Alert tone="info">
          Store these codes offline. They let you regain access when you cannot
          use your authenticator.
        </Alert>
        <Button onClick={handleRegenerate} type="button" variant="secondary">
          Generate New Codes
        </Button>
      </div>
    </Card>
  );
}


