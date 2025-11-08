"use client";

import Image from "next/image";
import { useMemo } from "react";

import { logInfo } from "@/lib/logging/console";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type TotpSetupProps = {
  secret?: {
    base32?: string;
    otpauthUrl?: string;
  };
  onRegenerate?: () => Promise<void> | void;
  onConfirm?: () => Promise<void> | void;
};

const sampleRecoveryCodes = [
  "7G5K-89LM",
  "PT3Q-4ZWS",
  "N6VB-2XQJ",
  "HF1L-8MDK",
  "QA9S-0WER",
];

export function TotpSetup({ secret, onRegenerate, onConfirm }: TotpSetupProps) {
  const qrSource = useMemo(() => {
    if (!secret?.otpauthUrl) {
      logInfo({
        scope: "component:TotpSetup",
        event: "qr:missing",
      });
      return "/vercel.svg";
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      secret.otpauthUrl,
    )}`;
  }, [secret?.otpauthUrl]);

  const handleRegenerate = async () => {
    if (onRegenerate) {
      await onRegenerate();
    } else {
      logInfo({
        scope: "component:TotpSetup",
        event: "regenerate:noop",
      });
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    } else {
      logInfo({
        scope: "component:TotpSetup",
        event: "confirm:noop",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="space-y-4" glow="amber">
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Step 1 — Scan the code
          </h3>
          <p className="text-xs text-muted">
            Use your authenticator app (1Password, Authy, Google Authenticator)
            to scan this QR code.
          </p>
        </header>
        <div className="flex justify-center">
          <div className="rounded-2xl border border-[color:rgba(var(--accent-tertiary-rgb),0.4)] bg-panel-muted p-3">
            <Image
              alt="TOTP QR code preview"
              className="h-[220px] w-[220px] rounded-xl object-contain"
              height={220}
              src={qrSource}
              width={220}
            />
          </div>
        </div>
        <Alert tone="warn">
          Keep this secret safe—anyone with the QR code can pair your factor.
        </Alert>
        <Button
          className="w-full"
          onClick={handleRegenerate}
          type="button"
          variant="ghost"
        >
          Regenerate Secret
        </Button>
      </Card>

      <Card className="space-y-4" glow="emerald">
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Step 2 — Store recovery codes
          </h3>
          <p className="text-xs text-muted">
            These one-time codes bypass TOTP if your device is unavailable. Store
            them offline in a secure location.
          </p>
        </header>
        <ul className="grid gap-2 text-sm font-mono text-muted">
        {sampleRecoveryCodes.map((code) => (
            <li
              key={code}
              className="rounded-xl border border-strong bg-panel-muted px-4 py-2 tracking-widest text-foreground"
            >
              {code}
            </li>
          ))}
        </ul>
        <Button className="w-full" onClick={handleConfirm} variant="secondary">
          I&apos;ve Stored These Codes
        </Button>
        <Alert tone="info">
          Save these codes in a password manager or secure vault. They give you
          a fallback if your authenticator device becomes unavailable.
        </Alert>
      </Card>
    </div>
  );
}

