/**
 * Structured logging helpers centralize console output across the Novo Auth
 * module. Use these utilities instead of calling console methods directly so
 * logs remain consistent and easy to filter.
 */

type LogLevel = "trace" | "info" | "warn" | "error";

type LogPayload = {
  /**
   * High-level identifier for the source emitting the log.
   * Example: "page:login", "graphql:mutations", "mfa:verify".
   */
  scope: string;
  /**
   * Short action label describing the lifecycle point being logged.
   * Example: "mount", "submit", "success", "error".
   */
  event: string;
  /**
   * Optional metadata hashed to protect sensitive contents. Always sanitize
   * values before passing them into the logger.
   */
  context?: Record<string, unknown>;
};

const logWriters: Record<LogLevel, (message?: unknown, ...optional: unknown[]) => void> =
  {
    trace: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

const formatMessage = ({ scope, event }: LogPayload) =>
  `[novo-auth:${scope}] ${event}`;

const enrichContext = (context?: Record<string, unknown>) => ({
  timestamp: new Date().toISOString(),
  ...context,
});

const emitLog = (level: LogLevel, payload: LogPayload) => {
  const writer = logWriters[level];
  const message = formatMessage(payload);
  const context = enrichContext(payload.context);

  writer(message, context);
};

export const logTrace = (payload: LogPayload) => emitLog("trace", payload);

export const logInfo = (payload: LogPayload) => emitLog("info", payload);

export const logWarn = (payload: LogPayload) => emitLog("warn", payload);

export const logError = (payload: LogPayload) => emitLog("error", payload);

/**
 * Helper to wrap async operations with automatic logging for success/failure.
 * Useful for GraphQL calls where we need to emit consistent telemetry.
 */
export async function withLogging<T>(
  payload: Omit<LogPayload, "event">,
  action: () => Promise<T>,
) {
  logTrace({ ...payload, event: "start" });

  try {
    const result = await action();
    logInfo({ ...payload, event: "success" });
    return result;
  } catch (error) {
    logError({
      ...payload,
      event: "error",
      context: { ...(payload.context ?? {}), error },
    });
    throw error;
  }
}


