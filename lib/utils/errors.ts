import { logInfo } from "@/lib/logging/console";

export type NormalizedError = {
  title: string;
  description: string;
  code?: string | number;
};

/**
 * Normalize unknown errors into a consistent structure for UI presentation.
 * Extend this mapper once backend error shapes are finalized.
 */
export const normalizeError = (error: unknown): NormalizedError => {
  logInfo({
    scope: "utils:errors",
    event: "normalize",
    context: { type: typeof error },
  });

  return {
    title: "Something went wrong",
    description:
      "Please retry the action or contact the Novo security desk if the issue persists.",
  };
};

