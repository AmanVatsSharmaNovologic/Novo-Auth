import { logInfo, logWarn } from "@/lib/logging/console";

export type GraphqlSessionPayload = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    mfaEnabled?: boolean;
    modules?: Array<{
      slug: string;
      name: string;
      status?: string;
    }>;
  };
  mfa?: {
    required: boolean;
    methods?: string[];
  };
};

export type NormalizedSession = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  userId: string | null;
  email: string | null;
  modules: Array<{ slug: string; name: string; status?: string }>;
  mfaRequired: boolean;
};

export const normalizeSessionPayload = (
  payload?: GraphqlSessionPayload | null,
): NormalizedSession => {
  if (!payload) {
    logWarn({
      scope: "auth:session",
      event: "normalize:missing-payload",
    });

    return {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      userId: null,
      email: null,
      modules: [],
      mfaRequired: false,
    };
  }

  logInfo({
    scope: "auth:session",
    event: "normalize",
    context: { userId: payload.user.id },
  });

  return {
    accessToken: payload.accessToken ?? null,
    refreshToken: payload.refreshToken ?? null,
    expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    userId: payload.user.id ?? null,
    email: payload.user.email ?? null,
    modules: payload.user.modules ?? [],
    mfaRequired: payload.mfa?.required ?? false,
  };
};

export const isSessionExpired = (session: NormalizedSession) => {
  if (!session.expiresAt) {
    logWarn({
      scope: "auth:session",
      event: "expiry:unknown",
    });
    return false;
  }

  const expired = session.expiresAt.getTime() < Date.now();

  if (expired) {
    logWarn({
      scope: "auth:session",
      event: "expiry:elapsed",
      context: { expiresAt: session.expiresAt.toISOString() },
    });
  }

  return expired;
};



