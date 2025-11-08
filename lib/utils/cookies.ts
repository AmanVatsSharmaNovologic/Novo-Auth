import { logInfo } from "@/lib/logging/console";

export type CookieOptions = {
  path: string;
  maxAge: number;
  sameSite: "lax" | "strict" | "none";
  secure: boolean;
  domain?: string;
};

export const buildCookieOptions = (
  maxAgeSeconds = 60 * 60 * 24 * 365,
  domain?: string,
): CookieOptions => ({
  path: "/",
  maxAge: maxAgeSeconds,
  sameSite: "lax",
  secure: process.env.NODE_ENV !== "development",
  domain,
});

export const logCookieUpdate = (name: string, value: unknown) => {
  logInfo({
    scope: "utils:cookies",
    event: "update",
    context: { name, value },
  });
};

